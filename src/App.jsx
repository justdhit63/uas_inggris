/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import Hero from './components/Hero'
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/students/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
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

  return (
    <div className='bg-white'>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route
          path="/dashboard"
          element={
              <Dashboard/>
          }
        />
      </Routes>
    </div>
  )
}

export default App
