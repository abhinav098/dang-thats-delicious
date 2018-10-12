const passport = require('passport');

exports.login = passport.authenticate('local', {
  faliureRedirect: '/login',
  faliureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'Logged in Successfully!',
});
