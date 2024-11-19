/**
 * @module controllers/users
 * @description Controller for managing users. Handles operations like listing, adding, and editing users.
 * @requires models/user
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
      success: req.flash("success"),
      invalidChar: req.flash("invalidChar")
    });
  } catch (error) {
    console.log(error);
    req.flash(
      "error",
      "The user list could not be downloaded."
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
  const invalidChar = req.flash("invalidChar")
  const users = await User.find();

  try {
    res.render("users/add-user", {
      pageTitle: "Add a user",
      path: "/users",
      users: users,
      error: error,
      editMode: false,
      moment: moment,
      success: success,
      invalidChar: invalidChar
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

    if (!name || !email || !password || !passwordConfirm) {
      req.flash("error", "All fields are required");
      return res.redirect("/users/add-user");
    }

    const userDoc = await User.findOne({ email: email });
    if (userDoc) {
      req.flash("error", "The data provided is invalid");
      return res.redirect("/users/add-user");
    }

    if (password !== passwordConfirm) {
      req.flash("error", "Passwords are not identicals");
      return res.redirect("/users/add-user");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name: name,
      email: email,
      password: hashedPassword
    });

    await user.save();
    req.flash("success", "User successfully created");
    return res.redirect("/users/list-users");
  } catch (error) {
    console.log(error);
    req.flash(
      "error",
      "An error has occurred while creating the user"
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
  const invalidChar = req.flash("invalidChar")
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
      pageTitle: "Edit a user",
      path: "/users",
      editMode: editMode,
      user: user,
      users: users,
      moment: moment,
      error: error,
      success: success,
      invalidChar: invalidChar
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
      req.flash("error", "This user does not exist");
      return res.redirect("/users/list-users");
    }

    if (password !== passwordConfirm) {
      req.flash("error", "Passwords are not identical");
      return res.redirect("/users/edit-user/" + userId + "?edit=true");
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser && existingUser._id.toString() !== userId) {
      req.flash("error", "Invalid e-mail address");
      return res.redirect("/users/edit-user/" + userId + "?edit=true");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.name = name;
    user.email = email;
    user.password = hashedPassword;

    await user.save();

    req.flash("success", "User successfully updated");
    return res.redirect("/users/list-users");
  } catch (error) {
    console.log(error);
    req.flash(
      "error",
      "An error occurred while updating the user"
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
      req.flash("error", "This user does not exist");
      return res.redirect("/users/list-users");
    }
    req.flash("success", "User successfully deleted");
    return res.redirect("/users/list-users");
  } catch (error) {
    req.flash(
      "error",
      "An error occurred while deleting the user"
    );
    return res.redirect("/users/list-users");
  }
};
