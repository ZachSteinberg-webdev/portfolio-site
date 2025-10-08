const express = require('express');
const router = express.Router();
const { tryCatch } = require('../utilities/errorHandling');
const { projects } = require('../data/projects.js');
const { skills } = require('../data/skills.js');

// Main page route ----------------------------------------------------------
router.get(
	'/',
	tryCatch(async (req, res) => {
		res.render('pages/index', {
			req,
			projects,
			skills,
			title: 'Zach Steinberg | Web Deverloper'
		});
	})
);

module.exports = router;
