const Users = require('../models/users');
const DEFAULT_WEIGHT = 59;

module.exports = function(options, cb){
    Users.find({}, (err, users) => {
        console.log(`${users.length} users in old format found`);

        Promise.all(users.map(u => {
            u.weight = DEFAULT_WEIGHT;

            return new Promise((resolve, reject) => {
                u.save((err)=>{
                    if (err){
                        console.log(err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        })).then(() => {
            console.log(`${users.length} reports in old format converted`);
            cb();
        }).catch(cb);
    });
}
