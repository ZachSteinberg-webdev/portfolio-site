// Contact form endpoint with layered, user-invisible spam defenses
// Notes:
// - Supports AJAX (application/json) and no-JS HTML form (application/x-www-form-urlencoded)
// - Per-IP rate limit: 1 submission / hour
// - Permanent dedupe: exact same (name|email|message) accepted once, repeats are silently ignored
// - Stores per-layer scores + final_spam_score (1–100) for both accepted and rejected submissions
if (process.env.NODE_ENV !== 'production') {
	const dotenv = require('dotenv').config();
}
const express = require('express');
const crypto = require('node:crypto');
const dns = require('dns').promises;
const { rateLimit, ipKeyGenerator } = require('express-rate-limit'); // To prevent rapid contact submissions
const validator = require('validator'); // For email syntax check

const ContactFormSubmission = require('../models/contactFormSubmissionModel.js');
const SpamSubmission = require('../models/spamSubmissionModel.js');
const SubmissionFingerprint = require('../models/submissionFingerprintModel.js');

const { disableCache } = require('../utilities/contactCache.js');

const router = express.Router();

/* ---------- Settings ---------- */

// Minimum fill time setting (rejects instant bot posts)
const MIN_FILL_MS = Math.max(0, Number(process.env.CONTACT_FORM_MIN_FILL_TIME_MS) || 15000);

// Token age windows: stricter for AJAX; generous for plain form
const MAX_AGE_AJAX_MS = Number(process.env.CONTACT_FORM_MAX_AGE_AJAX_MS); // 12 hours
const MAX_AGE_FORM_MS = Number(process.env.CONTACT_FORM_MAX_AGE_FORM_MS); // 12 hours

// Per-client key: normalized IP (with IPv6 subnet masking) + compact header fingerprint - 1 message per hour
// User unique fingerprint comprised of ip address, user-agent, accept-language, accept, all hashed
// Prevents false positives on shared networks
const RATE_LIMIT_IPV6_SUBNET = Number(process.env.RATE_LIMIT_IPV6_SUBNET); // typical: 56–64
const keyGenerator = (req, res) => {
	// IMPORTANT: normalize the IP using the helper to avoid ERR_ERL_KEY_GEN_IPV6
	const ipPart = ipKeyGenerator(req.ip, RATE_LIMIT_IPV6_SUBNET);
	const ua = req.get('user-agent') || '';
	const al = req.get('accept-language') || '';
	const ac = req.get('accept') || '';
	const hdrHash = crypto.createHash('sha256').update(`${ua}|${al}|${ac}`).digest('hex').slice(0, 12); // short, opaque
	return `${ipPart}:${hdrHash}`;
};

// Contact limiter setup
const CONTACT_RATE_LIMIT_BYPASS_NAME = process.env.CONTACT_CONTACT_RATE_LIMIT_BYPASS_NAME || '';

const contactLimiter = rateLimit({
	windowMs: Number(process.env.CONTACT_FORM_RATE_LIMITER_WINDOW_MS), // 1 hour
	max: Number(process.env.CONTACT_FORM_RATE_LIMITER_MAX_IN_WINDOW), // 1
	standardHeaders: true,
	legacyHeaders: false,
	keyGenerator,
	skip: (req, _res) => {
		// allow bypass ONLY in production, and ONLY if the submitted
		// "name" matches your secret tester name exactly
		if (process.env.NODE_ENV === 'production' && CONTACT_RATE_LIMIT_BYPASS_NAME) {
			// For AJAX submits (JSON) and no-JS form submits (urlencoded),
			// the body parser should have run already.
			const submittedName = req.body && req.body.name ? String(req.body.name).trim() : '';
			if (submittedName === CONTACT_RATE_LIMIT_BYPASS_NAME) {
				return true; // skip rate limiting
			}
		}
		return false;
	},
	// Silent sink in prod, visible in dev
	handler: (req, res, _next, options) => {
		const isProd = process.env.NODE_ENV === 'production';
		const isJSON = req.is('application/json');
		if (isJSON && isProd) {
			return res.status(204).end(); // silent sink; don't leak signals to bots
			// No-JS form submit redirects with a status flag so the page can show an alert banner to a legitimate user
			// EJS sees query.status and conditionaly displays an alert banner
		} else if (!isJSON && isProd) {
			// No-JS user gets 303 redirect and query string inserted in URL
			return res.redirect(303, '/?status=rate_limited#contact');
		} else if (isJSON && !isProd) {
			// Rate limiter route for development
			return res.status(options.statusCode).json({ ok: false, error: 'rate_limited' });
		} else if (!isJSON && !isProd) {
			return res.status(options.statusCode).send('Too many requests; try again later.');
		}
	}
});

