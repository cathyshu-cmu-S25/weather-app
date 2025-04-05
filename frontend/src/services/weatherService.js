const API_KEY = '26e771f9ec8f4440a1b32348250504';

export const getWeatherByCoords = async (lat, lon) => {
  const response = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=yes`
  );
  
  if (!response.ok) {
    throw new Error('Weather data not available');
  }
  
  return await response.json();
};

export const getWeatherByLocation = async (locationName) => {
  const response = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${locationName}&aqi=yes`
  );
  
  if (!response.ok) {
    throw new Error('Location not found');
  }
  
  return await response.json();
};