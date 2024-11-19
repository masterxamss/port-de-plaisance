/**
 * @module controllers/auth
 * @description Module for handling user authentication and authorization.
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config({ path: `./env/.env.${process.env.NODE_ENV}` });

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
  const invalidChar = req.flash("invalidChar");
  res.render("auth/login", {
    pageTitle: "Connexion",
    path: "/login",
    error: error,
    success: req.flash("success"),
    invalidChar: invalidChar
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
  const { emailLogin, passwordLogin } = req.body;
  const SECRET_KEY = process.env.JWT_SECRET;

  try {
    // Attempt to find the user by email in the database
    const user = await User.findOne({ email: emailLogin }, "-__v -createdAt -updatedAt");

    // If no user is found, show an error message and redirect back to login page
    if (!user) {                                                                                    
      req.flash("error", "The information provided is invalid");
      return res.redirect("/auth/login");
    }

    // Compare the entered password with the stored password hash using bcrypt
    bcrypt.compare(passwordLogin, user.password, (err, response) => {                                    
      if (err) {
        console.error(err);
        req.flash("error", "Something went wrong. Please try again.");
        return res.redirect("/auth/login");
      }

      // If the passwords don't match, show an error message and redirect
      if (!response) {                                                                              
        req.flash("error", "The information provided is invalid");
        return res.redirect("/auth/login");
      }

      // If login is successful, remove the password from the user object
      const userObject = user.toObject();
      delete userObject.password;

      // If login is successful, remove the password from the user object
      const expireIn = 24 * 60 * 60;
      const token = jwt.sign({ user: userObject }, SECRET_KEY, { expiresIn: expireIn });

      // Generate the JWT token
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",    // Use secure cookies in production
        sameSite: "Strict",                               // Prevents CSRF attacks
        maxAge: expireIn * 1000,                          // Set expiration time for the cookie
      });

      // Set the session to mark the user as logged in
      req.session.isLoggedIn = true;
      req.session.user = userObject;

      // Save the session and redirect to the dashboard
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          req.flash("error", "Could not log in. Please try again.");
          return res.redirect("/");
        }
        //console.log("Session saved successfully:", req.session);
        return res.redirect("/dashboard");
      });
    });
  } catch (error) {
    // Catch any errors during the login process
    console.error("Error in postLogin:", error);
    res.status(500).send("Internal Server Errorssss");
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
  // Destroy the session to log the user out
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error destroying session");
    }

    // Clear the JWT token cookie from the client's browser
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict"
    });

    // Redirect the user to the homepage after logging out
    res.redirect("/");
  });
};
