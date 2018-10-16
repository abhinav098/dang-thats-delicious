const passport = require("passport");
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail')


exports.login = passport.authenticate("local", {
	faliureRedirect: "/login",
	faliureFlash: "Failed Login!",
	successRedirect: "/stores",
	successFlash: "Logged in Successfully!",
});

exports.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next(); // carry on the're logged in
	}
	req.flash("error", "Oops! you need to login to continue.");
	res.redirect("/login");
};

exports.logout = (req, res) => {
	req.logout();
	req.flash("success", "You are now logged out.");
	res.redirect("/stores");
};

exports.forgot = async (req, res) => {
	// 1.Check if user exists or not
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		req.flash("error", "No account found.");
		return res.redirect("/login");
	}
  // set reset token and expiry
	user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000 // 1 hour from now.
  await user.save();
  // send email with token
  const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
  await mail.send({
    user,
    subject: 'Password Reset',
    resetURL,
    fileName: 'password-reset'
  });
  req.flash('success', `You have been emailed a password reset link`);
  // redirect to login page
  res.redirect('/login')
};

exports.reset = async (req,res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {$gt: Date.now()}
  });
  if (!user){
    req.flash('error', 'Password reset token is invalid');
    res.redirect('/login');
  }
  res.render('resetPassword', {title:'Reset Password'});
};

exports.confirmedPasswords = (req, res, next) => {
  if(req.body.password === req.body["password-confirm"]){
    return next();
  }
  req.flash('error', 'Passwords do not match.');
  res.redirect('back');
}

exports.resetPassword = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {$gt: Date.now()}
  });
  if (!user) {
    req.flash('error', 'Reset token is invalid or has expired!');
    return res.redirect('/login');
  };
  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save();
  await req.login(updatedUser);
  req.flash('success', 'Your password has been successfully reset!');
  res.redirect('/');
}
