/**
 * @module config/importData
 * @requires models/user
 * @requires models/reservations
 * @description Import catways and reservations data from JSON files.
 *
 * This function imports the catways and reservations data from the JSON files
 * specified by the `catwaysPath` and `reservationsPath` constants, respectively.
 * If the data already exists in the database, it will not be overwritten.
 *
 * @async
 * @returns {Promise<void>} - A promise that resolves when the data has been
 *   successfully imported.
 */

const fs = require('fs');
const bcrypt = require("bcryptjs");

const Reservations = require('../models/reservations');
const Catways = require('../models/catway');
const Users = require('../models/user');

const catwaysPath = './data/catways.json';
const reservationsPath = './data/reservations.json';


module.exports = async () => {
  try {
    
    const reservationsCount = await Reservations.countDocuments();
    if (reservationsCount === 0) {
      const reservationsData = JSON.parse(fs.readFileSync(reservationsPath, 'utf-8'));
      await Reservations.insertMany(reservationsData);
      console.log('Reservations data imported successfully');
    } else {
      console.log('Reservations data already exists');
    }

    const catwaysCount = await Catways.countDocuments();
    if (catwaysCount === 0) {
      const catwaysData = JSON.parse(fs.readFileSync(catwaysPath, 'utf-8'));
      await Catways.insertMany(catwaysData);
      console.log('Catways data imported successfully');
    } else {
      console.log('Catways data already exists');
    }

    const usersCount = await Users.countDocuments();
    if (usersCount === 0) {
      const hashedPassword = await bcrypt.hash('Admin', 10);
      const user = new Users({
        name: 'John Doe',
        email: 'john.doe@mail.com',
        password: hashedPassword,
      })
      await user.save();
      console.log('User created successfully');
    } else {
      console.log('User data already exists');
    }

  } catch (error) {
    console.error('Error importing data:', error);
  }
};