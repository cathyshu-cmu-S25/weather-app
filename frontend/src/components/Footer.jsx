import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto pt-6 text-center text-sm text-gray-600">
      <p>Weather App for PM Accelerator Technical Assessment</p>
      <p>© {new Date().getFullYear()} Chang Shu - All Rights Reserved</p>
    </footer>
  );
};

export default Footer;