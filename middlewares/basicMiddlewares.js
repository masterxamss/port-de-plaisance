const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');

/**
 * @module basicMiddlewares
 * 
 * @description Configures essential middlewares for the Express application, including body parsing,
 * method overriding, and static file serving.
 * 
 * This function applies the following middlewares:
 * - `bodyParser.urlencoded`: Parses incoming request bodies with `application/x-www-form-urlencoded` format.
 * - `methodOverride`: Allows for HTTP method overriding via a query parameter (`_method`).
 * - `express.static`: Serves static files from the `public` directory.
 * 
 * @function
 * @param {Object} app - The Express application instance to configure.
 * 
 * @returns {void} - This function does not return anything but configures the app with necessary middlewares.
 * 
 * @example
 * // Apply all necessary middlewares in your app
 * const app = express();
 * require('./middlewares')(app);
 */
module.exports = (app) => {
  // Parse application/x-www-form-urlencoded data
  app.use(bodyParser.urlencoded({ extended: false }));

  // Enable method overriding (for PUT/DELETE support via _method query parameter)
  app.use(methodOverride('_method'));

  // Serve static files from the 'public' folder
  app.use(express.static(path.join(__dirname, '../public')));
};

