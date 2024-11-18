/**
 * @module middlewares/sessionConfig
 * @description Exporting the session middleware with the configured settings
 * @requires express-session
 * @requires connect-mongodb-session
 */
require('dotenv').config({ path: `./env/.env.${process.env.NODE_ENV}` });

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);


/**
 * @description Middleware that configures the session management for the application using `express-session` 
 * and `connect-mongodb-session`. It stores session data in MongoDB, ensuring persistence across server restarts.
 * 
 * This middleware uses a MongoDB database to store session data. The session will be secured using the `JWT_SECRET` 
 * environment variable and will set cookies with appropriate security settings for production and development environments.
 * 
 * The session cookie will have a `httpOnly` flag for security, ensuring it can't be accessed by JavaScript, and a 
 * `maxAge` of 24 hours.
 * 
 * @function
 * @param {Object} req - The request object, which will be enhanced with session data.
 * @param {Object} res - The response object, which will send the session cookie to the client.
 * @param {Function} next - The next middleware function in the chain to be called after session setup.
 * 
 * @returns {void} - This function does not return anything. It configures the session and allows the request cycle to continue.
 * 
 * @example
 * // Usage example:
 * // This middleware should be used in your Express application to manage user sessions.
 * const sessionConfig = require('./middlewares/sessionConfig');
 * app.use(sessionConfig);
 */

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions'                                  // Store session data in the 'sessions' collection
});

module.exports = session({
  secret: process.env.JWT_SECRET,                         // Secret key to sign the session ID
  resave: false,                                          // Do not save the session if it is unmodified
  saveUninitialized: false,                               // Do not save an uninitialized session
  store: store,                                           // Using MongoDBStore to store session data in MongoDB
  cookie: {
    httpOnly: true,                                       // Prevents client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === 'production' && 
      process.env.IS_LOCAL !== 'true',                    // Ensures cookies are sent securely in production
    maxAge: 1000 * 24 * 60 * 60                           // Set the session cookie to expire after 24 hours
  }
});

