const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name!'
  },
  slug: String,
  description: {
    type: String, trim: true
  },
  tags: []
});

storeSchema.pre('save', function(next){
  if(!this.isModified('name')){
    return next(); //skip this and return
  }
  this.slug = slug(this.name);
  next();
})
module.exports = mongoose.model('Store', storeSchema)
