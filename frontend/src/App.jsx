import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importiamo le pagine
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

// Importiamo i servizi
import { getNotizie } from './services/api';

function App() {

  return (
    <Router>
      <Routes>
        {/* Rotta Principale (Home) */}
        <Route path="/" element={<HomePage />} />

        {/* Rotta Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rotta Dashboard (Protetta in futuro) */}
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
