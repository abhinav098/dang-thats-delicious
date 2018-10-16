const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

//catch error on global error handler
const { catchErrors } = require('../handlers/errorHandlers');

// get stores, edit page, show page etc
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/:id/edit', authController.isLoggedIn, catchErrors(storeController.editStore));
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

// add/update stores
router.get('/add', authController.isLoggedIn, storeController.addStore);
router.post('/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
);
router.post('/add/:id',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
);

// get tags and stores by tags
router.get('/tags', catchErrors(storeController.getStoreByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoreByTag));

// user Auth
router.get('/login', userController.login);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/register', userController.signup);
router.post('/register',
  userController.validateRegister,
  userController.register,
  authController.login
  );

// update account details
router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));

//reset account password
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token', authController.confirmedPasswords,
  catchErrors(authController.resetPassword)
);
router.get('/map', storeController.mapPage)

// API EndPoints
router.get('/api/v1/search',catchErrors(storeController.searchStores));
router.get('/api/v1/stores/near',catchErrors(storeController.mapStores));

module.exports = router;
