const Report = require('../models/report');

exports.getFewByIdentity = function(identity, cb){
    console.log(`Reports Controller :: looking for reports by identity(id=${identity})`);

    Report.find({
        identityId: identity
    }, {
        timestamp: true,
        score: true,
        distance: true,
        duration: true
    }, cb);
}

exports.createOne = function(report, cb){
    const newReport = new Report(report);
    newReport.save(cb);
}

exports.changeReportById = function(identityId, reportId, data, cb){
    if (typeof data.score !== 'number' || data.score <= 0){
        return cb(new TypeError('Score should be a number greater than 0'));
    }

    if (typeof data.distance !== 'number' || data.distance <= 0){
        return cb(new TypeError('Distance should be a number greater than 0'));
    }

    if (typeof data.duration !== 'number' || data.duration <= 0){
        return cb(new TypeError('Duration should be a number greater than 0'));
    }

    Report.findOne({ _id: reportId }, (err, report) => {
        if (err !== null){
            return cb(err);
        }

        if (!report){
            return cb(`Report(id=${reportId}) not found`);
        }

        if (report.identityId != identityId){
            return cb(`You cannot change report(id=${reportId})`);
        }

        report.score = data.score;
        report.distance = data.distance;
        report.duration = data.duration;
        report.save(() => {
            cb(null, report);
        });
    });
}
