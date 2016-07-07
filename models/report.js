const mongoose = require('mongoose');
const Report = mongoose.model('Report', {
    timestamp: { type: Date, index: true, required: true },
    identityId: { type: String, index: true, required: true },
    score: { type: Number, required: true }
});

module.exports = Report;