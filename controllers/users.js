const Token = require('../models/tokens');
const User = require('../models/users');
const _ = require('lodash');

exports.createOne = function(data, cb){
    const user = new User({
        email: data.email,
        password: data.password,
        createdAt: new Date(),
        updatedAt: new Date(),
        weight: 59
    });

    user.save((err, user) => {
        if (err){
            return cb(err, null);
        }

        const token = new Token({
            identityId: user._id,
            createdAt: new Date()
        });

        token.save((err, token) => {
            if (err){
                return cb(err, null);
            }

            cb(null, {
                token: token,
                user: user
            });
        });
    });
}

exports.login = function(data, cb){
    User.findOne({ email: data.email }, (err, user) => {
        if (err){
            return cb(err, null);
        }

        if (!user){
            return cb(new Error(`User(email=${data.email}) not found.`), null);
        }

        if (user.password === data.password){
            const token = new Token({
                identityId: user._id,
                createdAt: new Date()
            });

            token.save((err, token) => {
                if (err){
                    return cb(err, null);
                }

                cb(null, {
                    token: token,
                    user: user
                });
            });
        } else {
            return cb(new Error(`User(email=${data.email}) not found.`), null);
        }
    });
}


exports.getUserbyToken = function(token, cb){
    Token.findOne({ _id: token }, (err, token) => {
        if (err){
            return cb(err);
        }

        if (!token){
            return cb(new Error('Token not found'));
        }

        User.findOne({ _id: token.identityId }, (err, user) => {
            if (err){
                return cb(err);
            }

            if (!token){
                return cb(new Error('User not found'));
            }

            cb(null, user);
        });
    });
}

exports.updateById = function(userId, data, cb){
    User.findOne({ _id: userId }, (err, user) => {
        if (err){
            return cb(err);
        }

        _.each(data, (value, field) => {
            if (user[field] !== 'undefined' && field.indexOf('_') === -1){
                user[field] = value;
            }
        });

        user.save((err) => {
            return cb(err, user);
        });
    });
}
