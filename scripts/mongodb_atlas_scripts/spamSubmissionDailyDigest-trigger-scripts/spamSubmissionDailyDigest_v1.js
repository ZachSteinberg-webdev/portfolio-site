/* global context */
exports = async function () {
	// ===== Config (from App Services Values/Secrets) =====
	const SMTP_HOST = context.values.get('SMTP_HOST');
	const SMTP_PORT = Number(context.values.get('SMTP_PORT'));
	const SMTP_USER = context.values.get('SMTP_USER');
	const SMTP_PASS = context.values.get('SMTP_PASS');
	const SMTP_FROM = context.values.get('SMTP_FROM');
	const SMTP_TO = context.values.get('SMTP_TO');

	const DB_NAME = 'test';
	const COLL = 'spamsubmissions';

	// Time window: last 24h
	const now = new Date();
	const start = new Date(now.getTime() - 24 * 60 * 60 * 1000);

	// ===== Helpers =====
	const TZ = 'America/Los_Angeles';
	const MONTHS = [
		'',
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const pad2 = (n) => String(n).padStart(2, '0');
	function ordinal(n) {
		const s = ['th', 'st', 'nd', 'rd'],
			v = n % 100;
		return s[(v - 20) % 10] || s[v] || s[0];
	}

	// parts: { year, month(1-12), day, hour(0-23), minute, second, dayOfWeek(1=Sun...?) }
	// $dateToParts returns dayOfWeek 1=Sunday..7=Saturday in SERVER-7.0+; if absent, derive weekday from JS below.
	function formatFromParts(parts, withWeekday = true) {
		const y = parts.year,
			m = parts.month,
			d = parts.day;
		const hour24 = parts.hour ?? 0,
			min = parts.minute ?? 0,
			sec = parts.second ?? 0;

		const hour12 = hour24 % 12 || 12;
		const ampm = hour24 >= 12 ? 'PM' : 'AM';

		// Derive weekday safely if not present
		let weekday = parts.dayOfWeek;
		if (typeof weekday !== 'number') {
			// Rebuild a JS date from parts in Pacific and get weekday
			// (approximate by constructing a UTC date for display only)
			const dt = new Date(Date.UTC(y, m - 1, d, hour24, min, sec));
			weekday = dt.getUTCDay(); // 0..6 (Sun..Sat)
			return `${WEEKDAYS_SHORT[weekday]}, ${MONTHS[m]} ${d}${ordinal(d)}, ${y} @ ${pad2(hour12)}:${pad2(min)}:${pad2(
				sec
			)} ${ampm}`;
		}
		// Convert 1..7 (Sun..Sat) to 0..6
		const wdIdx = (weekday - 1 + 7) % 7;
		return `${WEEKDAYS_SHORT[wdIdx]}, ${MONTHS[m]} ${d}${ordinal(d)}, ${y} @ ${pad2(hour12)}:${pad2(min)}:${pad2(
			sec
		)} ${ampm}`;
	}

	function formatShortFromParts(parts) {
		const y = parts.year,
			m = parts.month,
			d = parts.day;
		let weekday = parts.dayOfWeek;
		if (typeof weekday !== 'number') {
			const dt = new Date(Date.UTC(y, m - 1, d, parts.hour ?? 0, parts.minute ?? 0, parts.second ?? 0));
			weekday = dt.getUTCDay();
			return `${WEEKDAYS_SHORT[weekday]}, ${MONTHS[m]} ${d}${ordinal(d)}`;
		}
		const wdIdx = (weekday - 1 + 7) % 7;
		return `${WEEKDAYS_SHORT[wdIdx]}, ${MONTHS[m]} ${d}${ordinal(d)}`;
	}

	// Returns -7 (PDT) or -8 (PST) for the given UTC date/time.
	function pacificOffsetHoursUTC(dt) {
		const y = dt.getUTCFullYear();

		// helper: nth weekday of month (UTC math, weekday: 0=Sun..6=Sat)
		function nthWeekdayOfMonth(year, monthIndex, weekday, n) {
			const first = new Date(Date.UTC(year, monthIndex, 1));
			const firstW = first.getUTCDay();
			const add = ((7 + weekday - firstW) % 7) + 7 * (n - 1);
			return new Date(Date.UTC(year, monthIndex, 1 + add));
		}
		function firstWeekdayOfMonth(year, monthIndex, weekday) {
			return nthWeekdayOfMonth(year, monthIndex, weekday, 1);
		}

		// US DST: starts 2am local (PST, UTC-8) on 2nd Sunday in March → 10:00 UTC
		//         ends   2am local (PDT, UTC-7) on 1st Sunday in Nov  → 09:00 UTC
		const marchSecondSunday = nthWeekdayOfMonth(y, 2, 0, 2); // March idx=2
		const novFirstSunday = firstWeekdayOfMonth(y, 10, 0); // Nov   idx=10
		const dstStartUTC = new Date(Date.UTC(y, 2, marchSecondSunday.getUTCDate(), 10, 0, 0));
		const dstEndUTC = new Date(Date.UTC(y, 10, novFirstSunday.getUTCDate(), 9, 0, 0));

		return dt >= dstStartUTC && dt < dstEndUTC ? -7 : -8;
	}

	// Determine correct zone abbreviation (PDT vs. PST)
	function zoneAbbrevFromParts(parts) {
		const dt = new Date(
			Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour || 0, parts.minute || 0, parts.second || 0)
		);
		return pacificOffsetHoursUTC(dt) === -7 ? 'PDT' : 'PST';
	}

	// Build a "Pacific parts" object from a UTC Date (no Intl used)
	function pacificPartsFromUTC(dt) {
		const off = pacificOffsetHoursUTC(dt); // -7 or -8
		const ms = dt.getTime() + off * 3600 * 1000; // shift to Pacific
		const d2 = new Date(ms);
		return {
			year: d2.getUTCFullYear(),
			month: d2.getUTCMonth() + 1, // 1-12
			day: d2.getUTCDate(),
			hour: d2.getUTCHours(),
			minute: d2.getUTCMinutes(),
			second: d2.getUTCSeconds(),
			dayOfWeek: d2.getUTCDay() + 1 // 1..7 (Sun..Sat)
		};
	}

	// Sanitize potential HTML in user-submitted strings
	function escapeHtml(s) {
		return String(s ?? '')
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	}

	// Build list of positive flags for SPAM detection
	function flagsList(meta) {
		const flags = meta?.flags || {};
		const truthy = Object.entries(flags)
			.filter(([, v]) => !!v)
			.map(([k]) => k);
		return truthy.length ? truthy.join(', ') : 'none';
	}

	// Build list of bad headers
	function headersList(meta) {
		const headers = meta?.headers || {};
		const falsy = Object.entries(headers)
			.filter(([, v]) => !v)
			.map(([k]) => k);
		return falsy.length ? falsy.join(', ') : 'all OK';
	}

	// ===== Query DB via aggregation that computes Pacific parts server-side =====
	const svc = context.services.get('Cluster0');
	const coll = svc.db(DB_NAME).collection(COLL);

	const docs = await coll
		.aggregate([
			{ $match: { createdAt: { $gte: start, $lte: now } } },
			{ $sort: { createdAt: 1 } },
			{ $limit: 500 },
			{
				$addFields: {
					_createdParts: { $dateToParts: { date: '$createdAt', timezone: TZ } },
					_startParts: { $dateToParts: { date: start, timezone: TZ } },
					_nowParts: { $dateToParts: { date: now, timezone: TZ } }
				}
			}
		])
		.toArray();

	// ===== Build email =====
	let html = '';
	if (!docs.length) {
		html = `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.45;">
          <p>No new SPAM emails received in the last 24 hours.</p>
        </td></tr>
      </table>`;
	} else {
		const windowStartStr = `${formatFromParts(docs[0]._startParts, true)} ${zoneAbbrevFromParts(docs[0]._startParts)}`;
		const windowNowStr = `${formatFromParts(docs[0]._nowParts, true)} ${zoneAbbrevFromParts(docs[0]._nowParts)}`;

		const rows = docs
			.map((d) => {
				// Message details
				const created = d._createdParts
					? `${formatFromParts(d._createdParts, true)} ${zoneAbbrevFromParts(d._createdParts)}`
					: 'unknown';
				const name = d.name ?? '';
				const email = d.email ?? '';
				const message = d.message ?? '';
				// Flags list
				const flags = flagsList(d.meta);
				// Headers list
				const headers = headersList(d.meta);
				// SPAM scoring
				const finalSpamScore = Number(d.final_spam_score ?? 0);
				const urlCountScore = Number(d.meta?.scores?.urlCount ?? 0);
				const lengthScore = Number(d.meta?.scores?.length ?? 0);
				const nonLatinScore = Number(d.meta?.scores?.nonLatin ?? 0);
				const headerAnomScore = Number(d.meta?.scores?.headerAnom ?? 0);
				const mxMissingScore = Number(d.meta?.scores?.mxMissing ?? 0);
				// Miscellaneous metadata
				const urlCount = Number(d.meta?.urlCount ?? 0);
				const length = Number(d.meta?.length ?? 0);
				const nonLatinOnly = d.meta?.nonLatinOnly ? 'true' : 'false';
				const spamTrapData = d.spamTrapData ?? '';
				const mode = d.meta?.mode ?? '';
				const age = d.meta?.age ?? '';
				const mxOk = d.meta?.mxOk ? 'true' : 'false';

				return `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0;border:1px solid #4b4b4bff;border-radius:8px;">
          <tr>
            <td style="padding:12px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.45;">
              <p style="margin:0 0 8px 0;font-weight:bold;text-decoration:underline;">Message Details</p>
              <p style="margin:0;"><strong>Created:</strong> ${created}</p>
              <p style="margin:0;"><strong>Name:</strong> ${escapeHtml(name)}</p>
              <p style="margin:0 0 8px 0;"><strong>Email:</strong> ${escapeHtml(email)}</p>
        
              <p style="margin:0;"><strong>Flags:</strong> ${escapeHtml(flags)}</p>
              <p style="margin:0 0 8px 0;"><strong>Headers:</strong> ${escapeHtml(headers)}</p>
        
              <p style="margin:0 0 4px 0;"><strong>Final SPAM Score:</strong> ${finalSpamScore}</p>
        
              <p style="margin:8px 0 4px 0;font-weight:bold;text-decoration:underline;">Component SPAM scoring</p>
              <p style="margin:0;"><strong>urlCountScore:</strong> ${urlCountScore}</p>
              <p style="margin:0;"><strong>nonLatinScore:</strong> ${nonLatinScore}</p>
              <p style="margin:0;"><strong>lengthScore:</strong> ${lengthScore}</p>
              <p style="margin:0;"><strong>headerAnomScore:</strong> ${headerAnomScore}</p>
              <p style="margin:0 0 8px 0;"><strong>mxMissingScore:</strong> ${mxMissingScore}</p>
        
              <p style="margin:0 0 4px 0;font-weight:bold;text-decoration:underline;">Miscellaneous Metadata</p>
              <p style="margin:0;"><strong>urlCount:</strong> ${urlCount}</p>
              <p style="margin:0;"><strong>length:</strong> ${length}</p>
              <p style="margin:0;"><strong>nonLatinOnly:</strong> ${nonLatinOnly}</p>
              <p style="margin:0;"><strong>mxOk:</strong> ${mxOk}</p>
              <p style="margin:0;"><strong>mode:</strong> ${escapeHtml(mode)}</p>
              <p style="margin:0;"><strong>age:</strong> ${age}</p>
              <p style="margin:0;"><strong>spamTrapData:</strong></p>
              <ul style="margin:0;list-style:none;padding-inline-start:8px;">
                <li style="margin:0;"><strong>hpKey:</strong> <span style="white-space:pre;">${spamTrapData.hpKey === '' ? '' : '"'}${spamTrapData.hpKey === '' ? 'N/A' : escapeHtml(spamTrapData.hpKey)}${spamTrapData.hpKey === '' ? '' : '"'}</span></li>
                <li style="margin:0;"><strong>hpVal:</strong> <span style="white-space:pre-wrap;">${spamTrapData.hpVal === '' ? '' : '"'}${spamTrapData.hpVal === '' ? 'N/A' : escapeHtml(spamTrapData.hpVal)}${spamTrapData.hpVal === '' ? '' : '"'}</span></li>
              </ul>
        
              <p style="margin:0 0 4px 0;font-weight:bold;text-decoration:underline;"><strong>Message</strong></p>
              <div style="white-space:pre-wrap;word-break:break-word;">${escapeHtml(message)}</div>
            </td>
          </tr>
        </table>`;
			})
			.join('');

		html = `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.45;">
          <p>Daily SPAM digest for the last 24 hours (${windowStartStr} to ${windowNowStr}):</p>
          <p><strong>Total:</strong> ${docs.length}</p>
          ${rows}
        </td></tr>
      </table>`;
	}

	// ===== Send via nodemailer =====
	const nodemailer = require('nodemailer');
	const transporter = nodemailer.createTransport({
		host: SMTP_HOST,
		port: SMTP_PORT,
		secure: SMTP_PORT === 465,
		auth: { user: SMTP_USER, pass: SMTP_PASS }
	});

	// === Subject line (always include short Pacific date) ===
	let nowParts;
	if (docs.length) {
		// we already computed _nowParts via $dateToParts in the aggregation
		nowParts = docs[0]._nowParts;
	} else {
		// Try to compute Pacific "now" via a tiny aggregate that always returns 1 doc if the collection has any doc at all.
		const probe = await coll
			.aggregate([{ $limit: 1 }, { $project: { _id: 0, parts: { $dateToParts: { date: now, timezone: TZ } } } }])
			.toArray();

		// If collection is empty, fall back to local computation (handles PDT/PST correctly)
		nowParts = probe[0]?.parts || pacificPartsFromUTC(now);
	}

	const subjectDate = formatShortFromParts(nowParts);
	const subject = docs.length
		? `SPAM digest for ${subjectDate}: ${docs.length} new item${docs.length === 1 ? '' : 's'}`
		: `SPAM digest for ${subjectDate}: no new items`;

	await transporter.sendMail({ from: SMTP_FROM, to: SMTP_TO, subject, html });
	return { ok: true, count: docs.length };
};
