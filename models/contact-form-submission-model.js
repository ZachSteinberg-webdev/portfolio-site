const mongoose = require('mongoose');

const contactFormSubmissionSchema = new mongoose.Schema({
	name:{
		type: String,
		required: [true, `Please provide your name.`],
		trim: true
	},
	email:{
		type: String,
		required: [true, `Please provide an email address.`],
		trim: true
	},
	contactDate: {
		type: Date,
		default: Date.now
	},
	message: {
		type: String,
		required: [true, 'You have not input a message.']
	}
});

const ContactFormSubmission = mongoose.model('ContactFormSubmission', contactFormSubmissionSchema);

module.exports = ContactFormSubmission;
