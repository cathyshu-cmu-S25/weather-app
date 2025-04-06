const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const debugRoutes = (router) => {
  if (!router.stack) return;
  
  console.log('Debug Routes:');
  router.stack.forEach((layer) => {
    if (layer.route) {
      const path = layer.route.path;
      const methods = Object.keys(layer.route.methods).join(', ');
      console.log(`Route: ${path}, Methods: ${methods}`);
    } else if (layer.name === 'router' && layer.handle.stack) {
      console.log(`Router middleware:`);
      debugRoutes(layer.handle);
    }
  });
};


const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://weather-app-1-gewr.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/weather-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Import routes
const weatherRoutes = require('./routes/weatherRoutes');
const exportRoutes = require('./routes/exportRoutes');
const historyRoutes = require('./routes/searchHistoryRoutes');

// Use routes
app.use('/api/weather', weatherRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/history', historyRoutes);

app.get('/', (req, res) => { 
  res.send('API is running...');
}
);

// Serve static files from the React app if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
  });
}

app.listen(3001, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});