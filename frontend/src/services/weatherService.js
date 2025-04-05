export const getWeatherByCoords = async (lat, lon) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/weather/coordinates?lat=${lat}&lon=${lon}`,
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
    
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const getWeatherByLocation = async (locationName) => {
  const response = await fetch(
    `http://localhost:3001/api/weather/location?name=${locationName}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Location not found');
  }
  
  return await response.json();
};