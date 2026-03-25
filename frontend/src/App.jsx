import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importiamo le pagine
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage'; // Assicurati che questo file esista e sia corretto
import DashboardPage from './pages/DashboardPage';

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
