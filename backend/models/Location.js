// models/Location.js
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  lat: { 
    type: Number, 
    required: true 
  },
  lon: { 
    type: Number, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Location', locationSchema);