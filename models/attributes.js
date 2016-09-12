const mongoose = require('mongoose');
const uuid = require('node-uuid').v4;

const Attribute = mongoose.model('Attribute', {
    _id: { type: String, default: uuid },
    key: { type: String, index: true, required: true },
    value: String
});

module.exports = Attribute;
