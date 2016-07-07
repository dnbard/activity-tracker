const ReportsController = require('./controllers/reports');
const UsersController = require('./controllers/users');

function getIdentityId(req){
    //TODO: add real users and their tokens
    return req.headers['authorization'];
}

exports.init = function(app){
    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.get('/reports', (req, res) => {
        const identityId = getIdentityId(req);

        ReportsController.getFewByIdentity(identityId, (err, reports) => {
            if (err){
                return res.status(500).send(err);
            }

            return res.status(200).send(reports);
        });
    });

    app.post('/reports', (req, res) => {
        const identityId = getIdentityId(req);
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

