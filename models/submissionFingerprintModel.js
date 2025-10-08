// Permanent suppression of exact duplicate messages (same normalized name|email|message)
// Accept first occurrence only; subsequent identical payloads are silently ignored forever

const mongoose = require('mongoose');

const SubmissionFingerprintSchema = new mongoose.Schema({
	fp: { type: String, unique: true, index: true }, // SHA256 of normalized triple
	firstSeenAt: { type: Date, default: Date.now } // Timestamp for audit
});

// No TTL on this index. Intentionally permanent dedupe.

module.exports = mongoose.model('SubmissionFingerprint', SubmissionFingerprintSchema);
