import React from 'react';

const ForecastDisplay = ({ forecastData }) => {
  if (!forecastData || !forecastData.forecast || !forecastData.forecast.forecastday) return null;

  // Function to get a more readable day name
  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Format the date as day name
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
      <div className="p-4 bg-indigo-500 text-white">
        <h2 className="text-xl font-bold">5-Day Forecast</h2>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 divide-y divide-gray-200">
          {forecastData.forecast.forecastday.map((day) => (
            <div key={day.date} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="w-28">
                    <p className="font-bold text-purple-700">{getDayName(day.date)}</p>
                    <p className="text-xs text-gray-500">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                  
                  <div className="flex items-center mt-1 sm:mt-0">
                    <img 
                      src={day.day.condition.icon} 
                      alt={day.day.condition.text}
                      className="w-10 h-10" 
                    />
                    <span className="text-sm ml-1 w-24 sm:w-32">{day.day.condition.text}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="font-bold">{Math.round(day.day.maxtemp_c)}°C</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{Math.round(day.day.mintemp_c)}°C</span>
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col text-sm text-gray-600 ml-4">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{Math.round(day.day.daily_chance_of_rain)}% rain</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span>{Math.round(day.day.avghumidity)}% humidity</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional details row that's hidden on small screens */}
              <div className="mt-2 grid grid-cols-3 gap-2 sm:hidden">
                <div className="bg-gray-50 p-1 rounded text-xs text-center">
                  <p className="text-gray-500">Rain</p>
                  <p>{Math.round(day.day.daily_chance_of_rain)}%</p>
                </div>
                <div className="bg-gray-50 p-1 rounded text-xs text-center">
                  <p className="text-gray-500">Humidity</p>
                  <p>{Math.round(day.day.avghumidity)}%</p>
                </div>
                <div className="bg-gray-50 p-1 rounded text-xs text-center">
                  <p className="text-gray-500">Wind</p>
                  <p>{Math.round(day.day.maxwind_kph)} km/h</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForecastDisplay;