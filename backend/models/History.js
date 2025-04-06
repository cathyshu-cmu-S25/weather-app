// models/SearchHistory.js
const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
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
  lastSearched: { 
    type: Date, 
    default: Date.now 
  },
  searchCount: {
    type: Number,
    default: 1
  }
});

// Add an index for faster queries by name
searchHistorySchema.index({ name: 1 });

module.exports = mongoose.model('SearchHistory', searchHistorySchema);