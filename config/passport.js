const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('./keys');

// Options
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        // Here I have what was passed in the payload.
        /**
         * jwt_payload contains:
         * 
         * id
         * name
         * avatar
         * issued at
         * expiration
         */

         const findUser = User.findById(jwt_payload.id);

         findUser.then(user => {
             if (user) {
                 return done(null, user);
             } else {
                 return done(null, false);
             }
         });
         findUser.catch(err => console.log(err));
    }))
}
