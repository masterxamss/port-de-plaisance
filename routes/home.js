const express = require('express');
const catwayController = require('../controllers/home');
const router = express.Router();
const isAuth = require('../middlewares/is-auth');

router.get('/', catwayController.getHome);

router.get('/dashboard', isAuth, catwayController.getDashboard);

module.exports = router;