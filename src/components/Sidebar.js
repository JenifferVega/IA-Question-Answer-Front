import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaCopy } from 'react-icons/fa';
import './Sidebar.css';
import { DocumentContext } from '../contexts/documentContext';

const Sidebar = () => {
  const { documents, clearResetDashboard } = useContext(DocumentContext);
  return (
    <div className="sidebar">
      <Link to="#">
        <FaTachometerAlt /> Your Documents
      </Link>
      {documents.map((doc, index) => (
        <Link key={index} to="#">
          <FaCopy /> {doc}
        </Link>
      ))}
      {documents.length > 0 ? <button className="add-document-btn" onClick={clearResetDashboard}>
        Add New Document
      </button> : <></>}
    </div>
  );
};

export default Sidebar;