// HMAC secret for (ip|t)
const HMAC_SECRET = process.env.FORM_HMAC_SECRET;
const SIGNING_ENABLED = !!HMAC_SECRET;

// Warn if HMAC_SECRET environment variable is missing
if (!HMAC_SECRET) {
	console.warn('HMAC_SECRET is missing; signatures will always fail.');
}

// Signature helper
function sign(ip, t) {
	if (!HMAC_SECRET) return '__missing_secret__';
	return crypto.createHmac('sha256', HMAC_SECRET).update(`${ip}|${t}`).digest('hex');
}

// Disable HMAC signing if FORM_HMAC_SECRET environment variable is missing
function verifySig(ip, t, sig) {
	if (!SIGNING_ENABLED) return true; // don’t block when disabled
	return !!sig && sig === sign(ip, t);
}

// Email syntax options (single source of truth)
const EMAIL_VALIDATOR_OPTS = {
	allow_display_name: false,
	allow_utf8_local_part: true, // allow international local parts
	require_tld: true, // must include a TLD
	ignore_max_length: true // leniency vs. RFC 5321 length limits
};

/* ---------- Helpers ---------- */
// Centralized spam logger (no response side-effects)
// Purpose: log the attempt with a consistent doc shape
async function logSpam({
	req, // Express request (for header snapshot)
	name,
	email,
	message, // raw fields
	mode,
	age, // meta basics
	flags = {}, // { honeypot, tooFast, tooOld, badSig, ajaxNoJS, emailBad, ... }
	spamTrapData, // e.g., { hpKey, hpVal } (optional)
	scorePack, // optional: { final, rawSignals:{ urlCount,length,nonLatinOnly }, mxOk, scores }
	metaExtras = {}, // optional: any extra meta fields to merge
	finalScore // optional: override final score if not using scorePack
}) {
	const baseMeta = {
		mode,
		age,
		flags,
		headers: headerSnapshot(req, mode),
		client: clientMetaFrom(req)
	};

	if (scorePack) {
		baseMeta.urlCount = scorePack?.rawSignals?.urlCount ?? undefined;
		baseMeta.length = scorePack?.rawSignals?.length ?? undefined;
		baseMeta.nonLatinOnly = scorePack?.rawSignals?.nonLatinOnly ?? undefined;
		baseMeta.mxOk = scorePack?.mxOk ?? undefined;
		baseMeta.scores = scorePack?.scores ?? undefined;
	}

	await SpamSubmission.create({
		name,
		email,
		message,
		spamTrapData,
		meta: { ...baseMeta, ...metaExtras },
		final_spam_score: scorePack ? scorePack.final : typeof finalScore === 'number' ? finalScore : 90
	});
}

// Silent sink wrapper (log and end response with 200)
// Keep UX consistent for bots; no visible error
async function sinkSpam(args, res) {
	await logSpam(args);
	const { mode, req } = args || {};
	return respondContactSuccess({ req, res, mode });
}

// Normalize strings before hashing/dedupe
function norm(s) {
	return String(s || '').trim();
}

// Email MX check (log-only)
async function hasMX(domain) {
	if (!domain) return false;
	try {
		const mx = await dns.resolveMx(domain);
		return Array.isArray(mx) && mx.length > 0;
	} catch {
		return false;
	}
}

