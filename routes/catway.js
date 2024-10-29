const express = require('express');
const catwayController = require('../controllers/catway');
const router = express.Router();
const isAuth = require('../middlewares/is-auth');


router.get('/', catwayController.getHome);

router.get('/catways', isAuth, catwayController.getCatways);

router.get('/catways/:id', isAuth, catwayController.getOneCatway);

router.post('/catways', isAuth, catwayController.createCatway);

router.put('/catways/:id', isAuth, catwayController.replaceCatway);

router.patch('/catways/:id', isAuth, catwayController.updateCatway);

router.delete('/catways/:id', isAuth, catwayController.deleteCatway);

module.exports = router;