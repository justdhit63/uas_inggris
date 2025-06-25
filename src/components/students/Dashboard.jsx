import React, { useState } from 'react';
import { account } from '../../appwrite'; // Import instance akun dari file konfigurasi
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const [condition, setCondition] = useState(null);
  const handleLogout = async () => {
    try {
      // 1. Menghubungi server Appwrite untuk menghapus sesi login saat ini
      await account.deleteSession('current');

      <Navigate to="/login" />

      console.log('sampe sini bos');
      setCondition('1');

    } catch (error) {
      console.error('Gagal melakukan logout:', error);
    }
  };

  if (condition == null) {
    return (
      <div>
        <h2>test doang</h2>
        <a onClick={handleLogout}>Logout</a>
      </div>
    )
  }

  return (
    <Navigate to="/" />
  )
}

export default Dashboard
