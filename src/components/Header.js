// src/components/Header.js
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './Header.css'; // Create a CSS file for styling

const Header = () => {
  return (
    <div className="header">
      <div>My Dashboard</div>
      <div className="header-right">
        <FaUserCircle size={24} />
        <button className="logout-button">Logout</button>
      </div>
    </div>
  );
};

export default Header;
