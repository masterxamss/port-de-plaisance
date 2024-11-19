const mongoose = require('mongoose');
const { expect } = require('chai');
const Reservation = require('../models/reservations');
//require('dotenv').config({ path: './env/.env.test.local' });
require('dotenv').config({ path: `./env/.env.test.local` });

/**
 * Test suite for the Reservation model.
 *
 * This suite contains tests for creating, retrieving, and deleting reservations.
 *
 */
describe('Reservations Tests', function () {

  this.timeout(10000);  // Set a timeout of 10 seconds for all tests

  /**
   * Connect to the database before all tests.
   * 
   * @async
   */
  before(async function () {
    const dbURI = process.env.MONGO_URI;
    await mongoose.connect(dbURI, {
      serverSelectionTimeoutMS: 20000,
    });
  });

  /**
   * Clean up the database after each test.
   * 
   * @async
   */
  afterEach(async function () {
    await Reservation.deleteMany({});
  });

  /**
   * Disconnect from the database after all tests.
   * 
   * @async
   */
  after(async function () {
    await mongoose.disconnect();
  });

  /**
   * Test for creating a new reservation.
   *
   * This test checks if a new reservation can be created and saved to the database.
   * It also verifies that the reservation's properties are correctly assigned.
   * 
   * @async
   */
  it('Create a new reservation', async function () {
    const reservationData = {
      catwayNumber: 12345,
      clientName: 'John Doe',
      boatName: 'My Boat',
      checkIn: new Date(),
      checkOut: new Date()
    };

    const reservation = new Reservation(reservationData);
    await reservation.save();

    // Assertions
    expect(mongoose.Types.ObjectId.isValid(reservation._id)).to.be.true;      // Verifies the _id is valid
    expect(reservation.catwayNumber).to.equal(reservationData.catwayNumber);  // Verifies catwayNumber
    expect(reservation.clientName).to.equal(reservationData.clientName);      // Verifies clientName
    expect(reservation.boatName).to.equal(reservationData.boatName);          // Verifies boatName
    expect(reservation.checkIn).to.equal(reservationData.checkIn);            // Verifies checkIn date
    expect(reservation.checkOut).to.equal(reservationData.checkOut);          // Verifies checkOut date
  });

  /**
   * Test for retrieving all reservations.
   *
   * This test checks if all reservations can be fetched from the database.
   * It also verifies if the result is an array and contains at least one reservation.
   * 
   * @async
   */
  it('Get all reservations', async function () {
    const reservationData = {
      catwayNumber: 12345,
      clientName: 'John Doe',
      boatName: 'My Boat',
      checkIn: new Date(),
      checkOut: new Date()
    };

    await new Reservation(reservationData).save();
    const reservations = await Reservation.find();

    // Assertions
    expect(reservations).to.be.an('array');            // Verifies the response is an array
    expect(reservations.length).to.be.greaterThan(0);  // Verifies the array contains at least one reservation
  });

  /**
   * Test for retrieving a specific reservation by its catwayNumber.
   *
   * This test checks if a reservation can be retrieved using its unique catwayNumber and 
   * if the reservation properties match the expected values.
   * 
   * @async
   */
  it('Get a specific reservation', async function () {
    const reservationData = {
      catwayNumber: 12345,
      clientName: 'John Doe',
      boatName: 'My Boat',
      checkIn: new Date(),
      checkOut: new Date()
    };

    const reservation = await new Reservation(reservationData).save();
    const foundReservation = await Reservation.findOne({ catwayNumber: reservation.catwayNumber });

    // Assertions
    expect(foundReservation).to.exist;                                             // Verifies the reservation exists
    expect(foundReservation.catwayNumber).to.equal(reservationData.catwayNumber);  // Verifies catwayNumber
    expect(foundReservation.clientName).to.equal(reservationData.clientName);      // Verifies clientName
    expect(foundReservation.boatName).to.equal(reservationData.boatName);          // Verifies boatName
    expect(foundReservation.checkIn).to.be.instanceOf(Date);                       // Verifies checkIn is a Date
    expect(foundReservation.checkOut).to.be.instanceOf(Date);                      // Verifies checkOut is a Date
  });

  /**
   * Test for deleting a reservation.
   *
   * This test checks if a reservation can be deleted using its _id and if it is no longer 
   * present in the database after deletion.
   * 
   * @async
   */
  it('Delete a reservation', async function () {
    const reservationData = {
      catwayNumber: 12345,
      clientName: 'John Doe',
      boatName: 'My Boat',
      checkIn: new Date(),
      checkOut: new Date()
    };

    const reservation = await new Reservation(reservationData).save();
    await Reservation.deleteOne({ _id: reservation._id });

    const deletedReservation = await Reservation.findOne({ catwayNumber: reservation.catwayNumber });

    // Assertions
    expect(deletedReservation).to.not.exist;  // Verifies the reservation is deleted
  });

});