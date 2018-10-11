const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homepage = (req, res) => {
  res.render('index', {title: 'Dang'});
};

exports.addStore = (req, res) => {
  res.render('editStore', {title: 'Add Store'});
};

exports.createStore = async (req, res) => {
  const store = await(new Store(req.body)).save();
  req.flash('success', `${store.name} created successfully.`)
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  const stores = await Store.find(); // query all the stores and pass it to render
  res.render('stores', {title: 'Stores', stores});
};

exports.editStore = async (req, res) => {
  const store = await Store.findOne({_id: req.params.id}); //1 find the store
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
