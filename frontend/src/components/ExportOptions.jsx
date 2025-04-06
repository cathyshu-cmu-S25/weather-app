import React from 'react';

const ExportOptions = ({ locationName, locationId }) => {
  const handleExportWeatherPDF = () => {
    const params = new URLSearchParams();
    if (locationId) params.append('locationId', locationId);
    if (locationName) params.append('locationName', locationName);
    
    // Open the PDF in a new tab
    window.open(`http://localhost:3001/api/export/weather/pdf?${params.toString()}`, '_blank');
  };

  const handleExportHistoryPDF = () => {
    window.open('http://localhost:3001/api/export/history/pdf', '_blank');
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-3">Export Options</h2>
      
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <button
          onClick={handleExportWeatherPDF}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
          disabled={!locationName}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Weather to PDF
        </button>
        
        <button
          onClick={handleExportHistoryPDF}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Search History to PDF
        </button>
      </div>
    </div>
  );
};

export default ExportOptions;