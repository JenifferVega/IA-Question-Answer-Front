import React, { useState, useRef } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Dashboard.css";
import { useAuth } from "contexts/authContext";
import { auth } from "components/firebase/firebase";

const Dashboard = () => {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);
  const { currentUser } = useAuth();

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      console.log("Dropped file:", file);
      // Handle file upload here
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
    console.log("Selected file:", file);
    // Handle file upload here
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        {currentUser && (
          <div className="user-info">
            {/* <span>Welcome, {currentUser.displayName || currentUser.email}!</span> */}
           
          </div>
        )}
      </div>
      <div className="dashboard-content">Dashboard Content</div>
      <div className="file-name">
        {fileName && <p>Selected file: {fileName}</p>}
      </div>
      <div
        className={`search-button-container ${dragging ? "dragging" : ""}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <button className="search-button" onClick={handleButtonClick}>
          <i className="fas fa-paperclip"></i>
          <span>Send</span>
          <i className="fas fa-arrow-up"></i>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default Dashboard;
