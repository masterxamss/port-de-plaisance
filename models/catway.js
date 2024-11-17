const mongoose = require("mongoose");

/**
 * The Catway schema represents a catway in the system.
 *
 * @namespace Models
 * @module models/catway
 * @model Catway
 * @description This model stores the details of a catway including its number, type, and state.
 */

/**
 * @typedef {Object} Catway
 * @property {number} catwayNumber - The unique identifier for the catway.
 * @property {string} type - The type of the catway, either 'long' or 'short'.
 * @property {string} catwayState - The current state of the catway.
 * @property {Date} createdAt - The date when the catway was created.
 * @property {Date} updatedAt - The date when the catway was last updated.
 */

/**
 * Schema for the Catway model.
 *
 * @type {mongoose.Schema<Catway>}
 */
const catwaySchema = new mongoose.Schema(
  {
    /**
     * The unique identifier for the catway.
     * @type {number}
     * @required
     * @unique
     */
    catwayNumber: {
      type: Number,
      required: true,
      unique: true
    },

    /**
     * The type of the catway, either 'long' or 'short'.
     * @type {string}
     * @enum {string} ["long", "short"]
     * @required
     */
    type: {
      type: String,
      enum: ["long", "short"],
      required: true
    },

    /**
     * The current state of the catway.
     * @type {string}
     * @required
     */
    catwayState: {
      type: String,
      required: true
    }
  },
  {
    /**
     * Options for the schema.
     * @type {Object}
     * @property {boolean} timestamps - Set to true to add createdAt and updatedAt fields
     */
    timestamps: true
  }
);

/**
 * Model for the Catway.
 * 
 * @type {mongoose.Model<Catway>}
 */
module.exports = mongoose.model("Catway", catwaySchema);

// const mongoose = require('mongoose');

// /**
//  * The Catway schema represents a catway in the system.
//  *
//  * @module models/catway
//  * @model Catway
//  * @description This model stores the details of a catway including its number, type, and state.
//  */

// /**
//  * @typedef {Object} Catway
//  * @property {number} catwayNumber - The unique identifier for the catway.
//  * @property {string} type - The type of the catway, either 'long' or 'short'.
//  * @property {string} catwayState - The current state of the catway.
//  * @property {Date} createdAt - The date when the catway was created.
//  * @property {Date} updatedAt - The date when the catway was last updated.
//  */
// const catwaySchema = new mongoose.Schema({
//   catwayNumber: {
//     type: Number,
//     required: true,
//     unique: true
//   },
//   type: {
//     type: String,
//     enum: ['long', 'short'],
//     required: true,
//   },
//   catwayState: {
//     type: String,
//     required: true
//   },
// },
// {
//   timestamps: true
// });

// module.exports = mongoose.model('Catway', catwaySchema);
