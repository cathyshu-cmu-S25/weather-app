const API_KEY = process.env.OPENWEATHER_API_KEY;

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