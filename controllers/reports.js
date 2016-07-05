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
