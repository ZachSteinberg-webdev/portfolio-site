const express = require('express');
const router = express.Router();
const { CustomError } = require('../utilities/errorHandling');

// 404 page route ----------------------------------------------------------
router.get('/*', (req, res, next) => {
	next(new CustomError(404, 'Page not found', '404Error'));
});

module.exports = router;
