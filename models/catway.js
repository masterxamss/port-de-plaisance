const mongoose = require('mongoose');

const catwaySchema = new mongoose.Schema({
  catwayNumber: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['long', 'short'],
    required: true
  },
  catwayState: {
    type: String,
    required: true
  },
},
{
  timestamps: true     
});

module.exports = mongoose.model('Catway', catwaySchema);
