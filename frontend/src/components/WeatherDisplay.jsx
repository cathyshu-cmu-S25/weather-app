import React from 'react';

const WeatherDisplay = ({ weatherData }) => {
  if (!weatherData) return null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-blue-600 text-white">
        <h2 className="text-xl font-bold">{weatherData.location.name}, {weatherData.location.country}</h2>
        <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-center">
          <img 
            src={weatherData.current.condition.icon} 
            alt={weatherData.current.condition.text} 
          />
          <div className="text-center">
            <h3 className="text-4xl font-bold">{Math.round(weatherData.current.temp_c)}°C</h3>
            <p className="capitalize">{weatherData.current.condition.text}</p>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="bg-gray-100 p-2 rounded-md">
            <p className="text-gray-600">Feels Like</p>
            <p className="font-bold">{Math.round(weatherData.current.feelslike_c)}°C</p>
          </div>
          <div className="bg-gray-100 p-2 rounded-md">
            <p className="text-gray-600">Humidity</p>
            <p className="font-bold">{weatherData.current.humidity}%</p>
          </div>
          <div className="bg-gray-100 p-2 rounded-md">
            <p className="text-gray-600">Wind</p>
            <p className="font-bold">{weatherData.current.wind_kph} km/h</p>
          </div>
          <div className="bg-gray-100 p-2 rounded-md">
            <p className="text-gray-600">Pressure</p>
            <p className="font-bold">{weatherData.current.pressure_mb} hPa</p>
          </div>
        </div>

        {/* Additional Weather Information */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="bg-gray-100 p-2 rounded-md">
            <p className="text-gray-600">UV Index</p>
            <p className="font-bold">{weatherData.current.uv}</p>
          </div>
          <div className="bg-gray-100 p-2 rounded-md">
            <p className="text-gray-600">Visibility</p>
            <p className="font-bold">{weatherData.current.vis_km} km</p>
          </div>
          {weatherData.current.air_quality && (
            <>
              <div className="bg-gray-100 p-2 rounded-md">
                <p className="text-gray-600">Air Quality (CO)</p>
                <p className="font-bold">{weatherData.current.air_quality.co.toFixed(1)}</p>
              </div>
              <div className="bg-gray-100 p-2 rounded-md">
                <p className="text-gray-600">Air Quality (PM2.5)</p>
                <p className="font-bold">{weatherData.current.air_quality.pm2_5.toFixed(1)}</p>
              </div>
            </>
          )}
        </div>

        {/* Location Details */}
        <div className="mt-4 bg-gray-100 p-3 rounded-md">
          <p className="text-gray-600">Location: {weatherData.location.name}, {weatherData.location.region}, {weatherData.location.country}</p>
          <p className="text-gray-600">Local Time: {weatherData.location.localtime}</p>
          <p className="text-gray-600">Coordinates: {weatherData.location.lat}, {weatherData.location.lon}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;