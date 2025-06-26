import React from 'react';

const DashboardStudent = ({ user, onLogout }) => {
  return (
    <div>
      <h1>Selamat Datang, Siswa {user ? user.name : ''}!</h1>
      <p>Ini adalah halaman dashboard khusus untuk siswa.</p>
      {/* Tampilkan materi, tugas, dll. untuk siswa di sini */}
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default DashboardStudent;