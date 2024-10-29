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
  const error = req.flash('error');

  try {
    res.render('users/add-user', {
      pageTitle: 'Ajout d\'un utilisateur',
      path: '/users',
      error: error,
      editMode: false
    })  
  }
  catch(error){
    console.log(error);
  }
};


exports.createUser = async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  try {
    // Verifica se o utilizador já existe
    const userDoc = await User.findOne({ email: email });
    if (userDoc) {
      req.flash('error', 'Les données fournies sont invalides');
      return res.redirect('/users/add-user');
    }

    // Verifica se as senhas coincidem
    if (password !== passwordConfirm) {
      req.flash('error', 'Les mots passe ne sont pas identiques');
      return res.redirect('/users/add-user');
    }

    if (password.length < 8) {
      req.flash('error', 'Le mot passe doit contenir au moins 8 caractères');
      return res.redirect('/users/add-user');
    }

    // Cria o novo utilizador
    const hashedPassword = await bcrypt.hash(password, 10); // 10 é o salt rounds
    const user = new User({ name: name, email: email, password: hashedPassword });

    await user.save();
    req.flash('success', 'Utilisateur créé avec succès');
    return res.redirect('/users/list-users'); // Redireciona para a lista de utilizadores

  } catch (error) {
    console.log(error);
    req.flash('error', 'Une erreur s\'est produite lors de la création de l\'utilisateur');
    return res.redirect('/users/add-user'); // Redireciona em caso de erro
  }
};

exports.getEditUser = async (req, res) => {
  const editMode = req.query.edit;
  const error = req.flash('error');
  const userId = req.params.id;

  try{
    if(!editMode){
      return res.redirect('/');
    }
    
    const user = await User.findById(userId);
    if(!user){
      return res.redirect('/');
    }
    res.render('users/add-user', {
      pageTitle: 'Editer un utilisateur',
      path: '/users',
      editMode: editMode,
      user: user,
      error: error
    });
  }
  catch(error){
    console.log(error);
  }
};

exports.updateUser = async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      req.flash('error', 'Cet utilisateur n\'existe pas');
      return res.redirect('/users/list-users');
    }

    if (password !== passwordConfirm) {
      req.flash('error', 'Les mots passe ne sont pas identiques');
      return res.redirect('/users/edit-user/' + userId + '?edit=true');
    }

    if (password.length < 8) {
      req.flash('error', 'Le mot passe doit contenir au moins 8 caractères');
      return res.redirect('/users/edit-user/' + userId + '?edit=true');
    }

    // Verifica se o email já existe em outro utilizador
    const existingUser = await User.findOne({ email: email });
    if (existingUser && existingUser._id.toString() !== userId) {
      req.flash('error', 'Adresse électronique invalide');
      return res.redirect('/users/edit-user/' + userId + '?edit=true');
    }

    // Hash da password e atualização dos dados
    const hashedPassword = await bcrypt.hash(password, 10);
    user.name = name;
    user.email = email;
    user.password = hashedPassword;

    await user.save();

    req.flash('success', 'Utilisateur mis à jour avec succès');
    return res.redirect('/users/list-users');

  } catch (error) {
    console.log(error);
    req.flash('error', 'Une erreur s\'est produite lors de la mise à jour de l\'utilisateur');
    return res.redirect('/users/edit-user/' + userId);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      req.flash('error', 'Cet utilisateur n\'existe pas');
      return res.redirect('/users/list-users');
    }
    req.flash('success', 'Utilisateur supprimé avec succès');
    return res.redirect('/users/list-users');
  } catch (error) {
      req.flash('error', 'Une erreur s\'est produite lors de la suppression de l\'utilisateur');
      return res.redirect('/users/list-users');
  }
};