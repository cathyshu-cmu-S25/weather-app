const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const cors = require('cors');

router.use(cors());

// Current weather routes
router.get('/coordinates', weatherController.getWeatherByCoordinates);
router.get('/location', weatherController.getWeatherByLocation);
router.get('/forecast', weatherController.getForecast);

// Weather records routes
router.post('/record', weatherController.saveWeatherRecord);
router.get('/records/:locationId', weatherController.getWeatherRecords);
router.put('/records/:id', weatherController.updateWeatherRecord);
router.delete('/records/:id', weatherController.deleteWeatherRecord);

module.exports = router;