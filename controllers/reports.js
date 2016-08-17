const Report = require('../models/report');

exports.getFewByIdentity = function(identity, cb){
    console.log(`Reports Controller :: looking for reports by identity(id=${identity})`);

    Report.find({
        identityId: identity
    }, {
        timestamp: true,
        score: true
    }, cb);
}

exports.createOne = function(report, cb){
    const newReport = new Report(report);
    newReport.save(cb);
}

exports.changeScoreById = function(identityId, reportId, score, cb){
    if (typeof score !== 'number' || score <= 0 || score > 5){
        return cb(new TypeError('Score should be a number greater than 0 and less or equal to 5'));
    }

    Report.findOne({ _id: reportId }, (err, report) => {
        if (err !== null){
            return cb(err);
        }

        if (!report){
            return cb(`Report(id=${reportId}) not found`);
        }

        console.log(report);
        console.log('++++' + identityId);

        if (report.identityId != identityId){
            return cb(`You cannot change report(id=${reportId})`);
        }

        report.score = score;
        report.save();

        return cb(null, report);
    });
}
