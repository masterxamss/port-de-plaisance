const bcrypt = require('bcryptjs');
const moment = require('moment');

const User = require('../models/user');


exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.render('users/users-list', {
      pageTitle: 'Users list',
      users: users,
      path: '/users',
      moment: moment,
      error: req.flash('error'),
      success: req.flash('success')
    });
  } catch (error) {
    console.log(error);
    req.flash('error', 'La liste des utilisateurs n\'a pas pu être téléchargée.');
    res.render('users/users-list', {
      pageTitle: 'Users list',
      users: [],
      path: '/users',
      moment: moment,
      errorMessage: req.flash('error')
    });
  }
};

exports.getAddUser = async (req, res) => {
  let error = req.flash('error');
  // if (error.length > 0) {
  //   error = error[0];
  // } else {
  //   error = null;
  // }
  res.render('users/add-user', {
    pageTitle: 'Ajout d\'un utilisateur',
    path: '/users',
    error: error
  })
};


exports.createUser = async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  try {
    // Verifica se o utilizador já existe
    const userDoc = await User.findOne({ email: email });
    if (userDoc) {
      req.flash('error', 'Cet email est déjà utilisé');
      return res.redirect('/users/add-user');
    }

    // Verifica se as senhas coincidem
    if (password !== passwordConfirm) {
      req.flash('error', 'Les mots de passe ne sont pas identiques');
      return res.redirect('/users/add-user');
    }

    // Cria o novo utilizador
    const hashedPassword = await bcrypt.hash(password, 10); // 10 é o salt rounds
    const user = new User({ name: name, email: email, password: hashedPassword });

    await user.save();
    return res.redirect('/users'); // Redireciona para a lista de utilizadores

  } catch (error) {
    console.log(error);
    req.flash('error', 'Une erreur s\'est produite lors de la création de l\'utilisateur');
    return res.redirect('/users/add-user'); // Redireciona em caso de erro
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true });
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      req.flash('error', 'Cet utilisateur n\'existe pas');
      return res.redirect('/users');
    }
    req.flash('success', 'Utilisateur supprimé avec succès');
    return res.redirect('/users');
  } catch (error) {
    req.flash('error', 'Une erreur s\'est produite lors de la suppression de l\'utilisateur');
    return res.redirect('/users');
  }
}