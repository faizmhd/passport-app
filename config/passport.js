let LocalStrategy = require('passport-local').Strategy;
let FacebookStrategy = require('passport-facebook').Strategy;
let GoogleStrategy = require('passport-google-oauth2').Strategy;

let User = require('../app/models/user');

module.exports = (passport) => {

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        (req, email, password, done) => {
            process.nextTick(() => {
                User.findOne({ 'local.email': email }, (err, user) => {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, false, {message: 'That email is already taken.'});
                    } else {
                        let newUser = new User();

                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.save((err) => {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        (req, email, password, done) => {
            User.findOne({ 'local.email': email }, (err, user) => {
                
                if (err)
                    return done(err);

                if (!user)
                    return done(null, false, { message: 'Incorrect username.' });

                if (!user.validPassword(password))
                    return done(null, false, { message: 'Incorrect password.' });
                
                return done(null, user);
            });

        }));

    // Passport Facebook Strategy
    passport.use(new FacebookStrategy({

        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'emails', 'name'],

    },
        (token, refreshToken, profile, done) => {
            // asynchronous
            process.nextTick(() => {
                User.findOne({ 'facebook.id': profile.id }, (err, user) => {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, user);
                    } else {
                        let newUser = new User();

                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = token;
                        newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.facebook.email = profile.emails[0].value;

                        newUser.save((err) => {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));

    // Passport Google Strategy
    passport.use(new GoogleStrategy({

        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,

    },
        (token, refreshToken, profile, done) => {
            process.nextTick(() => {
                User.findOne({ 'google.id': profile.id }, (err, user) => {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, user);
                    } else {
                        let newUser = new User();

                        newUser.google.id = profile.id;
                        newUser.google.token = token;
                        newUser.google.name = profile.displayName;
                        newUser.google.email = profile.emails[0].value;

                        newUser.save((err) => {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));
};
