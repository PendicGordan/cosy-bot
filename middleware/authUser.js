const JwtStrategy            = require('passport-jwt').Strategy;
const ExtractJwt             = require('passport-jwt').ExtractJwt;
const {Users}                = require('../models');

const {ReE, ReS, to}         = require('../services/UtilService');
const CONFIG = require('../config/config');
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = CONFIG.jwt_encryption;

module.exports = (passport) => {

    passport.use('user', new JwtStrategy(opts, async function(jwt_payload, done){
        if (jwt_payload.userId !== undefined && jwt_payload.userId !== null) {
            let err, user;
            [err, user] = await to(Users.findById(jwt_payload.userId));
            if(err) return done(err, false);
            if(user) {
                return done(null, user);
            }
        }
        return done(null, false);
    }));

    return (req, res, next) => {
        if(req.url !== "/login" && req.url !== "/register" && req.url !== "/verify"){
            passport.authenticate('user', (err, user, info) => {
                if (err) return ReE(res, 'Access Denied!');
                if (info && info.name === 'TokenExpiredError') return ReE(res, 'TOKEN_EXPIRED');
                if(user) {
                    req.user = user;
                    return next();
                }
                return ReE(res, 'Access Denied!');
            })(req, res, next)
        } else {
            next()
        }

    }
};
