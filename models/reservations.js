const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    catwayNumber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Catway",
      required: true
    },
    clientName: { 
      type: String,
      required: true
    },
    boatName: { 
      type: String, 
      required: true 
    },
    checkIn: {
      type: Date, 
      required: true 
    },
    checkOut: {
      type: Date, 
      required: true 
    } 
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Reservation", reservationSchema);
