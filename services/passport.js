const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

const User = require("../models/user");
const config = require("../config");

const localOptions = {

    usernameField: "email"
};

const localLogin = new LocalStrategy(localOptions, function(email, password, done) {

    User.findOne({ email }, function(err, user) {

        if (err) { return done(err) }

        if (!user) { return done(null, false) }

        user.comparePassword(password, function(err, isMatch) {

            if (err) { return done(err); }

            if (!isMatch) { return done(null, false); }

            done(null, user);
        });
    });
});

const jwtOptions = {

    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: config.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {

    // see if the user ID in the payload exists in our database, if it does call done with that user, otherwise call doen without a user 
    
    User.findById(payload.sub, function(err, user) {

        if (err) { return done(err, false); }

        if (user) {

            done(null, user);
        }
        else {

            done(null, false);
        }
    });

});


passport.use(jwtLogin);
passport.use(localLogin);