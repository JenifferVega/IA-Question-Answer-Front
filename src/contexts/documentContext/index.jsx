import React, { createContext, useState } from 'react';

export const DocumentContext = createContext();

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [htmlContent, setHtmlContent] = useState('');
  const [resetDashboard, setResetDashboard] = useState(false);

  const addDocument = (newDocument) => {
    setDocuments((prevDocuments) => [...prevDocuments, newDocument]);
  };

  const clearResetDashboard = () => {
    setResetDashboard(true);
    setHtmlContent('');
    setTimeout(() => {
      setResetDashboard(false);
    }, 1000)
  };

  return (
    <DocumentContext.Provider value={{ documents, addDocument, resetDashboard, clearResetDashboard, setDocuments, htmlContent, setHtmlContent }}>
      {children}
    </DocumentContext.Provider>
  );
};
