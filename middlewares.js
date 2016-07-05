const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

exports.init = function(app){
    app.use(morgan('combined'));

    app.use(express.static('public'));

    app.use(bodyParser.json())
}
