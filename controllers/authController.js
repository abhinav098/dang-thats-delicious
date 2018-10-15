const passport = require('passport');

exports.login = passport.authenticate('local', {
  faliureRedirect: '/login',
  faliureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'Logged in Successfully!'
});

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // carry on the're logged in
  }
  req.flash('error', 'Oops! you need to login to continue.')
  res.redirect('/login');
}

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out.')
  res.redirect('/');
};
