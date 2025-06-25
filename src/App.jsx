/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DashboardTeacher from './components/teachers/DashboardTeacher';
import ProtectedRoute from './components/ProtectedRoute'; // Kita akan gunakan ini
import MaterialsTeacher from './components/teachers/MaterialsTeacher';
import { account } from './appwrite';

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Hook untuk navigasi

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await account.get();
        setLoggedInUser(user);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setLoggedInUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const handleLoginSuccess = (user) => {
    setLoggedInUser(user);
    navigate('/dashboard'); // Arahkan ke dashboard setelah login berhasil
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      setLoggedInUser(null);
      navigate('/login'); // Arahkan ke halaman login setelah logout
    } catch (error) {
      console.error('Gagal melakukan logout:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='bg-white'>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={loggedInUser}>
              <DashboardTeacher user={loggedInUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          {/* Rute untuk /dashboard/materials sekarang menjadi anak dari /dashboard */}
          {/* URL lengkapnya adalah /dashboard/materials */}
          <Route path="materials" element={<MaterialsTeacher />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
