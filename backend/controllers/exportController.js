// controllers/exportController.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const WeatherRecord = require('../models/Weather');
const SearchHistory = require('../models/History');
const Location = require('../models/Location');

/**
 * Export all weather data for a location to PDF
 */
exports.exportWeatherToPDF = async (req, res) => {
  try {
    const { locationId, locationName } = req.query;
    
    if (!locationId && !locationName) {
      return res.status(400).json({ error: 'Either locationId or locationName is required' });
    }
    
    // Get weather records
    let weatherRecords;
    let locationInfo;
    
    if (locationId) {
      weatherRecords = await WeatherRecord.find({ locationId }).sort({ date: -1 });
      locationInfo = await Location.findById(locationId);
    } else {
      // Find location by name
      locationInfo = await Location.findOne({ 
        name: { $regex: new RegExp(locationName, 'i') } 
      });
      
      if (locationInfo) {
        weatherRecords = await WeatherRecord.find({ locationId: locationInfo._id }).sort({ date: -1 });
      } else {
        // If location not found, try search history
        const searchHistoryEntry = await SearchHistory.findOne({
          name: { $regex: new RegExp(locationName, 'i') }
        }).sort({ lastSearched: -1 });
        
        if (!searchHistoryEntry) {
          return res.status(404).json({ error: 'Location not found' });
        }
        
        locationInfo = {
          name: searchHistoryEntry.name,
          lat: searchHistoryEntry.lat,
          lon: searchHistoryEntry.lon
        };
        
        // For search history, we might not have weather records stored
        weatherRecords = [];
      }
    }
    
    // Create a PDF document
    const doc = new PDFDocument();
    const filename = `weather_report_${locationInfo.name.replace(/\s+/g, '_')}.pdf`;
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    
    // Pipe the PDF to the response
    doc.pipe(res);
    
    // Add content to PDF
    doc.fontSize(20).text(`Weather Report for ${locationInfo.name}`, {
      align: 'center'
    });
    
    doc.moveDown();
    doc.fontSize(12).text(`Location: ${locationInfo.name}`);
    doc.fontSize(12).text(`Coordinates: ${locationInfo.lat}, ${locationInfo.lon}`);
    doc.fontSize(12).text(`Report Generated: ${new Date().toLocaleString()}`);
    
    doc.moveDown();
    
    // Add search history if available
    const searchHistory = await SearchHistory.find({
      name: locationInfo.name
    }).sort({ lastSearched: -1 }).limit(5);
    
    if (searchHistory && searchHistory.length > 0) {
      doc.fontSize(16).text('Search History', { underline: true });
      doc.moveDown(0.5);
      
      searchHistory.forEach((record, index) => {
        doc.fontSize(12).text(`${index + 1}. Last Searched: ${new Date(record.lastSearched).toLocaleString()}`);
        doc.fontSize(12).text(`   Search Count: ${record.searchCount || 1}`);
        doc.moveDown(0.5);
      });
      
      doc.moveDown();
    }
    
    // Add weather records if available
    if (weatherRecords && weatherRecords.length > 0) {
      doc.fontSize(16).text('Weather Records', { underline: true });
      doc.moveDown(0.5);
      
      weatherRecords.forEach((record, index) => {
        doc.fontSize(12).text(`Record ${index + 1} - ${new Date(record.date).toLocaleString()}`);
        doc.fontSize(12).text(`Temperature: ${record.temperature}°C`);
        if (record.humidity) doc.fontSize(12).text(`Humidity: ${record.humidity}%`);
        if (record.pressure) doc.fontSize(12).text(`Pressure: ${record.pressure} hPa`);
        if (record.windSpeed) doc.fontSize(12).text(`Wind Speed: ${record.windSpeed} km/h`);
        if (record.description) doc.fontSize(12).text(`Description: ${record.description}`);
        doc.moveDown();
      });
    } else {
      doc.fontSize(12).text('No weather records available for this location.');
    }
    
    // Finalize the PDF and end the stream
    doc.end();
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};

/**
 * Export search history to PDF
 */
exports.exportSearchHistoryToPDF = async (req, res) => {
  try {
    // Get all search history
    const searchHistory = await SearchHistory.find().sort({ lastSearched: -1 });
    
    // Create a PDF document
    const doc = new PDFDocument();
    const filename = 'search_history_report.pdf';
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    
    // Pipe the PDF to the response
    doc.pipe(res);
    
    // Add content to PDF
    doc.fontSize(20).text('Search History Report', {
      align: 'center'
    });
    
    doc.moveDown();
    doc.fontSize(12).text(`Report Generated: ${new Date().toLocaleString()}`);
    doc.fontSize(12).text(`Total Searches: ${searchHistory.length}`);
    
    doc.moveDown();
    
    if (searchHistory.length > 0) {
      // Create a table-like structure
      doc.fontSize(14).text('Search Records', { underline: true });
      doc.moveDown(0.5);
      
      searchHistory.forEach((record, index) => {
        doc.fontSize(12).text(`${index + 1}. Location: ${record.name}`);
        doc.fontSize(10).text(`   Coordinates: ${record.lat}, ${record.lon}`);
        doc.fontSize(10).text(`   Last Searched: ${new Date(record.lastSearched).toLocaleString()}`);
        doc.fontSize(10).text(`   Search Count: ${record.searchCount || 1}`);
        doc.moveDown(0.5);
      });
    } else {
      doc.fontSize(12).text('No search history records available.');
    }
    
    // Finalize the PDF and end the stream
    doc.end();
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};