const express = require('express');
const usersController = require('../controllers/users');
const isAuth = require('../middlewares/is-auth');
const router = express.Router();

router.get('/list-users', isAuth, usersController.getUsers);

router.get('/add-user', isAuth, usersController.getAddUser);

router.post('/add-user', isAuth, usersController.createUser);

router.get('/edit-user/:id', isAuth, usersController.getEditUser);

router.patch('/edit-user/:id', isAuth, usersController.updateUser);

router.delete('/delete-user/:id', isAuth, usersController.deleteUser);

module.exports = router