const mongoose = require('mongoose');

const dotenv = require('dotenv');

require('dotenv').config({ path: './env/.env' });

dotenv.config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
};

module.exports = connectDB;