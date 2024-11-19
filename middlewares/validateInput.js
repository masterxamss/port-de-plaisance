/**
 * @description Middleware to validate form inputs based on predefined rules.
 *
 * - Validates dates in DD/MM/YYYY or YYYY/MM/DD format.
 * - Validates email format.
 * - Validates password strength.
 * - Validates for invalid characters in specific fields.
 * - Redirects back to the previous page with an error message if validation fails.
 *
 * @module middlewares/validateInputs
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing form inputs.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The callback to pass control to the next middleware.
 * 
 * @example
 * const express = require('express');
 * const validateInputs = require('./middlewares/validateInput');
 *
 * const app = express();
 *
 * // Middleware setup
 * app.use(express.urlencoded({ extended: true }));
 *
 * app.post('/submit-form', validateInputs, (req, res) => {
 *   // If validation passes
 *   res.send('Form submitted successfully!');
 * });
 *
 * // Start the server
 * app.listen(3000, () => {
 *   console.log('Server is running on http://localhost:3000');
 * });
 */
module.exports = (req, res, next) => {
  const inputs = req.body;

  // Regex to validate invalid characters
  const errors = /[^a-zA-Z0-9_]/;

  // Regex to validate dates in DD/MM/YYYY or YYYY/MM/DD format
  const dateRegex = /^(?:(0[1-9]|[12][0-9]|3[01])[-\/](0[1-9]|1[0-2])[-\/]\d{4}|(\d{4})[-\/](0[1-9]|1[0-2])[-\/](0[1-9]|[12][0-9]|3[01]))$/;

  // Regex to validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Regex to validate password strength
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

  // Loop through each input field
  for (const [key, value] of Object.entries(inputs)) {
    // Skip specific fields (CSRF, emailLogin, passwordLogin)
    if (key === "_csrf" || key === "emailLogin" || key === "passwordLogin") {
      continue;
    }

    // Validation for date fields
    if ((key === "check_in" || key === "check_out") && !dateRegex.test(value.trim())) {
      console.log(`Invalid date for ${key}: ${value}`);
      req.flash("error", `The ${key} format is invalid`);
      return res.redirect(req.get("Referrer"));
    }

    // Validation for email format
    if (key === "email" && !emailRegex.test(value.trim())) {
      req.flash("error", `The email format is invalid`);
      return res.redirect(req.get("Referrer"));
    }

    // Validation for password strength
    if (key === "password" && !passwordRegex.test(value.trim())) {
      req.flash(
        "error",
        `The password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character`
      );
      return res.redirect(req.get("Referrer"));
    }

    // Validation for name-related fields
    if ((key === "name" || key === "client_name" || key === "boat_name") && errors.test(value.trim())) {
      req.flash("error", `The ${key} cannot be empty or contain special characters`);
      return res.redirect(req.get("Referrer"));
    }

    // Validation for catway state
    if (key === "catwayState" && errors.test(value.trim())) {
      req.flash("error", `The state cannot be empty or contain special characters`);
      return res.redirect(req.get("Referrer"));
    }
  }

  next(); // Proceed to the next middleware if all validations pass
};

