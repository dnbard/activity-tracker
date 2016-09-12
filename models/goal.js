const mongoose = require('mongoose');
const Goal = mongoose.model('Goal', {
    identityId: { type: String, index: true, required: true },
    score: { type: Number, default: 0 },
    priority: { type: Number, default: 0 },
    icon: String,
    title: { require: true, type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    completeUntil: { type: Date, default: null }
});

module.exports = Goal;
