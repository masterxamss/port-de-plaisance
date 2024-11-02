const express = require('express');
const catwayController = require('../controllers/catway');
const router = express.Router();
const isAuth = require('../middlewares/is-auth');


router.get('/list', isAuth, catwayController.getCatways);

router.get('/get-add', isAuth, catwayController.getAddCatway);

router.post('/add', isAuth, catwayController.createCatway);

router.get('/get-catway/:id', isAuth, catwayController.getOneCatway);

router.get('/get-edit/:id', isAuth, catwayController.getEditCatway);

router.put('/edit/:id', isAuth, catwayController.replaceCatway);

router.patch('/edit-state/:id', isAuth, catwayController.updateCatway);

router.delete('/delete/:id', isAuth, catwayController.deleteCatway);



module.exports = router;