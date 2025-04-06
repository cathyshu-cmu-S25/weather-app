// controllers/weatherController.js
const axios = require('axios');
const WeatherRecord = require('../models/Weather');

const API_KEY = process.env.OPENWEATHER_API_KEY;
const API_BASE_URL = 'https://api.weatherapi.com/v1';

// Helper function to make weather API requests
async function makeWeatherApiRequest(endpoint, params) {
  try {
    const response = await axios.get(`${API_BASE_URL}/${endpoint}`, {
      params: {
        key: API_KEY,
        ...params
      }
    });

    console.log('API Response status:', response.status);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error.response?.data || error.message);
    if (error.response?.status === 400) {
      throw { status: 404, message: 'Location not found' };
    }
    throw { status: 500, message: 'Failed to fetch weather data' };
  }
}

// Helper function to save to search history
async function saveToSearchHistory(name, lat, lon) {
  try {
    // Call the history API to save the search
    await axios.post('http://localhost:3001/api/history', {
      name, 
      lat, 
      lon
    });
  } catch (error) {
    console.error('Error saving to search history:', error);
    // Continue even if saving to history fails
  }
}

// Get current weather by coordinates
exports.getWeatherByCoordinates = async (req, res) => {
  try {
    console.log('Request received at /coordinates with params:', req.query);
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      console.log('Missing lat or lon parameters');
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    console.log('Fetching weather data for coordinates:', lat, lon);
    const data = await makeWeatherApiRequest('current.json', { q: `${lat},${lon}` });
    
    console.log('Weather data received:', data);
    // Save to search history
    saveToSearchHistory(data.location.name, lat, lon).catch(error => {
      console.error('Error saving to search history:', error);
    });

    res.json(data);
  } catch (error) {
    console.error('Error in /coordinates endpoint:', error);
    res.status(error.status || 500).json({ error: error.message });
  }
};

// Get current weather by location name
exports.getWeatherByLocation = async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({ error: 'Location name is required' });
    }
    
    const data = await makeWeatherApiRequest('current.json', { q: name });
    saveToSearchHistory(data.location.name, data.location.lat, data.location.lon).catch(error => {
      console.error('Error saving to search history:', error);
    });
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

// Get forecast by coordinates or location name
exports.getForecast = async (req, res) => {
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
    
    const data = await makeWeatherApiRequest('forecast.json', { 
      q: query, 
      days: days, 
      aqi: 'yes', 
      alerts: 'yes' 
    });
    
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

// Save weather record
exports.saveWeatherRecord = async (req, res) => {
  try {
    const { locationId, temperature, humidity, pressure, windSpeed, description, icon } = req.body;
    
    if (!locationId || temperature === undefined) {
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
};

// Get all weather records for a location
exports.getWeatherRecords = async (req, res) => {
  try {
    const { locationId } = req.params;
    
    const records = await WeatherRecord.find({ locationId }).sort({ date: -1 });
    
    res.json(records);
  } catch (error) {
    console.error('Error fetching weather records:', error);
    res.status(500).json({ error: 'Failed to fetch weather records' });
  }
};

// Update a weather record
exports.updateWeatherRecord = async (req, res) => {
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
};

// Delete a weather record
exports.deleteWeatherRecord = async (req, res) => {
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
};