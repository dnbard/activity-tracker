const data = require('../package.json');

exports.getInfo = function(){
    return {
        name: data.name,
        version: data.version,
        description: data.description,
        author: data.author
    };
}
