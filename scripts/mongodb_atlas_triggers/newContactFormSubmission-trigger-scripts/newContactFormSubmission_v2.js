const nodemailer = require('nodemailer');

exports = async function (changeEvent) {
	console.log('New contact request form submission');

	// ===== Config (from App Services Values/Secrets) =====
	const SMTP_HOST = context.values.get('SMTP_HOST');
	const SMTP_PORT = Number(context.values.get('SMTP_PORT'));
	const SMTP_USER = context.values.get('SMTP_USER');
	const SMTP_PASS = context.values.get('SMTP_PASS');
	const SMTP_FROM = context.values.get('SMTP_FROM');
	const SMTP_TO = context.values.get('SMTP_TO');

	// Get current date and time
	const now = new Date();

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

	// Sanitize possible HTML in user-submitted strings
	function escapeHtml(s) {
		return String(s ?? '')
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	}

	// Create list of bad headers
	function headersList(meta) {
		const headers = meta?.headers || {};
		const falsy = Object.entries(headers)
			.filter(([, v]) => !v)
			.map(([k]) => k);
		return falsy.length ? falsy.join(', ') : 'all OK';
	}

	// Compose email
	const transporter = nodemailer.createTransport({
		host: SMTP_HOST,
		port: SMTP_PORT,
		secure: SMTP_PORT === 465,
		auth: { user: SMTP_USER, pass: SMTP_PASS }
	});
	const info = await transporter.sendMail({
		from: SMTP_FROM,
		to: SMTP_TO,
		replyTo: `${escapeHtml(changeEvent.fullDocument.email)}`,
		subject: `New contact form submission from ${escapeHtml(changeEvent.fullDocument.name)}`,
		html: `<p>You have received a new contact form submission from ${escapeHtml(changeEvent.fullDocument.name)}.</p>
       <p>${escapeHtml(changeEvent.fullDocument.name)}'s email address is ${escapeHtml(
			changeEvent.fullDocument.email
		)}.</p>
       <p>Their message is: ${escapeHtml(changeEvent.fullDocument.message)}.</p>`
	});
};
