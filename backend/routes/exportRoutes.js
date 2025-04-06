const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const cors = require('cors');

router.use(cors());

router.get('/weather/pdf', exportController.exportWeatherToPDF);

router.get('/history/pdf', exportController.exportSearchHistoryToPDF);

module.exports = router;