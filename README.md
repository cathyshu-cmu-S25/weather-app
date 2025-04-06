# Weather App

A full-stack weather application that allows users to search for current weather conditions and forecasts for different locations, save search history, and export data.

## Features

- **Current Weather Display**: View current weather conditions for any location
- **Weather Forecast**: See a multi-day forecast for the selected location
- **Geolocation Support**: Use your current location for weather data
- **Search History**: Track and revisit your past searches
- **Data Export**: Export weather information to PDF format
- **Responsive Design**: Works on mobile and desktop devices

## Technology Stack

### Frontend
- React.js
- Tailwind CSS for styling
- Axios for API requests

### Backend
- Node.js
- Express.js for API routing
- MongoDB for data storage
- PDFKit for PDF generation

## Project MVC Structure

The application follows the MVC pattern:

- **Models**: Define the data structure and interact with the database
- Location.js
- Weather.js
- History.js

- **Views**: The React frontend components

- **Controllers**: Handle the business logic
- weatherController.js
- searchHistoryController.js
- exportController.js

## Future Improvements

Potential enhancements for the future:
- User authentication
- Favorite locations
- More export formats (CSV, JSON)
- Customizable dashboards

## Setup and Installation

### Prerequisites
- Node.js (v12 or higher)
- MongoDB
- npm

### Backend Setup
1. Navigate to the backend directory:

```
cd backend
```

2. Install dependencies:

```
npm install
```

3. Run the backend server:

```
npm start
```

### Frontend Setup
1. Navigate to the frontend directory:

```
cd frontend
```

2. Install dependencies:

```
npm install
```

3. Start the development server:

```
npm run start
```
4. The application will open in your browser at `http://localhost:3000`

## API Endpoints

### Weather Routes
- `GET /api/weather/coordinates` - Get weather by latitude and longitude
- `GET /api/weather/location` - Get weather by location name
- `GET /api/weather/forecast` - Get weather forecast

### History Routes
- `GET /api/history` - Get search history
- `POST /api/history` - Save a location to search history
- `DELETE /api/history/:id` - Delete a search history entry

### Export Routes
- `GET /api/export/weather/pdf` - Export weather data to PDF
- `GET /api/export/history/pdf` - Export search history to PDF