// Same-origin + basic header sanity
function looksSameOrigin(req, mode) {
	const host = `${req.protocol}://${req.get('host')}`;
	const origin = req.get('origin') || '';
	const referer = req.get('referer') || '';
	if (mode === 'ajax') {
		const sfs = req.get('sec-fetch-site') || '';
		const originOK = !origin || origin === host;
		const sameSiteFetch = sfs === '' || sfs === 'same-origin' || sfs === 'same-site';
		return originOK && sameSiteFetch;
	}
	return !referer || referer.startsWith(host);
}

function headerSnapshot(req, mode) {
	const ua = req.get('user-agent') || '';
	const accept = (req.get('accept') || '').toLowerCase();
	const sfm = (req.get('sec-fetch-mode') || '').toLowerCase();
	const sfd = (req.get('sec-fetch-dest') || '').toLowerCase();

	const uaOK = ua.length > 10;
	const acceptOK = accept.includes('text/html') || accept.includes('application/json');
	const fetchOK = mode === 'ajax' ? (sfm === '' || sfm === 'cors') && (sfd === '' || sfd === 'empty') : true;

	return { uaOK, acceptOK, fetchOK };
}

// Email syntax check helper
function isEmailSyntaxOk(email) {
	return validator.isEmail(String(email || '').trim(), EMAIL_VALIDATOR_OPTS);
}

// Deduplication helpers
// Normalize Unicode; drop zero-width; lower-case
function baseClean(s) {
	return String(s || '')
		.normalize('NFKC')
		.replace(/[\u200B-\u200D\uFEFF]/g, '')
		.toLowerCase();
}

// Name: normalize; trim; collapse internal whitespace to SINGLE space.
// Don't remove ALL spaces here so "mary ann" !== "maryann"
function canonicalizeName(s) {
	return baseClean(s).trim().replace(/\s+/g, ' ');
}

// Email: normalize; remove ALL whitespace; lower-case.
// Plus-tag removal for all domains; dot-stripping only for Gmail-family.
function canonicalizeEmail(s) {
	const e = baseClean(s).replace(/\s+/g, ''); // remove any spaces/tabs/newlines
	const m = e.match(/^([^@]+)@([^@]+)$/);
	if (!m) return e; // malformed — still returns a stable canonical string
	let [, local, domain] = m; // ignore m[0], grab m[1], m[2]

	// Normalize some common provider quirks
	domain = domain === 'googlemail.com' ? 'gmail.com' : domain;

	// Remove plus-tags for most providers (joe+tag@example.com converts to joe@example.com)
	local = local.split('+')[0];

	// Gmail ignores dots in the local part; apply only for gmail
	if (domain === 'gmail.com') local = local.replace(/\./g, '');

	return `${local}@${domain}`;
}

// Message (strict): normalize; drop zero-width; drop ALL whitespace; lower-case.
function canonicalizeMessage(s) {
	return baseClean(s).replace(/\s+/g, '');
}

// Permanent duplicate suppression
async function seenBefore(name, email, message) {
	const payload = JSON.stringify([canonicalizeName(name), canonicalizeEmail(email), canonicalizeMessage(message)]);
	const fp = crypto.createHash('sha256').update(payload).digest('hex');
	try {
		await SubmissionFingerprint.create({ fp });
		return false; // Form submission never seen before; combo of name, email and message are unique
	} catch (e) {
		if (e?.code === 11000) return true; // Form submission duplicate; combo of name, email, message not unique
		throw e;
	}
}

// ---- IP address helpers (mask + hash) ----
const IP_HASH_SALT = process.env.IP_HASH_SALT || 'dev-salt'; // set a strong secret in prod

function getClientIP(req) {
	// trust proxy is already set; prefer Cloudflare/Heroku headers if present
	return req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] || req.ip || '';
}

function maskIPv4To24(ip) {
	const m = ip.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
	return m ? `${m[1]}.${m[2]}.${m[3]}.0/24` : '';
}

