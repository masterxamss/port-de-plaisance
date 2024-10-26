const express = require('express');
const catwayController = require('../controllers/catwayController');
const router = express.Router();

router.get('/catways', catwayController.getCatways);
router.post('/add-catways', catwayController.createCatway);


module.exports = router;