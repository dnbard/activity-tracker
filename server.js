const express = require('express');
const app = express();
const mongoose = require('mongoose');

const config = require('./config');

mongoose.connect('mongodb://localhost:27018/activitytracker', (err) => {
    if (err){
        console.error(`MongoDB ERROR :: ${err}`);
        process.exit(1);
    } else {
        console.log('MongoDB :: connected');
    }

    app.listen(config.port, function () {
        const middlewares = require('./middlewares');
        const routing = require('./routing');

        middlewares.init(app);
        routing.init(app);

        console.log(`HTTP Server :: listening on port ${config.port}`);
    });
});
