const express = require('express');
const router = express.Router();

router.get('/thank-you', (req, res) => {
	const ts = req.session?.justContactedAt || 0;
	const fresh = ts && Date.now() - ts < 5 * 60 * 1000; // 5-minute window
	// Consume the flag so refresh/back won’t replay
	if (req.session) req.session.justContactedAt = 0;
	if (!fresh) return res.redirect('/');
	res.render(`pages/thankYou.ejs`, { title: 'Thank you!' });
});

module.exports = router;
