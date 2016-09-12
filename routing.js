const ReportsController = require('./controllers/reports');
const UsersController = require('./controllers/users');
const InfoController = require('./controllers/info');
const GoalsController = require('./controllers/goals');

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

        ReportsController.createOne({
            identityId: identityId,
            score: body.score,
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

        ReportsController.changeScoreById(identityId, req.params.id, body.score, (err, report) => {
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
            updatedAt: user.updatedAt
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

    /* GOALS */

    app.get('/goals', [getUser], (req, res) => {
        const user = req._user;
        GoalsController.getAllByIdentityId(user._id, (err, goals) => {
            if (err){
                return res.status(500).send(err);
            }

            res.send(goals);
        });
    });

    app.post('/goals', [getUser], (req, res) => {
        const user = req._user;
        const body = req.body;

        GoalsController.createOne({
            title: body.title,
            score: body.score,
            priority: body.priority,
            icon: body.icon,
            completeUntil: body.completeUntil,
            identityId: user._id
        }, (err, goal) => {
            if (err){
                return res.status(400).send(err);
            }

            res.send(goal);
        });
    });
}

