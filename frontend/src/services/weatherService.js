export const getWeatherByCoords = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://weather-app-a0n2.onrender.com/api/weather/coordinates?lat=${lat}&lon=${lon}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error('Weather data not available');
    }

    const currentData = await response.json();

    const forecastResponse = await fetch(
      `https://weather-app-a0n2.onrender.com/api/weather/forecast?lat=${lat}&lon=${lon}&days=5`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!forecastResponse.ok) {
      console.error('Forecast data not available, continuing with current data only');
      return currentData;
    }
    
    const forecastData = await forecastResponse.json();
    
    const combinedData = {
      ...currentData,
      forecast: forecastData.forecast
    };
    
    console.log('Combined weather data:', combinedData);
    return combinedData;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const getWeatherByLocation = async (locationName) => {
  try {
    const currentResponse = await fetch(
      `https://weather-app-a0n2.onrender.com/api/weather/location?name=${encodeURIComponent(locationName)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!currentResponse.ok) {
      const errorText = await currentResponse.text();
      console.error('Error response:', errorText);
      throw new Error('Location not found');
    }
    
    const currentData = await currentResponse.json();
    
    // get forecast data
    const forecastResponse = await fetch(
      `https://weather-app-a0n2.onrender.com/api/weather/forecast?name=${encodeURIComponent(locationName)}&days=5`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!forecastResponse.ok) {
      console.error('Forecast data not available, continuing with current data only');
      return currentData;
    }
    
    const forecastData = await forecastResponse.json();
    
    // Combine current and forecast data
    const combinedData = {
      ...currentData,
      forecast: forecastData.forecast
    };
    
    console.log('Combined weather data:', combinedData);
    return combinedData;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// Get search history
export const getSearchHistory = async () => {
  try {
    const response = await fetch(
      `https://weather-app-a0n2.onrender.com/api/history`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch search history');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch search history error:', error);
    throw error;
  }
};

// Delete a search record
export const deleteSearchRecord = async (recordId) => {
  try {
    const response = await fetch(
      `https://weather-app-a0n2.onrender.com/api/history/${recordId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to delete search record');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Delete search record error:', error);
    throw error;
  }
};

// Fetch weather for a saved location
export const fetchWeatherForSavedLocation = async (location) => {
  return await getWeatherByCoords(location.lat, location.lon);
};