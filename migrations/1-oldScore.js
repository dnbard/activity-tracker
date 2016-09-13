const Calc = require('../core/calc');
const Report = require('../models/report');

module.exports = function(options, cb){
    Report.find({}, (err, reports) => {
        console.log(`${reports.length} reports in old format found`);

        Promise.all(reports.map(r => {
            const distance = Calc.oldScoreToKM(r.score);
            const duration = distance > 24 ? 3 : distance > 14 ? 2 : 1;

            r.score = Calc.getCalories(distance, duration);
            r.distance = distance;
            r.duration = duration;

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
