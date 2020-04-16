let LocalStrategy = require('passport-local').Strategy;
let FacebookStrategy = require('passport-facebook').Strategy;
let GoogleStrategy = require('passport-google-oauth2').Strategy;
let JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
let jwt_secret = require('./config');
let LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

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
                        return done(null, false, { message: 'That email is already taken.' });
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

    // Passport JWT Strategy
    passport.use('jwt-auth', new JwtStrategy({

        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwt_secret.secret,
    },
        (jwt_payload, done) => {
            User.findOne({ 'local.email': jwt_payload.email }, (err, user) => {
                if (err)
                    return done(err);

                if (user) {
                    return done(null, user, { message: 'A user was found thanks to the jwt token' });
                } else {
                    return done(null, false, { message: 'No user was found thanks to the jwt token' });
                }
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
                        console.log("fb-token", token)
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

    // Linkedin Strategy
    passport.use(new LinkedInStrategy({

        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: process.env.LINKEDIN_CALLBACK_URL,
        scope: ['r_emailaddress', 'r_liteprofile']

    },
        (token, refreshToken, profile, done) => {
            process.nextTick(() => {
                User.findOne({ 'linkedin.id': profile.id }, (err, user) => {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, user);
                    } else {
                        let newUser = new User();

                        newUser.linkedin.id = profile.id;
                        newUser.linkedin.token = token;
                        newUser.linkedin.name = profile.displayName;
                        newUser.linkedin.email = profile.emails[0].value;

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
