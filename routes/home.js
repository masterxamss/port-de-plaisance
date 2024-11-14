const express = require('express');
const dashboardController = require('../controllers/dashboard');
const router = express.Router();
const isAuth = require('../middlewares/is-auth');

router.get('/', dashboardController.getHome);

router.get('/dashboard', isAuth, dashboardController.getDashboard);

router.get('/documentation', dashboardController.getDocumentation);

module.exports = router;