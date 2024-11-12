const mongoose = require('mongoose');
const { expect } = require('chai');
const Catway = require('../models/catway');

require('dotenv').config({ path: './env/.env.test' });

describe('Catways Tests', function () {

  this.timeout(10000);

  before(async function () {
    const dbURI = process.env.MONGO_URI;
    await mongoose.connect(dbURI, {
      serverSelectionTimeoutMS: 10000,
    });
  });


  it('Create a new catway', async function () {
    const catwayData = {
      catwayNumber: 12345,
      type: 'long',
      catwayState: 'Good condition'
    };

    const catway = new Catway(catwayData);
    await catway.save();

    expect(mongoose.Types.ObjectId.isValid(catway._id)).to.be.true;
    expect(catway.catwayNumber).to.equal(catwayData.catwayNumber);
    expect(catway.type).to.equal(catwayData.type);
    expect(catway.catwayState).to.equal(catwayData.catwayState);
  });


  it('Get all catways', async function () {
    const catways = await Catway.find();

    expect(catways).to.be.an('array');
    expect(catways.length).to.be.greaterThan(0);
  });


  it('Get a specific catway', async function () {
    const catway = await Catway.findOne({ catwayNumber: 12345 });

    expect(catway).to.exist;
    expect(catway.catwayNumber).to.equal(12345);
    expect(catway.type).to.equal('long');
    expect(catway.catwayState).to.equal('Good condition');
  });


  it('Update state of a catway', async function () {
    const catway = await Catway.findOne({catwayNumber: 12345});
    expect(catway).to.exist;   

    await Catway.updateOne({catwayNumber: 12345}, { catwayState: 'Bad condition' });

    const updatedCatway = await Catway.findOne({catwayNumber: 12345});
    expect(updatedCatway.catwayState).to.equal('Bad condition');

  });


  it('Delete a catway', async function () {
    const catway = await Catway.findOne({catwayNumber: 12345});
    expect(catway).to.exist;

    await Catway.deleteOne({catwayNumber: 12345});

    const deletedCatway = await Catway.findOne({catwayNumber: 12345});
    expect(deletedCatway).to.not.exist;
  });


  after(async function () {
    Catway.deleteMany({});
    // Close the database connection
    await mongoose.disconnect();
  });
});
