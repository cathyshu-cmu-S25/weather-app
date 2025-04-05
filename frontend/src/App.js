// Frontend: App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // API key - in a real app, this would be stored in environment variables
  const API_KEY = 'YOUR_OPENWEATHER_API_KEY';
  
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
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Weather data not available');
      }
      
      const data = await response.json();
      setWeather(data);
      setLocation(data.name);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  const fetchWeatherByLocation = async (locationName) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${locationName}&units=metric&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Location not found');
      }
      
      const data = await response.json();
      setWeather(data);
      setLocation(locationName);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location.trim()) return;
    fetchWeatherByLocation(location);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center p-4">
      <header className="w-full max-w-md bg-blue-600 text-white p-4 rounded-lg shadow-lg mb-6">
        <h1 className="text-2xl font-bold text-center">Weather App</h1>
        <p className="text-center text-sm">Created by [Your Name]</p>
      </header>
      
      <main className="w-full max-w-md">
        {/* Location Input */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter city name..."
              className="p-2 border border-gray-300 rounded-md mb-2"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Get Weather'}
              </button>
              <button
                type="button"
                onClick={getUserLocation}
                className="p-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
            <p>{error}</p>
          </div>
        )}
        
        {/* Weather Display */}
        {weather && !error && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-blue-600 text-white">
              <h2 className="text-xl font-bold">{weather.name}, {weather.sys.country}</h2>
              <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-center">
                <img 
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
                  alt={weather.weather[0].description} 
                />
                <div className="text-center">
                  <h3 className="text-4xl font-bold">{Math.round(weather.main.temp)}°C</h3>
                  <p className="capitalize">{weather.weather[0].description}</p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="bg-gray-100 p-2 rounded-md">
                  <p className="text-gray-600">Feels Like</p>
                  <p className="font-bold">{Math.round(weather.main.feels_like)}°C</p>
                </div>
                <div className="bg-gray-100 p-2 rounded-md">
                  <p className="text-gray-600">Humidity</p>
                  <p className="font-bold">{weather.main.humidity}%</p>
                </div>
                <div className="bg-gray-100 p-2 rounded-md">
                  <p className="text-gray-600">Wind</p>
                  <p className="font-bold">{(weather.wind.speed * 3.6).toFixed(1)} km/h</p>
                </div>
                <div className="bg-gray-100 p-2 rounded-md">
                  <p className="text-gray-600">Pressure</p>
                  <p className="font-bold">{weather.main.pressure} hPa</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="mt-auto pt-6 text-center text-sm text-gray-600">
        <p>Weather App for PM Accelerator Technical Assessment</p>
        <p>© {new Date().getFullYear()} [Your Name] - All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default App;