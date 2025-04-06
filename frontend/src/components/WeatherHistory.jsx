import React, { useState, useEffect } from 'react';
import { getSearchHistory, saveSearch, deleteSearchRecord, fetchWeatherForSavedLocation } from '../services/weatherService';

const SearchHistory = ({ onSelectLocation }) => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch search history on component mount
  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      setIsLoading(true);
      const data = await getSearchHistory();
      setHistory(data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load search history');
      setIsLoading(false);
    }
  };

  const handleDelete = async (recordId) => {
    if (window.confirm('Are you sure you want to delete this search record?')) {
      try {
        setIsLoading(true);
        await deleteSearchRecord(recordId);
        setSuccess('Record deleted successfully');
        // Refresh the history list
        loadSearchHistory();
      } catch (err) {
        setError('Failed to delete search record');
        setIsLoading(false);
      }
    }
  };

  const handleSelectLocation = async (location) => {
    try {
      setIsLoading(true);
      const weatherData = await fetchWeatherForSavedLocation(location);
      onSelectLocation(weatherData, location.name);
      setIsLoading(false);
    } catch (err) {
      setError(`Failed to load weather for ${location.name}`);
      setIsLoading(false);
    }
  };

  // Clear any success or error messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
      <div className="p-4 bg-indigo-500 text-white">
        <h2 className="text-xl font-bold">Search History</h2>
      </div>
      
      <div className="p-4">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md">
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-md">
            <p>{success}</p>
          </div>
        )}
        
        {isLoading ? (
          <p className="text-gray-500">Loading search history...</p>
        ) : history.length === 0 ? (
          <p className="text-gray-500">No search history yet. Search for locations to build your history.</p>
        ) : (
          <div className="w-full overflow-x-auto"> {/* Ensure parent container has full width */}
            <table className="min-w-full divide-y divide-gray-200 table-fixed"> {/* Use table-fixed for more controlled column widths */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">Location</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">Last Searched</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((record) => (
                  <tr key={record._id}>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{record.name}</div>
                          <div className="text-xs text-gray-500">{record.lat.toFixed(2)}, {record.lon.toFixed(2)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(record.lastSearched).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{new Date(record.lastSearched).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap flex space-x-1"> {/* Use flex with smaller spacing */}
                      <button
                        onClick={() => handleSelectLocation(record)}
                        className="px-2 py-1 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 text-xs"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDelete(record._id)}
                        className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchHistory;