const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next){
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto){
      next(null, true);
    } else {
      next({message: 'This file type isnt allowed'}, false);
    }
  }
}

exports.homepage = (req, res) => {
  res.render('index', {title: 'Dang'});
};

exports.addStore = (req, res) => {
  res.render('editStore', {title: 'Add Store'});
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // check if there is no file to resize
  if(!req.file) {
    return next();
  }
  const extension = req.file.mimetype.split('/')[1]
  req.body.photo = `${uuid.v4()}.${extension}`;
  // now we resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  next(); // resize, save it and keep going
};


exports.createStore = async (req, res) => {
  req.body.author = req.user._id;
  const store = await(new Store(req.body)).save();
  req.flash('success', `${store.name} created successfully.`)
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  const stores = await Store.find(); // query all the stores and pass it to render
  res.render('stores', {title: 'Stores', stores});
};

exports.getStoreBySlug = async(req, res, next) => {
  const store = await Store.findOne({slug: req.params.slug}).populate('author');
  res.render('storeShow', {title: `${store.name}`, store})
};

const confirmOwner = (store, user) => {
  if(!store.author.equals(user._id)){
    throw Error('Sorry! You are not authorized, as you are not the store owner.')
  }
};

exports.editStore = async (req, res) => {
  const store = await Store.findOne({_id: req.params.id}); //1 find the store
  confirmOwner(store, req.user);
  // 2 confirm owner of store, TODO
  res.render('editStore', {title: `Edit ${store.name}`, store}) // 3 render out the edit form
};


exports.updateStore = async (req, res) => {
  req.body.location.type = 'Point';
  const store = await Store.findOneAndUpdate(
    {
      _id: req.params.id},
      req.body,
      {
        new: true, // return new row instead of old one.
        runValidators: true}
  ).exec();

  req.flash('success', `<strong>${store.name}</strong> updated successfully.<a href="/stores/${store.slug}">View Store</a>`)
  res.redirect(`/stores/${store._id}/edit`);
};

exports.getStoreByTag = async (req,res) => {
  const tag = req.params.tag;
  const tagQuery = tag || { $exists: true};
  const tagsPromise = Store.getTagsList();
  const storesPromise = Store.find({tags: tagQuery});
  const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);
  const storeCount = stores.length;
  res.render('tagStores', {title: 'Tags', tags, stores, tag, storeCount});
}
