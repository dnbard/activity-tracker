const express = require('express');
const app = express();
const mongoose = require('mongoose');

const config = require('./config');
const Migrations = require('./core/migrations');

mongoose.connect(config.mongo, (err) => {
    if (err){
        console.error(`MongoDB ERROR :: ${err}`);
        process.exit(1);
    } else {
        console.log('MongoDB :: connected');
    }

    Migrations.init(null, (err) => {
        if (err){
            console.error(`Migrations ERROR :: ${err}`);
            process.exit(1);
        } else {
            console.log('Migrations :: done');
        }

        app.listen(config.port, () => {
            const middlewares = require('./middlewares');
            const routing = require('./routing');

            middlewares.init(app);
            routing.init(app);

            console.log(`HTTP Server :: listening on port ${config.port}`);
        });
    });
});
