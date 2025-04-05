import React, { useState } from 'react';

const SearchBar = ({ onSearch, onGetCurrentLocation, isLoading }) => {
  const [locationInput, setLocationInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!locationInput.trim()) return;
    onSearch(locationInput);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="text"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          placeholder="Enter city name..."
          className="p-2 border border-gray-300 rounded-md mb-2"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Get Weather'}
          </button>
          <button
            type="button"
            onClick={onGetCurrentLocation}
            className="p-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;