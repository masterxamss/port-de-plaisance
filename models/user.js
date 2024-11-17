const mongoose = require("mongoose");

/**
 * The User schema represents a user in the system.
 *
 * @namespace Models
 * @module models/user
 * @model User
 * @description This model stores user details including name, email, and password.
 */

/**
 * @typedef {Object} User
 * @property {string} name - The user's name.
 * @property {string} email - The user's unique email address.
 * @property {string} password - The user's password.
 * @property {Date} createdAt - The date when the user was created.
 * @property {Date} updatedAt - The date when the user was last updated.
 */

/**
 * Schema for the User model.
 *
 * @type {mongoose.Schema<User>}
 */
const userSchema = new mongoose.Schema(
  {
    /**
     * The user's name.
     * @type {string}
     * @required
     */
    name: {
      type: String,
      trim: true,
      required: true
    },

    /**
     * The user's unique email address.
     * @type {string}
     * @required
     * @unique
     */
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true
    },

    /**
     * The user's password.
     * @type {string}
     * @required
     */
    password: {
      type: String,
      trim: true,
      required: true
    }
  },
  {
    /**
     * Schema options.
     * @type {Object}
     * @property {boolean} timestamps - Adds createdAt and updatedAt fields.
     */
    timestamps: true
  }
);

/**
 * Model for the User.
 *
 * @type {mongoose.Model<User>}
 */
module.exports = mongoose.model("User", userSchema);
