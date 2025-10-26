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

	const transporter = nodemailer.createTransport({
		host: SMTP_HOST,
		port: SMTP_PORT,
		secure: SMTP_PORT === 465,
		auth: { user: SMTP_USER, pass: SMTP_PASS }
	});
	const info = await transporter.sendMail({
		from: SMTP_FROM,
		to: SMTP_TO,
		replyTo: `${changeEvent.fullDocument.email}`,
		subject: `New contact form submission from ${changeEvent.fullDocument.name}`,
		html: `<p>You have received a new contact form submission from ${changeEvent.fullDocument.name}.</p>
       <p>${changeEvent.fullDocument.name}'s email address is ${changeEvent.fullDocument.email}.</p>
       <p>Their message is: ${changeEvent.fullDocument.message}.</p>`
	});
};
