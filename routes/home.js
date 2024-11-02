const express = require('express');
const catwayController = require('../controllers/home');
const router = express.Router();
const isAuth = require('../middlewares/is-auth');

router.get('/', catwayController.getHome);

module.exports = router;