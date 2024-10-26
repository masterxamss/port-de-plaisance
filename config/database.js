const mongoose = require('mongoose');

const dotenv = require('dotenv');

require('dotenv').config({ path: './env/.env' });

dotenv.config();

/**
 * Connect to MongoDB using the connection string stored in the MONGO_URI
 * environment variable.
 *
 * @returns {undefined}
 */
const connectDB = async () => {
  mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
};

module.exports = connectDB;