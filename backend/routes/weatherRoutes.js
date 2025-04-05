// backend/routes/weather.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
const WeatherRecord = require('../models/Weather');
const Location = require('../models/Location');

// Get current weather by coordinates
router.get('/coordinates', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const response = await axios.get(
      `https://api.weatherapi.com/v1/current.json`,
      {
        params: {
          key: process.env.WEATHER_API_KEY,
          q: `${lat},${lon}`,
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather by coordinates:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Get current weather by location name
router.get('/location', async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ error: 'Location name is required' });
    }
    
    const response = await axios.get(
      `https://api.weatherapi.com/v1/current.json`,
      {
        params: {
          key: process.env.WEATHER_API_KEY,
          q: name,
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather by location name:', error);
    
    if (error.response && error.response.status === 400) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Get forecast by coordinates
router.get('/forecast', async (req, res) => {
  try {
    const { lat, lon, name, days = 5 } = req.query;
    let query;

    if (lat && lon) {
      query = `${lat},${lon}`;
    } else if (name) {
      query = name;
    } else {
      return res.status(400).json({ error: 'Either coordinates or location name is required' });
    }
    
    const response = await axios.get(
      `https://api.weatherapi.com/v1/forecast.json`,
      {
        params: {
          key: process.env.WEATHER_API_KEY,
          q: query,
          days: days,
          aqi: 'yes',
          alerts: 'yes'
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching forecast:', error);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

// Save weather record
router.post('/record', async (req, res) => {
  try {
    const { locationId, temperature, humidity, pressure, windSpeed, description, icon } = req.body;
    
    if (!locationId || !temperature) {
      return res.status(400).json({ error: 'LocationId and temperature are required' });
    }
    
    const weatherRecord = new WeatherRecord({
      locationId,
      date: new Date(),
      temperature,
      humidity,
      pressure,
      windSpeed,
      description,
      icon
    });
    
    await weatherRecord.save();
    
    res.status(201).json(weatherRecord);
  } catch (error) {
    console.error('Error saving weather record:', error);
    res.status(500).json({ error: 'Failed to save weather record' });
  }
});

// Get all weather records for a location
router.get('/records/:locationId', async (req, res) => {
  try {
    const { locationId } = req.params;
    
    const records = await WeatherRecord.find({ locationId }).sort({ date: -1 });
    
    res.json(records);
  } catch (error) {
    console.error('Error fetching weather records:', error);
    res.status(500).json({ error: 'Failed to fetch weather records' });
  }
});

// Update a weather record
router.put('/records/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { temperature, humidity, pressure, windSpeed, description, icon } = req.body;
    
    const updatedRecord = await WeatherRecord.findByIdAndUpdate(
      id,
      {
        temperature,
        humidity,
        pressure,
        windSpeed,
        description,
        icon
      },
      { new: true }
    );
    
    if (!updatedRecord) {
      return res.status(404).json({ error: 'Weather record not found' });
    }
    
    res.json(updatedRecord);
  } catch (error) {
    console.error('Error updating weather record:', error);
    res.status(500).json({ error: 'Failed to update weather record' });
  }
});

// Delete a weather record
router.delete('/records/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedRecord = await WeatherRecord.findByIdAndDelete(id);
    
    if (!deletedRecord) {
      return res.status(404).json({ error: 'Weather record not found' });
    }
    
    res.json({ message: 'Weather record deleted successfully' });
  } catch (error) {
    console.error('Error deleting weather record:', error);
    res.status(500).json({ error: 'Failed to delete weather record' });
  }
});

module.exports = router;