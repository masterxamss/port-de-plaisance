const express = require('express');
const usersController = require('../controllers/users');
const router = express.Router();

router.post('/users/add-user', usersController.createUser);

router.patch('/users/:id', usersController.updateUser);

router.delete('/users/:id', usersController.deleteUser);

module.exports = router