/**
 * @module controllers/auth
 * @description Module for handling user authentication and authorization.
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/user");

/**
 *
 * Render the login page. If there are any error or success messages from previous requests, they are passed to the view.
 *
 * @function getLogin
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 *
 * @returns {void} - Renders the login page with any errors or success messages.
 */
exports.getLogin = (req, res) => {
  const error = req.flash("error");
  res.render("auth/login", {
    pageTitle: "Connexion",
    path: "/login",
    error: error,
    success: req.flash("success")
  });
};

/**
 *
 * Handle the login process. It verifies the user's email and password, generates a JWT token upon successful login, and sets the session.
 * If the login fails, an error message is displayed and the user is redirected back to the login page.
 *
 * @function postLogin
 * @param {Object} req - The request object containing the user's credentials (email and password).
 * @param {Object} res - The response object.
 *
 * @returns {void} - Redirects the user to the dashboard if login is successful, or redirects back to the login page with an error message if the login fails.
 *
 * @throws {Error} - Throws an error if there are issues during the bcrypt password comparison or JWT token generation.
 *
 * @example
 * // Usage: Call the postLogin function when the user submits the login form.
 * // The credentials (email and password) will be validated, and upon success, the user will be logged in.
 * app.post('/login', postLogin);
 */
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  const SECRET_KEY = process.env.JWT_SECRET;
  try {
    let user = await User.findOne(
      { email: email },
      "-__v -createdAt -updatedAt"
    );
    if (user) {
      bcrypt.compare(password, user.password, function (err, response) {
        if (err) {
          throw new Error(err);
        }
        if (response) {
          delete user._doc.password;

          const expireIn = 24 * 60 * 60;
          const token = jwt.sign({ user: user }, SECRET_KEY, {
            expiresIn: expireIn
          });

          res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: expireIn * 1000
          });

          req.session.isLoggedIn = true;
          req.session.user = user;

          return req.session.save((err) => {
            if (err) {
              console.log(err);
              res.redirect("/");
            }
            return res.redirect("/dashboard");
          });
        }

        req.flash("error","The information provided is invalid");
        return res.redirect("/auth/login");
      });
    } else {
      req.flash("error", "The information provided is invalid");
      return res.redirect("/auth/login");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

/**
 *
 * Logs out the user by destroying the session and clearing the JWT token cookie.
 * After logging out, the user is redirected to the homepage.
 *
 * @function postLogout
 * @param {Object} req - The request object containing the session data.
 * @param {Object} res - The response object.
 *
 * @returns {void} - Redirects the user to the homepage after logging out.
 */
exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict"
    });

    res.redirect("/");
  });
};
