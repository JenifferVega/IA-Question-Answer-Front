import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './contexts/authContext';
import { DocumentProvider } from './contexts/documentContext';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <DocumentProvider>
        <App />
      </DocumentProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
