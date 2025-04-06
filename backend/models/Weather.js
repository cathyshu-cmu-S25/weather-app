const mongoose = require('mongoose');

const weatherRecordSchema = new mongoose.Schema({
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  temperature: {
    type: Number,
    required: true
  },
  humidity: {
    type: Number
  },
  pressure: {
    type: Number
  },
  windSpeed: {
    type: Number
  },
  description: {
    type: String
  },
  icon: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add an index for faster queries by locationId
weatherRecordSchema.index({ locationId: 1, date: -1 });

module.exports = mongoose.model('WeatherRecord', weatherRecordSchema);