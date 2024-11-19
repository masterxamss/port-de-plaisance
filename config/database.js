/**
 * @module config/database
 * @description Module for connecting to MongoDB using Mongoose.
 * @see {@link https://mongoosejs.com/docs/connections.html}
 * @requires mongoose
 * @requires dotenv
 */

const mongoose = require('mongoose');

require('dotenv').config({ path: `./env/.env.${process.env.NODE_ENV}` });

/**
 * @description This function establishes a connection to MongoDB using Mongoose. 
 * It reads the MongoDB URI from environment variables and attempts to connect to the database.
 * If the connection is successful, it logs a success message to the console.
 * If the connection fails, it logs an error message with the details of the failure.
 * 
 * This function should be called at the start of the application to ensure that your application 
 * can communicate with the MongoDB database.
 * 
 * @async
 * @function connectDB
 * @returns {Promise<void>} - A promise that resolves when the connection is successfully established.
 * 
 * @throws {Error} - If the connection to MongoDB fails, an error is thrown and logged to the console.
 * 
 * @example
 * // Usage example
 * const connectDB = require('./connectDB');
 * connectDB();
 */
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    socketTimeoutMS: 30000, 
    connectTimeoutMS: 30000, 
  })
    .then(() => {
      console.log('Connected to MongoDB successfully');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });
};

module.exports = connectDB;
