if (process.env.NODE_ENV !== 'production') {
	const dotenv = require('dotenv').config();
}
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const ejsMate = require('ejs-mate');
const hmsTime = require('./utilities/hmsTime');
const cookieParser = require('cookie-parser'); // Cookie parsing needed for csurf cookie
const csurf = require('@dr.pogodin/csurf'); // CSRF protection
const crypto = require('node:crypto'); // HMAC and honeypot name
const ContactFormSubmission = require('./models/contactFormSubmissionModel.js');
const SpamSubmission = require('./models/spamSubmissionModel.js');
const { errorHandler } = require('./utilities/errorHandling');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('trust proxy', 2);
app.engine('ejs', ejsMate);

app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

// MongoDB Atlas session store
app.use(
	session({
		// Cookie name for this app
		name: 'portfolio.sid', // Secret for signing the session ID cookie
		secret: process.env.EXPRESS_SESSION_SECRET, // Do not re-save unmodified sessions
		resave: false, // Do not create a session until something is actually stored on req.session
		saveUninitialized: false, // Reduce write churn; do not bump expiry on every request
		rolling: false, // Cookie settings
		cookie: {
			httpOnly: true, // Prevent JS from reading the cookie
			sameSite: 'lax', // CSRF-friendly default
			secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in prod
			maxAge: 30 * 60 * 1000 // Session lifetime = 30 minutes
		},
		// Backing store (MongoDB Atlas URI)
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_ATLAS_URL, // Same URL used by Mongoose
			collectionName: 'sessions',
			ttl: 24 * 60 * 60, // Expire server-side sessions after 1 day (seconds)
			autoRemove: 'native',
			touchAfter: 24 * 60 * 60 // Throttle session updates (seconds)
		})
	})
);

/* ---------- Parsers ---------- */

// JSON body parser (AJAX mode)
app.use(express.json({ limit: '10kb' }));

// URL-encoded body parser (plain HTML form mode)
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Cookies for CSRF
app.use(cookieParser());

/* ---------- CSRF ---------- */

// CSRF token via cookie; token rendered as hidden input in form
app.use(
	csurf({
		cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' }
	})
);

/* ---------- Per-request locals for contact form ---------- */

app.use((req, res, next) => {
	// Rotating honeypot field name (random per request)
	res.locals.hpName = `hp_${crypto.randomBytes(6).toString('hex')}`;

	// Render timestamp string
	res.locals.t = Date.now().toString();

	// HMAC signature of (ip|t)
	const HMAC_SECRET = process.env.FORM_HMAC_SECRET || 'development-only-change-me';
	res.locals.sig = crypto.createHmac('sha256', HMAC_SECRET).update(`${req.ip}|${res.locals.t}`).digest('hex');

	// CSRF token for hidden input
	res.locals.csrfToken = req.csrfToken();

	// Status helper for no-JS redirects (?status=...)
	res.locals.status = req.query.status;

	next();
});

/* ---------- Trust proxy (if behind proxy/load balancer) ---------- */

// Trust proxy for accurate req.ip when on managed hosting/CDN
app.set('trust proxy', 1);

// Routes -----------------------------------------------------------

// Main page route
const indexRouter = require('./routes/index.js');
app.use(indexRouter);

// Contact route
const contactRouter = require('./routes/contact.js');
app.use(contactRouter);

// Thank you (post form submission) route
const thankYouRouter = require('./routes/thankYou.js');
app.use(thankYouRouter);

// Debug route
app.get('/debug/ip', (req, res) => {
	res.json({
		ip: req.ip,
		ips: req.ips, // array from X-Forwarded-For
		xff: req.get('x-forwarded-for') || null,
		secure: req.secure
	});
});

// 404 route
const status404Router = require('./routes/status404.js');
app.use(status404Router);

app.use((err, req, res, next) => {
	errorHandler(err, req, res, next);
});

const mongoDbUrl = process.env.MONGO_ATLAS_URL;

mongoose
	.connect(mongoDbUrl)
	.then(() => {
		console.log(`${hmsTime()}: Mongo connection open.`);
	})
	.catch((error) => {
		console.log(`${hmsTime()}: Mongo error: ${error}`);
	});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`App is listening on port ${port}!`);
});