// zero the lower 64 bits and add /64 suffix
function maskIPv6To64(ip) {
	if (!ip.includes(':')) return '';
	// normalize :: shorthand to 8 hextets
	const parts = ip.split(':');
	const expanded = [];
	let skipped = false;
	for (let i = 0; i < parts.length; i++) {
		if (parts[i] === '' && !skipped) {
			const missing = 9 - parts.length;
			for (let j = 0; j < missing; j++) expanded.push('0000');
			skipped = true;
		} else {
			expanded.push(parts[i].padStart(4, '0'));
		}
	}
	while (expanded.length < 8) expanded.push('0000');
	// zero lower 64 bits
	expanded[4] = '0000';
	expanded[5] = '0000';
	expanded[6] = '0000';
	expanded[7] = '0000';
	// compress back a bit (optional)
	const masked = expanded.join(':').replace(/(^|:)0{1,3}/g, '$1'); // minimal prettify
	return `${masked}/64`;
}

function ipNetworkString(ip) {
	if (!ip) return '';
	return ip.includes(':') ? maskIPv6To64(ip) : maskIPv4To24(ip);
}

function ipHash(ip) {
	if (!ip) return '';
	return crypto.createHmac('sha256', IP_HASH_SALT).update(ip).digest('hex');
}

function clientMetaFrom(req) {
	const ipRaw = getClientIP(req);
	return {
		ipNetwork: ipNetworkString(ipRaw), // e.g., "203.0.113.0/24" or "2001:db8:...::/64"
		ipHash: ipHash(ipRaw)
	};
}

/* ---------- Scoring (log-only; never blocks) ---------- */

// Per-layer scoring weights (tune as needed)
const WEIGHTS = {
	urlCount: 25, // weight if URL count > 1
	length: 10, // weight if message very long
	nonLatin: 15, // weight if message lacks Latin letters
	headerAnom: 20, // weight if headers look non-browser-ish
	mxMissing: 15 // weight if email domain lacks MX
};

// Compute raw signals + per-layer scores + final 1–100
function computeScores({ message, headers, mxOk }) {
	const m = String(message || '');
	const urlCount = (m.match(/https?:\/\/\S+/gi) || []).length;
	const length = m.length;
	const nonLatinOnly = /^[^A-Za-z]*$/.test(m.replace(/\s+/g, ''));

	const scores = {
		urlCount: urlCount > 1 ? WEIGHTS.urlCount : 0,
		length: length > 1500 ? WEIGHTS.length : 0,
		nonLatin: nonLatinOnly ? WEIGHTS.nonLatin : 0,
		headerAnom: headers.uaOK && headers.acceptOK && headers.fetchOK ? 0 : WEIGHTS.headerAnom,
		mxMissing: mxOk ? 0 : WEIGHTS.mxMissing
	};

	// Sum and normalize (1–100). Clamp so there is always at least 1.
	const raw = Object.values(scores).reduce((a, b) => a + b, 0);
	const capped = Math.max(1, Math.min(100, raw));

	return {
		rawSignals: { urlCount, length, nonLatinOnly },
		scores,
		final: capped
	};
}

/* ---------- Success Response ---------- */
function respondContactSuccess({ req, res, mode, payload = { ok: true } }) {
	if (mode === 'ajax') {
		return res.status(200).json(payload); // explicit 200
	}
	if (mode === 'form') {
		if (req?.session) {
			// One-time thank-you gate flag
			req.session.justContactedAt = Date.now();
			// Ensure session is persisted before redirect (avoids rare race on fast redirects)
			return req.session.save(() => res.redirect(303, '/thank-you'));
			// To log save errors:
			// return req.session.save(err => { if (err) console.error(err); return res.redirect(303, '/thank-you'); });
		}
		// Fallback if session isn't available for some reason
		return res.redirect(303, '/thank-you');
	}
	// Fallback for unexpected mode
	return res.status(200).end();
}

/* ---------- Route ---------- */

