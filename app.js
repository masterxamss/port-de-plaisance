/**
 * @global
 * @name App
 * @description Main entry point for the "Port de la plaisance Russell" application.
 * This file sets up the middleware, routes, and connects to the database.
 * It also configures the view engine and starts the Express server.
 * 
 * 
 * @requires express
 * @requires cookie-parser
 * @requires connectDB
 * @requires session
 * @requires csrfProtection
 * @requires authUser
 * @requires locals
 * @requires basicMiddlewares
 * @requires catwayRoutes
 * @requires reservationRoutes
 * @requires usersRoutes
 * @requires authRoutes
 * @requires homeRoutes
 * @requires errorController
 * 
 * @example
 * // To run the app locally
 * node app.js
 */

// Import dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const importData = require('./config/importData');
const session = require('./middlewares/sessionConfig');
const csrfProtection = require('./middlewares/csrfProtection');
const authUser = require('./middlewares/authUser');
const locals = require('./middlewares/setLocals');
const basicMiddlewares = require('./middlewares/basicMiddlewares');
const validateInput = require('./middlewares/validateInput');
require('dotenv').config({ path: `./env/.env.${process.env.NODE_ENV}` });

// Import route handlers
const catwayRoutes = require('./routes/catway');
const reservationRoutes = require('./routes/reservations');
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');

// Import 404 page not found controller
const errorController = require('./controllers/error');

const app = express();                    // Create an Express application

connectDB();                              // Connects to the database
importData();                             // Imports data

/**
 * Sets the view engine and views directory for the application.
 */
app.set('view engine', 'ejs');            
app.set('views', 'views');
app.set('trust proxy', 1);


/**
 * Configures middleware for the application.
 */
basicMiddlewares(app);                    // Configures basic middleware
app.use(session);                         // Configures session
app.use(cookieParser('secrect-key'));     // Parses cookies with a secret key
app.use(csrfProtection);                  // Adds CSRF protection
app.use(require('connect-flash')());      // Enables flash messages
app.use(authUser);                        // Authenticates the user
app.use(locals);                          // Sets local variables
app.use(validateInput);

/**
 * Mounts route handlers.
 */
app.use(homeRoutes);                      // Handles home routes
app.use(catwayRoutes);                    // Handles catway-related routes
app.use(reservationRoutes);               // Handles reservation-related routes
app.use('/users', usersRoutes);           // Handles user-related routes
app.use('/auth', authRoutes);             // Handles authentication-related routes

app.use(errorController.get404);          // Handles 404 page

module.exports = app;

/**
 * @constant {number} DEFAULT_PORT
 * Port where the application will run.
 * If `process.env.PORT` is not set, it defaults to 10000.
 */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));