const mongoose = require('mongoose');
const { expect } = require('chai');
const Catway = require('../models/catway');

//require('dotenv').config({ path: './env/.env.test.local' });
require('dotenv').config({ path: `./env/.env.test.local` });

/**
 * Test suite for the Catway model.
 *
 * This suite contains tests for creating, retrieving, updating, and deleting Catway documents.
 */

describe('Catways Tests', function () {

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
    await Catway.deleteMany({});
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
   * Test for creating a new catway.
   *
   * This test checks if a new Catway can be created and saved to the database.
   * It also verifies if the object is correctly assigned its properties.
   * 
   * @async
   */
  it('Create a new catway', async function () {
    const catwayData = {
      catwayNumber: 12345,
      type: 'long',
      catwayState: 'Good condition'
    };

    const catway = new Catway(catwayData);
    await catway.save();

    // Assertions
    expect(mongoose.Types.ObjectId.isValid(catway._id)).to.be.true;   // Validates the _id is an ObjectId
    expect(catway.catwayNumber).to.equal(catwayData.catwayNumber);    // Verifies the catwayNumber
    expect(catway.type).to.equal(catwayData.type);                    // Verifies the type
    expect(catway.catwayState).to.equal(catwayData.catwayState);      // Verifies the state
  });

  /**
   * Test for retrieving all catways.
   *
   * This test checks if all the Catway documents can be fetched from the database
   * and if the returned data is an array with at least one catway.
   * 
   * @async
   */
  it('Get all catways', async function () {
    const catwayData = {
      catwayNumber: 12345,
      type: 'long',
      catwayState: 'Good condition'
    };

    await new Catway(catwayData).save();
    const catways = await Catway.find();

    // Assertions
    expect(catways).to.be.an('array');                               // Verifies the response is an array
    expect(catways.length).to.be.greaterThan(0);                     // Verifies the array contains at least one catway
  });

  /**
   * Test for retrieving a specific catway by its number.
   *
   * This test checks if a Catway can be retrieved by its unique catwayNumber and 
   * if its properties match the expected values.
   * 
   * @async
   */
  it('Get a specific catway', async function () {
    const catwayData = {
      catwayNumber: 12345,
      type: 'long',
      catwayState: 'Good condition'
    };

    const catway = await new Catway(catwayData).save();
    const foundCatway = await Catway.findOne({ catwayNumber: catway.catwayNumber });

    // Assertions
    expect(foundCatway).to.exist;                                       // Verifies the catway exists
    expect(foundCatway.catwayNumber).to.equal(catwayData.catwayNumber); // Verifies catwayNumber
    expect(foundCatway.type).to.equal(catwayData.type);                 // Verifies type
    expect(foundCatway.catwayState).to.equal(catwayData.catwayState);   // Verifies state
  });

  /**
   * Test for updating the state of a catway.
   *
   * This test checks if the state of a specific Catway can be updated
   * and if the changes are correctly reflected in the database.
   * 
   * @async
   */
  it('Update state of a catway', async function () {
    const catwayData = {
      catwayNumber: 12345,
      type: 'long',
      catwayState: 'Good condition'
    };

    const catway = await new Catway(catwayData).save();
    await Catway.updateOne({ catwayNumber: catway.catwayNumber }, { catwayState: 'Bad condition' });

    const updatedCatway = await Catway.findOne({ catwayNumber: catway.catwayNumber });

    // Assertions
    expect(updatedCatway.catwayState).to.equal('Bad condition');  // Verifies the updated state
  });

  /**
   * Test for deleting a catway.
   *
   * This test checks if a Catway can be deleted by its catwayNumber and if it is 
   * no longer present in the database.
   * 
   * @async
   */
  it('Delete a catway', async function () {
    const catwayData = {
      catwayNumber: 12345,
      type: 'long',
      catwayState: 'Good condition'
    };

    const catway = await new Catway(catwayData).save();
    await Catway.deleteOne({ catwayNumber: catway.catwayNumber });

    const deletedCatway = await Catway.findOne({ catwayNumber: catway.catwayNumber });

    // Assertions
    expect(deletedCatway).to.not.exist;  // Verifies the catway no longer exists
  });

});