router.post('/contact', contactLimiter, async (req, res) => {
	disableCache(res); // Always disable cache for /contact responses
	// Mode detection
	const isJSON = req.is('application/json');
	const isForm = req.is('application/x-www-form-urlencoded');
	const mode = isJSON ? 'ajax' : isForm ? 'form' : 'other';
	if (mode === 'other') return res.status(415).end();

	// Body fields
	const body = req.body || {};
	const name = norm(body.name); // norm only trims leading and trailing whitespace
	const email = norm(body.email);
	const message = norm(body.message);

	// Permanent duplicate suppression
	if (await seenBefore(name, email, message)) {
		// Silent success for user; no duplicate notifications server-side.
		if (mode === 'ajax') return res.json({ ok: true, deduped: true });
		if (mode === 'form') {
			req.session.justContactedAt = Date.now();
			return req.session.save(() => res.redirect(303, '/thank-you'));
		}
	}

	// Origin + headers
	// if (!looksSameOrigin(req, mode)) return res.status(204).end();
	const headers = headerSnapshot(req, mode);
	// Do not block solely on header anomaly; include in scoring and continue.

	// Anti-automation tokens
	const t = Number(body.t);
	const sig = String(body.sig || '');
	const age = Date.now() - t;

	// Honeypot (rotates per render). Bots tend to fill everything.
	const hpKey = Object.keys(body).find((k) => /^hp_[0-9a-f]{12}$/i.test(k)) || null;
	const hpVal = hpKey ? String(body[hpKey] || '') : '';

	// JS handshake (AJAX only)
	const jsReady = String(body.js_ready || '0') === '1';

	// Token validity
	const tooFast = !Number.isFinite(age) || age < MIN_FILL_MS;
	const tooOld =
		mode === 'ajax' ? Number.isFinite(age) && age > MAX_AGE_AJAX_MS : Number.isFinite(age) && age > MAX_AGE_FORM_MS;
	const badSig = !verifySig(req.ip, String(t), sig);

	// Email syntax validation (server-side). Block obvious bot posts.
	if (!isEmailSyntaxOk(email)) {
		return sinkSpam(
			{
				req,
				res,
				name,
				email,
				message,
				mode,
				age,
				flags: { emailBad: true },
				finalScore: 90
			},
			res
		);
	}

	// Field presence
	if (!name || !email || !message) {
		if (mode === 'ajax') return res.status(400).json({ ok: false, error: 'Missing fields' });
		return res.redirect('/?status=missing#contact');
	}

	// Email MX (log only)
	const domain = (email.split('@')[1] || '').toLowerCase();
	const mxOk = await hasMX(domain);

	// Content signals + score (informational only)
	const scorePack = computeScores({ message, headers, mxOk });

	// Hard spam decision (no scoring factors here)
	const isSpam = Boolean(
		hpVal ||
			tooFast ||
			badSig || // core traps
			(mode === 'ajax' && !jsReady) // ajax requires JS handshake
	);

	if (isSpam || tooOld) {
		const flags = { honeypot: !!hpVal, tooFast, tooOld, badSig, ajaxNoJS: mode === 'ajax' && !jsReady };
		const spamTrapData = { hpKey, hpVal };
		// Token too old: treat gently in form mode
		if (!isSpam && tooOld && mode === 'form') {
			await logSpam({ req, name, email, message, mode, age, flags, spamTrapData, scorePack });
			return res.redirect('/?status=expired#contact');
		}

		return sinkSpam({ req, name, email, message, mode, age, flags, spamTrapData, scorePack }, res);
	}

	// Save accepted submission
	await ContactFormSubmission.create({
		name,
		email,
		message,
		meta: {
			mode,
			age,
			mxOk,
			headers,
			client: clientMetaFrom(req),
			urlCount: scorePack.rawSignals.urlCount,
			length: scorePack.rawSignals.length,
			nonLatinOnly: scorePack.rawSignals.nonLatinOnly,
			scores: scorePack.scores
		},
		final_spam_score: scorePack.final
	});

	// Respond success
	return respondContactSuccess({ req, res, mode });
});

module.exports = router;
