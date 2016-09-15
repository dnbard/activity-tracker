const ReportsController = require('./controllers/reports');
const UsersController = require('./controllers/users');
const InfoController = require('./controllers/info');
const Calc = require('./core/calc');

function getUser(req, res, next){
    const token = req.headers['authorization'];

    UsersController.getUserbyToken(token, (err, user) => {
        if (err){
            return res.status(400).send(err);
        }

        req._user = user;
        next();
    });
}

exports.init = function(app){

    /* REPORTS */

    app.get('/reports', [getUser], (req, res) => {
        const identityId = req._user._id;

        ReportsController.getFewByIdentity(identityId, (err, reports) => {
            if (err){
                return res.status(500).send(err);
            }

            return res.status(200).send(reports);
        });
    });

    app.post('/reports', [getUser], (req, res) => {
        const identityId = req._user._id;
        const body = req.body;

        console.log(req._user);

        try{
            const distance = parseInt(body.distance);
            const duration = parseInt(body.duration);
        } catch(e){
            return res.status(400).send(e);
        }

        ReportsController.createOne({
            identityId: identityId,
            duration: duration,
            distance: distance,
            score: Calc.getCalories(distance, duration, req._user.weight),
            timestamp: body.timestamp
        }, (err, report) => {
            if (err){
                return res.status(500).send(err);
            }

            return res.status(200).send(report);
        });
    });

    app.post('/reports/:id', [getUser], (req, res) => {
        const identityId = req._user._id;
        const body = req.body;

        try{
            const distance = parseInt(body.distance);
            const duration = parseInt(body.duration);
        } catch(e){
            return res.status(400).send(e);
        }

        ReportsController.changeReportById(identityId, req.params.id, {
            duration: duration,
            distance: distance,
            score: Calc.getCalories(distance, duration, req._user.weight)
        }, (err, report) => {
            if (err){
                return res.status(400).send(err);
            }

            return res.send(report);
        });
    });

    /* USERS */

    app.get('/users', [getUser], (req, res) => {
        const user = req._user;

        return res.status(200).send({
            _id: user._id,
            createdAt: user.createdAt,
            email: user.email,
            updatedAt: user.updatedAt,
            weight: user.weight
        });
    });

    app.post('/users', (req, res) => {
        const body = req.body;

        UsersController.createOne(body, (err, data) => {
            if (err){
                return res.status(500).send(err);
            }

            return res.status(200).send(data);
        });
    });

    app.post('/users/:id', [getUser], (req, res) => {
        const body = req.body;
        const user = req._user;

        if (user._id !== req.params.id){
            return res.status(403).send('Unauthorized');
        }

        UsersController.updateById(req.params.id, body, (err, user) => {
            if (err){
                return res.status(400).send(err);
            }

            res.send(user);
        });
    });

    /* LOGIN */

    app.get('/login', (req, res) => {
        res.sendFile(__dirname + '/public/login.html');
    });

    app.post('/login', (req, res) => {
        const body = req.body;

        UsersController.login(body, (err, data) => {
            if (err){
                return res.status(400).send(err);
            }

            return res.status(200).send(data);
        });
    });

    /* INFO */

    app.get('/info', (req, res) => {
        res.send(InfoController.getInfo());
    });

    /* PROFILE */

    app.get('/profile', (req, res) => {
        res.sendFile(__dirname + '/public/profile.html');
    });
}

