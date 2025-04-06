// controllers/searchHistoryController.js
const SearchHistory = require('../models/History');

// Get all search history
exports.getAllHistory = async (req, res) => {
  try {
    const history = await SearchHistory.find().sort({ lastSearched: -1 });
    res.json(history);
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ error: 'Failed to fetch search history' });
  }
};

// Save or update search history
exports.saveSearchHistory = async (req, res) => {
  try {
    const { name, lat, lon } = req.body;
    
    if (!name || !lat || !lon) {
      return res.status(400).json({ error: 'Name, latitude and longitude are required' });
    }
    
    // Check if the location already exists in history
    let searchRecord = await SearchHistory.findOne({ 
      name: name,
      lat: lat,
      lon: lon
    });
    
    if (searchRecord) {
      // Update the existing record
      searchRecord.lastSearched = new Date();
      searchRecord.searchCount += 1;
      await searchRecord.save();
    } else {
      // Create a new record
      searchRecord = new SearchHistory({
        name,
        lat,
        lon
      });
      await searchRecord.save();
    }
    
    res.status(201).json(searchRecord);
  } catch (error) {
    console.error('Error saving search history:', error);
    res.status(500).json({ error: 'Failed to save search history' });
  }
};

// Delete a search history record
exports.deleteHistoryRecord = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedRecord = await SearchHistory.findByIdAndDelete(id);
    
    if (!deletedRecord) {
      return res.status(404).json({ error: 'Search record not found' });
    }
    
    res.json({ message: 'Search record deleted successfully' });
  } catch (error) {
    console.error('Error deleting search record:', error);
    res.status(500).json({ error: 'Failed to delete search record' });
  }
};