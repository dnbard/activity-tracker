const Calc = require('../core/calc');
const Report = require('../models/report');

module.exports = function(options, cb){
    Report.find({}, (err, reports) => {
        console.log(`${reports.length} reports in old format found`);

        Promise.all(reports.map(r => {
            r.score = Calc.getCalories(r.distance, r.duration, 85 /* my weight */ );

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
