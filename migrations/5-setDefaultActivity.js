const Calc = require('../core/calc');
const Report = require('../models/report');
const Activities = require('../enums/activities');

module.exports = function(options, cb){
    Report.find({}, (err, reports) => {
        console.log(`${reports.length} reports in old format found`);

        Promise.all(reports.map(r => {
            r.kind = Activities.BIKING;

            return new Promise((resolve, reject) => {
                r.save((err)=>{
                    if (err){
                        console.log(err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        })).then(() => {
            console.log(`${reports.length} reports in old format converted`);
            cb();
        }).catch(cb);
    });
}
