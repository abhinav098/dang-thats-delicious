const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

//catch error on global error handler
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/:id/edit', catchErrors(storeController.editStore));

router.get('/add', storeController.addStore);
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

module.exports = router;
