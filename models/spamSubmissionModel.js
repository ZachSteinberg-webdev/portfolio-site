// Persist submissions rejected as spam, including signal breakdown and a final spam score
const mongoose = require('mongoose');

const SpamSubmissionSchema = new mongoose.Schema(
	{
		// Core fields captured for reference
		name: { type: String, trim: true, default: '' },
		email: { type: String, trim: true, default: '' },
		message: { type: String, trim: true, default: '' },

		// spamTrapData captured for analysis
		spamTrapData: new mongoose.Schema(
			{
				hpKey: { type: String, default: '' },
				hpVal: { type: String, default: '' }
			},
			{
				_id: false,
				strict: true
			}
		),

		// Structured metadata for analysis
		meta: {
			mode: { type: String, enum: ['ajax', 'form', 'unknown'], default: 'unknown' },
			age: { type: Number, default: 0 },

			// Hard rejections (booleans for quick glance)
			flags: {
				honeypot: { type: Boolean, default: false },
				tooFast: { type: Boolean, default: false },
				tooOld: { type: Boolean, default: false },
				badSig: { type: Boolean, default: false },
				ajaxNoJS: { type: Boolean, default: false }, // ajax mode missing js_ready
				emailBad: { type: Boolean, default: false }
			},

			// Header sanity snapshot
			headers: {
				uaOK: { type: Boolean, default: false },
				acceptOK: { type: Boolean, default: false },
				fetchOK: { type: Boolean, default: false }
			},

			// Client / network fingerprint (NEW)
			client: {
				ipNetwork: { type: String, default: '' }, // e.g. "203.0.113.0/24" or "2001:db8:1234:5678::/64"
				ipHash: { type: String, default: '' } // HMAC-SHA256 hash of the raw IP using your IP_HASH_SALT
			},

			// Content probes (raw)
			urlCount: { type: Number, default: 0 },
			length: { type: Number, default: 0 },
			nonLatinOnly: { type: Boolean, default: false },

			// Email hygiene
			mxOk: { type: Boolean, default: false },

			// Per-layer scores
			scores: {
				urlCount: { type: Number, default: 0 },
				length: { type: Number, default: 0 },
				nonLatin: { type: Number, default: 0 },
				headerAnom: { type: Number, default: 0 },
				mxMissing: { type: Number, default: 0 }
			}
		},

		// Final single number for quick scanning (1–100; higher = more suspicious)
		final_spam_score: { type: Number, min: 1, max: 100, default: 50 }
	},
	{ timestamps: true }
);

const SpamSubmission = mongoose.model('SpamSubmission', SpamSubmissionSchema);

module.exports = SpamSubmission;
