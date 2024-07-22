// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaTasks, FaClone, FaCalendarAlt, FaChartBar, FaCopy } from 'react-icons/fa';
import './Sidebar.css'; // Create a CSS file for styling

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="#">
        <FaTachometerAlt /> YOUR DOCUMENTS
      </Link>
      <Link to="#">
        <FaTasks /> WOMAN DOC.
      </Link>
      <Link to="#">
        <FaTasks /> PRODUCT DOC
      </Link>
      <Link to="#">
        <FaTasks /> LICENCE DOC
      </Link>
      <Link to="#">
        <FaTasks /> STATISTICS
      </Link>
      <Link to="#">
        <FaTasks /> STATISTICS 2
      </Link>
    </div>
  );
};

export default Sidebar;
