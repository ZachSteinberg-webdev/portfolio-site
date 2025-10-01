const mongoose = require('mongoose');

const spamSubmissionSchema = new mongoose.Schema({
	spamTrapData: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: [true, `Please provide your name.`],
		trim: true
	},
	email: {
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

const SpamSubmission = mongoose.model('SpamSubmission', spamSubmissionSchema);

module.exports = SpamSubmission;
