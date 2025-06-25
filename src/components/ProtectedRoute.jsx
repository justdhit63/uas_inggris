import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    // Jika tidak ada user yang login, arahkan ke halaman login
    return <Navigate to="/login" replace />;
  }

  // Jika ada user, tampilkan komponen anak (misalnya, DashboardTeacher)
  return children;
};

export default ProtectedRoute;