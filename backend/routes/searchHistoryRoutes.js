// Import the SearchHistory model
const express = require('express');
const router = express.Router();
const searchHistoryController = require('../controllers/searchHistoryController');
const cors = require('cors');

// Get all search history
router.use(cors());

// Get all search history
router.get('/', searchHistoryController.getAllHistory);

// Save or update search history
router.post('/', searchHistoryController.saveSearchHistory);

// Delete a search history record
router.delete('/:id', searchHistoryController.deleteHistoryRecord);

module.exports = router;