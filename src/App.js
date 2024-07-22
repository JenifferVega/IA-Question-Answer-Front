// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './components/pages/Home';
import Services from './components/pages/Services';
import Products from './components/pages/Products';
import SignUp from './components/pages/SignUp';
import Dashboard from './components/pages/Dashboard';
import MainContent from './components/MainContent';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <div className="app-layout">
              <Sidebar />
              <div className="main-layout">
                <Header />
                <MainContent>
                  <Dashboard />
                </MainContent>
              </div>
            </div>
          }
        />
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/products" element={<Products />} />
                <Route path="/sign-up" element={<SignUp />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
