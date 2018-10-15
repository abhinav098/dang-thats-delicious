const passport = require('passport');

exports.login = passport.authenticate('local', {
  faliureRedirect: '/login',
  faliureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'Logged in Successfully!'
});


exports.logout = (req, res) => {
  console.log(req);
  req.logout();
  req.flash('success', 'You are now logged out.')
  res.redirect('/');
};
