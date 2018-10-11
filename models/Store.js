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
  tags: [String]
  // created: {
  //   type: Date,
  //   default: Date.now
  // },
  // location: {
  //   type:{
  //     type: String,
  //     default: 'Point'
  //   },
  //   coordinates: [{
  //     type: Number,
  //     required: 'You Must supply coordinates!!'}
  //   ],
  //   address: {
  //     type: String,
  //     required: 'AddressMust be supplied!!'
  //   }
  // }
});

storeSchema.pre('save', function(next){
  if(!this.isModified('name')){
    return next(); //skip this and return
  }
  this.slug = slug(this.name);
  next();
})

module.exports = mongoose.model('Store', storeSchema)
