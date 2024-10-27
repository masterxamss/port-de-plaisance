const express = require('express');
const catwayController = require('../controllers/catway');
const router = express.Router();


router.get('/catways', catwayController.getCatways);

router.get('/catways/:id', catwayController.getOneCatway);

router.post('/catways', catwayController.createCatway);

router.put('/catways/:id', catwayController.replaceCatway);

router.patch('/catways/:id', catwayController.updateCatway);

router.delete('/catways/:id', catwayController.deleteCatway);

module.exports = router;