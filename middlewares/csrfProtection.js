/**
 * @module middlewares/csrfProtection
 * @requires csurf
 * @description Middleware function that adds CSRF (Cross-Site Request Forgery) protection to the application.
 * 
 * This middleware protects against CSRF attacks by generating a token that is unique to the user's session.
 * It sets a secure, HTTP-only cookie with the CSRF token, which must be included in the headers or body of any 
 * state-changing HTTP request (e.g., POST, PUT, DELETE). This prevents malicious requests from being made by 
 * an attacker on behalf of an authenticated user.
 * 
 * The token can be validated using the CSRF token included in the request by using the middleware on relevant routes.
 * 
 * @param {Object} cookie - The cookie configuration for the CSRF token.
 * @param {boolean} cookie.httpOnly - Ensures the cookie is not accessible via JavaScript on the client-side.
 * @param {boolean} cookie.secure - Ensures the cookie is only sent over HTTPS (in production).
 * @param {string} cookie.sameSite - Ensures the cookie is only sent in first-party contexts (strict).
 * 
 * @returns {Function} - The CSRF middleware function to be used in Express.
 * 
 * @example
 * // Usage example:
 * const csrfProtection = require('./middlewares/csrfProtection');
 * app.use(csrfProtection); 
 * 
 * // In EJS templates, we can use a input tag like this:
 * <input type="hidden" name="_csrf" value="<%= csrfToken %>">
 */

const csrf = require("csurf");

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,                                   // Ensures the cookie cannot be accessed via JavaScript
    secure: process.env.NODE_ENV === "production",    // Ensures the cookie is only sent over HTTPS in production
    sameSite: "Strict"                                // Ensures the cookie is sent only in first-party contexts
  }
});

module.exports = csrfProtection;

