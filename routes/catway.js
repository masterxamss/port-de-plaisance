const express = require('express');
const catwayController = require('../controllers/catway');
const router = express.Router();
const isAuth = require('../middlewares/is-auth');


router.get('/catways', isAuth, catwayController.getCatways);

router.get('/catways/get-add', isAuth, catwayController.getAddCatway);

//router.post('/catways/add', isAuth, catwayController.createCatway);
router.post('/catways', isAuth, catwayController.createCatway);

router.get('/catways/:id', isAuth, catwayController.getOneCatway);

router.get('/catways/get-edit/:id', isAuth, catwayController.getEditCatway);

//router.put('/catways/edit/:id', isAuth, catwayController.replaceCatway);
router.put('/catways/:id', isAuth, catwayController.replaceCatway);

//router.patch('/catways/edit-state/:id', isAuth, catwayController.updateCatway);
router.patch('/catways/:id', isAuth, catwayController.updateCatway);

//router.delete('/catways/delete/:id', isAuth, catwayController.deleteCatway);
router.delete('/catways/:id', isAuth, catwayController.deleteCatway);



module.exports = router;