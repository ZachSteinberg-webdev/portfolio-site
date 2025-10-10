const express = require('express');
const router = express.Router();
const { tryCatch } = require('../utilities/errorHandling');
const { projects } = require('../data/projects.js');
const { skills } = require('../data/skills.js');
const crypto = require('node:crypto');

// toggle signing off if FORM_HMAC_SECRET is missing
const HMAC_SECRET = process.env.FORM_HMAC_SECRET || '';
const SIGNING_ENABLED = !!HMAC_SECRET;
const sign = (ip, t) =>
	!SIGNING_ENABLED ? '' : crypto.createHmac('sha256', HMAC_SECRET).update(`${ip}|${t}`).digest('hex');

// Main page route ----------------------------------------------------------
router.get(
	'/',
	tryCatch(async (req, res) => {
		const t = Date.now();
		const sig = sign(req.ip, String(t));
		const hpKey = `hp_${crypto.randomBytes(6).toString('hex')}`;
		res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
		res.set('Pragma', 'no-cache');
		res.set('Expires', '0');
		res.render('pages/index', {
			req,
			projects,
			skills,
			title: 'Zach Steinberg | Web Deverloper',
			t,
			sig,
			hpKey
		});
	})
);

module.exports = router;
