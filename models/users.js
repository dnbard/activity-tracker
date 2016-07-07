const mongoose = require('mongoose');
const User = mongoose.model('User', {
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    email: { index: { unique: true }, type: String, required: true },
    password: { type: String, required: true}
});

module.exports = User;
