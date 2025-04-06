// Frontend: App.js
import React, { useState, useEffect } from 'react';
import './index.css';

import Header from './components/Header';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import ErrorMessage from './components/ErrorMessage';
import WeatherDisplay from './components/WeatherDisplay';
import ForecastDisplay from './components/ForecastDisplay';
import SearchHistory from './components/WeatherHistory';
import ExportOptions from './components/ExportOptions';

import { getWeatherByCoords, getWeatherByLocation } from './services/weatherService';
function App() {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('current');
  
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
      console.log("Weather API response:", data);
      setWeather(data);
      setLocation(locationName);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  const handleSelectSavedLocation = (weatherData, locationName) => {
    setWeather(weatherData);
    setLocation(locationName);
    setActiveTab('current'); // Switch to current tab to show the loaded weather
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-indigo-300 flex flex-col items-center p-4">
      <Header />
      
      <main className="w-full max-w-md">
        <div className="flex mb-4">
          <button
            className={`flex-1 p-2 ${activeTab === 'current' ? 'bg-indigo-500 text-white' : 'bg-white text-indigo-500'} rounded-l-md font-medium`}
            onClick={() => setActiveTab('current')}
          >
            Current Weather
          </button>
          <button
            className={`flex-1 p-2 ${activeTab === 'history' ? 'bg-indigo-500 text-white' : 'bg-white text-indigo-500'} rounded-r-md font-medium`}
            onClick={() => setActiveTab('history')}
          >
            Search History
          </button>
        </div>
        
        {activeTab === 'current' && (
          <>
            <SearchBar 
              onSearch={fetchWeatherByLocation}
              onGetCurrentLocation={getUserLocation}
              isLoading={loading}
            />
            
            <ErrorMessage message={error} />
            
            {weather && !error && (
              <>
                <WeatherDisplay weatherData={weather} />
                <ForecastDisplay forecastData={weather} />
                <ExportOptions 
                  locationName={weather.location.name} 
                  locationId={weather.location.id} // If your API provides this
                />
              </>
            )}
          </>
        )}
        
        {activeTab === 'history' && (
          <SearchHistory onSelectLocation={handleSelectSavedLocation} />
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;