import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-20 text-center font-light text-gray-400">Inizializzazione sessione...</div>;
  if (!user) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
