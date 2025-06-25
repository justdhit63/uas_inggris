import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    // Jika tidak ada user, arahkan ke halaman login
    return <Navigate to="/login" replace />;
  }

  // Jika ada user, tampilkan komponen yang seharusnya (children)
  return children;
};

export default ProtectedRoute;