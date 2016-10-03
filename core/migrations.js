const Attributes = require('../models/attributes');
const AttributeNames = require('../enums/attributes');

const migrations = [
    function(options, cb){
        cb();
    },
    require('../migrations/1-oldScore'),
    require('../migrations/2-weightScore'),
    require('../migrations/3-setDefaultWeight'),
    require('../migrations/4-convertDurationIntoMinutes'),
    require('../migrations/5-setDefaultActivity')
];

exports.init = function(options, cb){
    function applyMigrations(err, DBVersionAttribute){
        function migrationHandler(){
            console.log(`Migration(index=${index})`);

            if (index < migrations.length){
                console.log(`Execute migration(index=${index})`);
                migrations[index].call(this, null, (err) => {
                    if (err){
                        console.error(err);
                        process.exit(1);
                    }

                    index ++;
                    DBVersionAttribute.value = index.toString();
                    DBVersionAttribute.save(migrationHandler);
                });
            } else {
                console.log('Stop migration execution');
                cb(null);
            }
        }

        if (err){
            console.error(err);
            process.exit(1);
        }

        var index = parseInt(DBVersionAttribute.value);
        migrationHandler();
    }

    options = options || {};

    Attributes.findOne({ key: AttributeNames.DB_VERSION }, (err, attr) => {
        if (err){
            return cb(err);
        }

        if (!attr){
            //no db-version attribute found and we must create one

            const DBVersionAttribute = new Attributes({
                key: AttributeNames.DB_VERSION,
                value: '0'
            });
            DBVersionAttribute.save(applyMigrations)
        } else {
            applyMigrations(null, attr);
        }
    });
}
