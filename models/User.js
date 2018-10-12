const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter your name!'
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: 'Please enter your Email!',
    trim: true,
    validate: [validator.isEmail, 'Invalid Email Address!!'] },
  slug: {
    type: String, trim: true
  }
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
