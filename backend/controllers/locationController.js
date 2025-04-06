const Location = require('../models/Location');
const WeatherRecord = require('../models/Weather');

// Get all locations
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
};

// Create a new location
exports.createLocation = async (req, res) => {
  try {
    const { name, lat, lon } = req.body;
    
    if (!name || !lat || !lon) {
      return res.status(400).json({ error: 'Name, latitude and longitude are required' });
    }
    
    // Check if location already exists
    const existingLocation = await Location.findOne({ name, lat, lon });
    if (existingLocation) {
      return res.status(409).json({ error: 'Location already exists', location: existingLocation });
    }
    
    const location = new Location({ name, lat, lon });
    await location.save();
    
    res.status(201).json(location);
  } catch (error) {
    console.error('Error saving location:', error);
    res.status(500).json({ error: 'Failed to save location' });
  }
};

// Get location by ID
exports.getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const location = await Location.findById(id);
    
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    res.json(location);
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
};

// Update a location
exports.updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, lat, lon } = req.body;
    
    if (!name || !lat || !lon) {
      return res.status(400).json({ error: 'Name, latitude and longitude are required' });
    }
    
    const updatedLocation = await Location.findByIdAndUpdate(
      id,
      { name, lat, lon },
      { new: true }
    );
    
    if (!updatedLocation) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    res.json(updatedLocation);
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
};

// Delete a location
exports.deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First, delete all weather records associated with this location
    await WeatherRecord.deleteMany({ locationId: id });
    
    // Then delete the location
    const deletedLocation = await Location.findByIdAndDelete(id);
    
    if (!deletedLocation) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    res.json({ message: 'Location and associated weather records deleted successfully' });
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({ error: 'Failed to delete location' });
  }
};