const Goal = require('../models/goal');

exports.createOne = function(options, cb){
    var goal = new Goal({
        title: options.title,
        score: options.score,
        priority: options.priority,
        icon: options.icon,
        completeUntil: options.completeUntil,
        identityId: options.identityId
    });

    goal.save(cb);
}

exports.getAllByIdentityId = function(identityId, cb){
    Goal.find({ identityId: identityId }, cb);
}
