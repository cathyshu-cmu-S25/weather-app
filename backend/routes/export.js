// routes/export.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
const { createObjectCsvStringifier } = require('csv-writer');
const PDFDocument = require('pdfkit');
const { Builder } = require('xml2js');
const fs = require('fs');

// Export weather data in various formats
router.get('/', async (req, res) => {
  try {
    const { format, location, lat, lon } = req.query;
    
    if (!format) {
      return res.status(400).json({ error: 'Format parameter is required' });
    }
    
    if (!location && (!lat || !lon)) {
      return res.status(400).json({ error: 'Location or coordinates are required' });
    }
    
    // Fetch weather data
    let weatherData;
    
    if (lat && lon) {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          lat,
          lon,
          units: 'metric',
          appid: process.env.OPENWEATHER_API_KEY
        }
      });
      weatherData = response.data;
    } else {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          q: location,
          units: 'metric',
          appid: process.env.OPENWEATHER_API_KEY
        }
      });
      weatherData = response.data;
    }
    
    // Format data for export
    const exportData = {
      location: weatherData.name,
      country: weatherData.sys.country,
      lat: weatherData.coord.lat,
      lon: weatherData.coord.lon,
      temperature: weatherData.main.temp,
      feels_like: weatherData.main.feels_like,
      humidity: weatherData.main.humidity,
      pressure: weatherData.main.pressure,
      wind_speed: weatherData.wind.speed,
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      timestamp: new Date().toISOString()
    };
    
    // Handle different formats
    switch (format.toLowerCase()) {
      case 'json':
        return res.json(exportData);
        
      case 'csv':
        const csvStringifier = createObjectCsvStringifier({
          header: Object.keys(exportData).map(key => ({ id: key, title: key }))
        });
        
        const csvHeader = csvStringifier.getHeaderString();
        const csvBody = csvStringifier.stringifyRecords([exportData]);
        const csvContent = csvHeader + csvBody;
        
        res.setHeader('Content-Disposition', `attachment; filename=${weatherData.name}_weather.csv`);
        res.setHeader('Content-Type', 'text/csv');
        return res.send(csvContent);
        
      case 'xml':
        const builder = new Builder();
        const xmlObj = {
          weather: exportData
        };
        const xml = builder.buildObject(xmlObj);
        
        res.setHeader('Content-Disposition', `attachment; filename=${weatherData.name}_weather.xml`);
        res.setHeader('Content-Type', 'application/xml');
        return res.send(xml);
        
      case 'pdf':
        const doc = new PDFDocument();
        let buffers = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          res.setHeader('Content-Disposition', `attachment; filename=${weatherData.name}_weather.pdf`);
          res.setHeader('Content-Type', 'application/pdf');
          res.send(pdfData);
        });
        
        // Write PDF content
        doc.fontSize(25).text(`Weather Report for ${exportData.location}, ${exportData.country}`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.moveDown();
        
        doc.fontSize(18).text('Current Conditions');
        doc.moveDown();
        doc.fontSize(12).text(`Temperature: ${exportData.temperature}°C`);
        doc.fontSize(12).text(`Feels Like: ${exportData.feels_like}°C`);
        doc.fontSize(12).text(`Weather: ${exportData.description}`);
        doc.fontSize(12).text(`Humidity: ${exportData.humidity}%`);
        doc.fontSize(12).text(`Pressure: ${exportData.pressure} hPa`);
        doc.fontSize(12).text(`Wind Speed: ${exportData.wind_speed} m/s`);
        doc.moveDown();
        
        doc.fontSize(18).text('Location Information');
        doc.moveDown();
        doc.fontSize(12).text(`Coordinates: ${exportData.lat}, ${exportData.lon}`);
        
        doc.end();
        return;
        
      case 'md':
        let mdContent = `# Weather Report for ${exportData.location}, ${exportData.country}\n\n`;
        mdContent += `*Generated on: ${new Date().toLocaleString()}*\n\n`;
        mdContent += `## Current Conditions\n\n`;
        mdContent += `- **Temperature:** ${exportData.temperature}°C\n`;
        mdContent += `- **Feels Like:** ${exportData.feels_like}°C\n`;
        mdContent += `- **Weather:** ${exportData.description}\n`;
        mdContent += `- **Humidity:** ${exportData.humidity}%\n`;
        mdContent += `- **Pressure:** ${exportData.pressure} hPa\n`;
        mdContent += `- **Wind Speed:** ${exportData.wind_speed} m/s\n\n`;
        mdContent += `## Location Information\n\n`;
        mdContent += `- **Coordinates:** ${exportData.lat}, ${exportData.lon}\n`;
        
        res.setHeader('Content-Disposition', `attachment; filename=${weatherData.name}_weather.md`);
        res.setHeader('Content-Type', 'text/markdown');
        return res.send(mdContent);
        
      default:
        return res.status(400).json({ error: 'Unsupported format' });
    }
  } catch (error) {
    console.error('Error exporting weather data:', error);
    res.status(500).json({ error: 'Failed to export weather data' });
  }
});

module.exports = router;