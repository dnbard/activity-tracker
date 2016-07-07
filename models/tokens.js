const mongoose = require('mongoose');
const Token = mongoose.model('Token', {
    createdAt: Date,
    identityId: { type: String, required: true }
});

module.exports = Token;
