/** 
 * @module middlewares/basicMiddlewares
 * @description Configures essential middlewares for the Express application, including body parsing,
 * method overriding, and static file serving.
 * 
 * This function applies the following middlewares:
 * - `bodyParser.urlencoded`: Parses incoming request bodies with `application/x-www-form-urlencoded` format.
 * - `methodOverride`: Allows for HTTP method overriding via a query parameter (`_method`).
 * - `express.static`: Serves static files from the `public` directory.
 * 
 * @param {Object} app - The Express application instance to configure.
 * 
 * @returns {void} - This function does not return anything but configures the app with necessary middlewares.
 * 
 * @example
 * // Apply all necessary middlewares in the app
 * const app = express();
 * require('./middlewares')(app);
 */

const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');

module.exports = (app) => {

  app.use(bodyParser.urlencoded({ extended: false }));                  //Parses incoming request bodies with `application/x-www-form-urlencoded` format.

  app.use(methodOverride('_method'));                                   //Allows for HTTP method overriding via a query parameter (`_method`).

  app.use(express.static(path.join(__dirname, '../public')));           //Serves static files from the `public` directory.

  app.use('/docs', express.static(path.join(__dirname, '../docs')));    //Serves static files from the `docs` directory.
};

