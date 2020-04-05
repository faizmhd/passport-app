const mongoose = require('mongoose');
const User = mongoose.model('User');
module.exports = function (app, passport) {

    app.post('/login', (req, res, next) => {

        return passport.authenticate('local-login', (err, passportUser, info) => {
            if(err) {
              return res.json({'errors' : err});
            }
        
            if(passportUser) { 
              return res.json({ user: passportUser, token: passportUser.generateJWT(passportUser.local.email)});
            }
        
            return res.status(400).json({
                info
            });
          })(req, res, next);

    });

    app.post('/signup', (req, res, next) => {

        return passport.authenticate('local-signup', (err, passportUser, info) => {
            if(err) {
              return res.json({'errors' : err});
            }
        
            if(passportUser) { 
              return res.json({ user: passportUser, token: passportUser.generateJWT(passportUser.local.email)});
            }
        
            return res.status(400).json({
                info
            });
          })(req, res, next);

    });

    // app.post('/login', passport.authenticate('local-login'));

    // app.get('/', function (req, res) {
    //     res.render('index.ejs');
    // });

    // app.get('/login', function (req, res) {
    //     res.render('login.ejs', { message: req.flash('loginMessage') });
    // });

    // app.get('/signup', function (req, res) {
    //     res.render('signup.ejs', { message: req.flash('signupMessage') });
    // });

    // app.get('/profile', isLoggedIn, function (req, res) {
    //     res.render('profile.ejs', {
    //         user: req.user
    //     });
    // });

    // app.get('/logout', function (req, res) {
    //     req.logout();
    //     res.redirect('/');
    // });

    // app.post('/signup', passport.authenticate('local-signup', {
    //     successRedirect: '/profile',
    //     failureRedirect: '/signup',
    //     failureFlash: true
    // }));

    // app.post('/login', passport.authenticate('local-login', {
    //     successRedirect: '/profile',
    //     failureRedirect: '/login',
    //     failureFlash: true
    // }));

    // app.get('/auth/facebook', passport.authenticate('facebook', {
    //     scope: ['email']
    // }));

    // app.get('/auth/facebook/callback',
    //     passport.authenticate('facebook', {
    //         successRedirect: '/profile',
    //         failureRedirect: '/',
    //         scope: ['email']
    //     }));
    // app.get('/auth/google', passport.authenticate('google', {
    //     scope: ['profile', 'email']
    // }));

    // app.get('/auth/google/callback',
    //     passport.authenticate('google', {
    //         successRedirect: '/profile',
    //         failureRedirect: '/'
    //     }));

};

// Check to be sure that a user is logged in
function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}