if (process.env.NODE_ENV !== 'production') {
	const dotenv = require('dotenv').config();
}
const express = require('express');
const router = express.Router();
const toBoolean = require('../utilities/toBoolean');

// Debug JSON route ----------------------------------------------------------

const ENABLE_DEBUG = toBoolean(process.env.ENABLE_DEBUG) === true;

function requireAdminToken(req, res, next) {
	if (req.get('x-admin-token') === process.env.ADMIN_TOKEN) return next();
	return res.sendStatus(404); // don’t advertise the route
}

const ALLOWLIST = (process.env.DEBUG_IP_ALLOWLIST || '')
	.split(',')
	.map((s) => s.trim())
	.filter(Boolean);

// If allow list is empty, requireAllowlistedIp is bypassed
function requireAllowlistedIp(req, res, next) {
	if (!ALLOWLIST.length || ALLOWLIST.includes(req.ip)) return next();
	return res.sendStatus(404);
}

if (ENABLE_DEBUG) {
	router.get('/debug/ip', requireAdminToken, requireAllowlistedIp, (req, res) => {
		res.set('Cache-Control', 'no-store');
		res.json({
			ip: req.ip,
			ips: req.ips,
			xff: req.get('x-forwarded-for') || null,
			cf: req.get('cf-connecting-ip') || null,
			secure: req.secure
		});
	});
}

module.exports = router;
