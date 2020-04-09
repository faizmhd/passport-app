const mongoose = require('mongoose');
module.exports = function (app, passport) {
  
  app.post('/login', (req, res, next) => {

    return passport.authenticate('local-login', { session: false }, (err, passportUser, info) => {
      if (err) {
        return res.json({ 'errors': err });
      }

      if (passportUser) {
        return res.json({ user: passportUser, token: passportUser.generateJWT(passportUser.local.email) });
      }

      return res.json({
        info
      });
    })(req, res, next);

  });

  app.post('/signup', (req, res, next) => {

    return passport.authenticate('local-signup', { session: false }, (err, passportUser, info) => {
      if (err) {
        return res.json({ 'errors': err });
      }

      if (passportUser) {
        return res.json({ user: passportUser, token: passportUser.generateJWT(passportUser.local.email) });
      }

      return res.json({
        info
      });
    })(req, res, next);

  });

  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email']
  }));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      scope: ['email']
    }), (req, res) => {
      let token = req.user.facebook.token;
      res.redirect('http://localhost:3000/game?token=' + token)
    });

  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

  app.get('/auth/google/callback',
    passport.authenticate('google', ), (req, res) => {
      let token = req.user.google.token;
      res.redirect('http://localhost:3000/game?token=' + token)
    });

  app.get('/jwt', passport.authenticate('jwt-auth', { session: false }), (req, res) => {
    res.json({ user: req.user })
  });

};