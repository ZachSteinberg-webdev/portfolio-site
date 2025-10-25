// Persist successful contact form submissions, including signal breakdown and a final spam score (for triage/analytics only)
const mongoose = require('mongoose');

const ContactFormSubmissionSchema = new mongoose.Schema(
	{
		// Core fields
		name: { type: String, required: true, trim: true, maxlength: 200 },
		email: { type: String, required: true, trim: true, maxlength: 320 },
		message: { type: String, required: true, trim: true, maxlength: 10000 },

		// Metadata for future review
		meta: {
			// Basic context
			mode: { type: String, enum: ['ajax', 'form', 'unknown'], default: 'unknown' }, // Submission path
			age: { type: Number, default: 0 }, // Milliseconds between render timestamp and submit

			// Email hygiene
			mxOk: { type: Boolean, default: false },

			// Header snapshot
			headers: {
				uaOK: { type: Boolean, default: false },
				acceptOK: { type: Boolean, default: false },
				fetchOK: { type: Boolean, default: false }
			},

			// Content probes (raw, descriptive)
			urlCount: { type: Number, default: 0 },
			length: { type: Number, default: 0 },
			nonLatinOnly: { type: Boolean, default: false },

			// Client / network fingerprint (NEW)
			client: {
				ipNetwork: { type: String, default: '' }, // e.g. "203.0.113.0/24" or "2001:db8:1234:5678::/64"
				ipHash: { type: String, default: '' } // HMAC-SHA256 hash of the raw IP using your IP_HASH_SALT
			},

			// Per-layer scores (kept separate)
			scores: {
				urlCount: { type: Number, default: 0 },
				length: { type: Number, default: 0 },
				nonLatin: { type: Number, default: 0 },
				headerAnom: { type: Number, default: 0 },
				mxMissing: { type: Number, default: 0 }
			}
		},

		// Final single number for quick scanning (1–100; higher = more suspicious). Purely informational.
		final_spam_score: { type: Number, min: 1, max: 100, default: 1 }
	},
	{ timestamps: true }
);

const ContactFormSubmission = mongoose.model('ContactFormSubmission', ContactFormSubmissionSchema);

module.exports = ContactFormSubmission;
