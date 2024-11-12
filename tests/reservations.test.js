const mongoose = require('mongoose');
const { expect } = require('chai');
const Reservation = require('../models/reservations');

require('dotenv').config({ path: './env/.env.test' });

describe('Reservations Tests', function () {

  this.timeout(10000);

  before(async function () {
    const dbURI = process.env.MONGO_URI;
    await mongoose.connect(dbURI, {
      serverSelectionTimeoutMS: 10000,
    });
  });


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

    expect(mongoose.Types.ObjectId.isValid(reservation._id)).to.be.true;
    expect(reservation.catwayNumber).to.equal(reservationData.catwayNumber);
    expect(reservation.clientName).to.equal(reservationData.clientName);
    expect(reservation.boatName).to.equal(reservationData.boatName);
    expect(reservation.checkIn).to.equal(reservationData.checkIn);
    expect(reservation.checkOut).to.equal(reservationData.checkOut);
  });


  it('Get all reservations', async function () {
    const reservations = await Reservation.find();

    expect(reservations).to.be.an('array');
    expect(reservations.length).to.be.greaterThan(0);
  });


  it('Get a specific reservation', async function () {
    const reservation = await Reservation.findOne({ catwayNumber: 12345 });

    expect(reservation).to.exist;
    expect(reservation.catwayNumber).to.equal(12345);
    expect(reservation.clientName).to.equal('John Doe');
    expect(reservation.boatName).to.equal('My Boat');
    expect(reservation.checkIn).to.be.instanceOf(Date);
    expect(reservation.checkOut).to.be.instanceOf(Date);
  });


  it('Delete a reservation', async function () {
    const reservation = await Reservation.findOne({ catwayNumber: 12345 });
    expect(reservation).to.exist;

    await Reservation.deleteOne({_id: reservation._id});

    const deletedReservation = await Reservation.findOne({ catwayNumber: 12345 });
    expect(deletedReservation).to.not.exist;
  });

  after(async function () {
    Reservation.deleteMany({});
    // Close the database connection
    await mongoose.disconnect();
  });
});