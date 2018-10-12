const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

//render the login form
exports.login = (req, res) => {
  res.render('login', {title: 'Login'});
};

//render the signup form
exports.signup = (req, res) => {
  res.render('register', {title: 'Register'});
};

// user registration validator
exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name!').notEmpty();
  req.checkBody('email', 'Invalid Email!').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extensions: false,
    google_remove_subaddress: false
  });
  req.checkBody('password', 'Password cannot be blank!').notEmpty();
  req.checkBody('password-confirm', 'Confirm Password cannot be blank!').notEmpty();
  req.checkBody('password-confirm', 'Ooops! passwords did not mactch!').equals(req.body.password);
  const errors = req.validationErrors();
  if(errors){
    req.flash('error', errors.map(err=> err.msg));
    res.render('register', { title: 'Register', body: req.body, flashes: req.flash()});
    return; //stop function from running ahead
  }
  next(); //no errors
};

// create a async promisify function.
exports.register = async (req, res, next) => {
  const user = new User({email: req.body.email, name: req.body.name});
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next(); // pass to auth controller
}
