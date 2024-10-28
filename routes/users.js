const express = require('express');
const usersController = require('../controllers/users');
const router = express.Router();

router.get('/users', usersController.getUsers);

router.get('/users/add-user', usersController.getAddUser);

router.post('/users/add-user', usersController.createUser);

router.patch('/users/:id', usersController.updateUser);

router.delete('/users/:id', usersController.deleteUser);

module.exports = router