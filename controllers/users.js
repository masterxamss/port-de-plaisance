/**
 * @module Users-controller
 * @description Controller for managing users. Handles operations like listing, adding, and editing users.
 */

const bcrypt = require("bcryptjs");
const moment = require("moment");

const User = require("../models/user");

/**
 * Retrieves the list of users and renders the users list page.
 * 
 * @async
 * @function getUsers
 * @param {Object} req - The HTTP request.
 * @param {Object} res - The HTTP response.
 * @returns {void}
 * @example
 * // Example usage:
 * app.get('users/list-users', users.getUsers);
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).render("users/users-list", {
      pageTitle: "Users list",
      users: users,
      path: "/users",
      moment: moment,
      error: req.flash("error"),
      success: req.flash("success")
    });
  } catch (error) {
    console.log(error);
    req.flash(
      "error",
      "La liste des utilisateurs n'a pas pu être téléchargée."
    );
    res.render("users/users-list", {
      pageTitle: "Users list",
      users: [],
      path: "/users",
      moment: moment,
      errorMessage: req.flash("error")
    });
  }
};

/**
 * Renders the page to add a new user.
 * 
 * @async
 * @function getAddUser
 * @param {Object} req - The HTTP request.
 * @param {Object} res - The HTTP response.
 * @returns {void}
 * @example
 * // Example usage:
 * app.get('/users/add-user', users.getAddUser);
 */
exports.getAddUser = async (req, res) => {
  const error = req.flash("error");
  const success = req.flash("success");
  const users = await User.find();

  try {
    res.render("users/add-user", {
      pageTitle: "Ajout d'un utilisateur",
      path: "/users",
      users: users,
      error: error,
      editMode: false,
      moment: moment,
      success: success
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Creates a new user after validating the input.
 * 
 * @async
 * @function createUser
 * @param {Object} req - The HTTP request.
 * @param {Object} res - The HTTP response.
 * @returns {void}
 * @throws {Error} If an error occurs during user creation.
 * @example
 * // Example usage:
 * app.post('/users/add-user', createUser);
 */
exports.createUser = async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  try {
    const userDoc = await User.findOne({ email: email });
    if (userDoc) {
      req.flash("error", "Les données fournies sont invalides");
      return res.redirect("/users/add-user");
    }

    if (password !== passwordConfirm) {
      req.flash("error", "Les mots passe ne sont pas identiques");
      return res.redirect("/users/add-user");
    }

    if (password.length < 8) {
      req.flash("error", "Le mot passe doit contenir au moins 8 caractères");
      return res.redirect("/users/add-user");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name: name,
      email: email,
      password: hashedPassword
    });

    await user.save();
    req.flash("success", "Utilisateur créé avec succès");
    return res.redirect("/users/list-users");
  } catch (error) {
    console.log(error);
    req.flash(
      "error",
      "Une erreur s'est produite lors de la création de l'utilisateur"
    );
    return res.redirect("/users/add-user");
  }
};

/**
 * Retrieves and renders the edit user page for an existing user.
 * 
 * @async
 * @function getEditUser
 * @param {Object} req - The HTTP request.
 * @param {Object} res - The HTTP response.
 * @returns {void}
 * @example
 * // Example usage:
 * app.get('/users/edit-user/:id', getEditUser);
 */
exports.getEditUser = async (req, res) => {
  const editMode = req.query.edit;
  const error = req.flash("error");
  const success = req.flash("success");
  const userId = req.params.id;
  const users = await User.find();

  try {
    if (!editMode) {
      return res.redirect("/");
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.redirect("/");
    }
    res.render("users/add-user", {
      pageTitle: "Editer un utilisateur",
      path: "/users",
      editMode: editMode,
      user: user,
      users: users,
      moment: moment,
      error: error,
      success: success
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Updates the information of an existing user, including validation of the email and password.
 * 
 * @async
 * @function updateUser
 * @param {Object} req - The HTTP request.
 * @param {Object} res - The HTTP response.
 * @returns {void}
 * @throws {Error} If an error occurs during the update process.
 * @example
 * // Example usage:
 * app.patch('/users/edit-user/:id', updateUser);
 */
exports.updateUser = async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      req.flash("error", "Cet utilisateur n'existe pas");
      return res.redirect("/users/list-users");
    }

    if (password !== passwordConfirm) {
      req.flash("error", "Les mots passe ne sont pas identiques");
      return res.redirect("/users/edit-user/" + userId + "?edit=true");
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser && existingUser._id.toString() !== userId) {
      req.flash("error", "Adresse électronique invalide");
      return res.redirect("/users/edit-user/" + userId + "?edit=true");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.name = name;
    user.email = email;
    user.password = hashedPassword;

    await user.save();

    req.flash("success", "Utilisateur mis à jour avec succès");
    return res.redirect("/users/list-users");
  } catch (error) {
    console.log(error);
    req.flash(
      "error",
      "Une erreur s'est produite lors de la mise à jour de l'utilisateur"
    );
    return res.redirect("/users/edit-user/" + userId);
  }
};

/**
 * Deletes an existing user by its ID.
 * 
 * @async
 * @function deleteUser
 * @param {Object} req - The HTTP request.
 * @param {Object} res - The HTTP response.
 * @returns {void}
 * @throws {Error} If an error occurs during the deletion process.
 * @example
 * // Example usage:
 * app.delete('/users/delete-user/:id', deleteUser);
 */
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      req.flash("error", "Cet utilisateur n'existe pas");
      return res.redirect("/users/list-users");
    }
    req.flash("success", "Utilisateur supprimé avec succès");
    return res.redirect("/users/list-users");
  } catch (error) {
    req.flash(
      "error",
      "Une erreur s'est produite lors de la suppression de l'utilisateur"
    );
    return res.redirect("/users/list-users");
  }
};
