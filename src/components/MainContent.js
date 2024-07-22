// src/components/MainContent.js
import React from 'react';
import './MainContent.css'; // Create a CSS file for styling

const MainContent = ({ children }) => {
  return (
    <div className="main-content">
      {children}
    </div>
  );
};

export default MainContent;
