// Frontend: App.js
import React, { useState, useEffect } from 'react';
import './index.css';

import Header from './components/Header';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import ErrorMessage from './components/ErrorMessage';
import WeatherDisplay from './components/WeatherDisplay';

import { getWeatherByCoords, getWeatherByLocation } from './services/weatherService';
function App() {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get current location on initial load
  useEffect(() => {
    getUserLocation();
  }, []);
  
  const getUserLocation = () => {
    setLoading(true);
    setError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Unable to get your current location. Please enter a location manually.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  };
  
  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      const data = await getWeatherByCoords(lat, lon);
      setWeather(data);
      setLocation(data.location.name);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  const fetchWeatherByLocation = async (locationName) => {
    try {
      setLoading(true);
      const data = await getWeatherByLocation(locationName);
      setWeather(data);
      setLocation(locationName);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center p-4">
      <Header />
      
      <main className="w-full max-w-md">
        <SearchBar 
          onSearch={fetchWeatherByLocation}
          onGetCurrentLocation={getUserLocation}
          isLoading={loading}
        />
        
        <ErrorMessage message={error} />
        
        {weather && !error && (
          <WeatherDisplay weatherData={weather} />
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;