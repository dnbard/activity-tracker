const ReportsController = require('./controllers/reports');
const UsersController = require('./controllers/users');

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
    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

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

    app.post('/users', (req, res) => {
        const body = req.body;

        UsersController.createOne(body, (err, data) => {
            if (err){
                return res.status(500).send(err);
            }

            return res.status(200).send(data);
        });
    });

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
}

