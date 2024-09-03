import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaCopy } from 'react-icons/fa';
import axios from 'axios';
import './Sidebar.css';
import { DocumentContext } from '../contexts/documentContext';
import { useAuth } from "contexts/authContext";
import { auth } from "components/firebase/firebase";

const backend_url = "http://127.0.0.1:5000"; // Replace with your backend URL

const Sidebar = () => {
  const { documents, clearResetDashboard, setDocuments, setHtmlContent } = useContext(DocumentContext);

  const fetchHtmlContent = async (doc) => {
    try {
      const token = await auth.currentUser.getIdToken(true);
      const response = await axios.get(`${backend_url}/get-html-content`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        params: {
          folder_name: doc,
        },
      });

      console.log("HTML Content:", response.data.html_content);
      setHtmlContent(response.data.html_content);
      // Handle the HTML content (e.g., display it in the UI or store it in context)
    } catch (error) {
      console.error("Error fetching HTML content:", error);
    }
  };

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const token = await auth.currentUser.getIdToken(true);
        const response = await fetchDocuments(token);
        setDocuments(response.data.documents);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        //setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  const fetchDocuments = async (token) => {
    return await axios.get(`${backend_url}/user-documents`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  };

  return (
    <div className="sidebar">
      <Link to="#">
        <FaTachometerAlt /> Your Documents
      </Link>
      {documents.map((doc, index) => (
        <Link key={index} to="#" onClick={() => fetchHtmlContent(doc)}>
          <FaCopy /> {doc}
        </Link>
      ))}
      {documents.length > 0 ? (
        <button className="add-document-btn" onClick={clearResetDashboard}>
          Add New Document
        </button>
      ) : null}
    </div>
  );
};

export default Sidebar;
