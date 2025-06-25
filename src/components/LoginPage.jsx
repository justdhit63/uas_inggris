/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { account } from '../appwrite'; // Import instance akun dari file konfigurasi
import Test from './Test';
import Dashboard from './students/Dashboard';
import { Route, Link, useNavigate } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  // const [loggedInUser, setLoggedInUser] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  // const [userAccount, setUserAccount] = useState([]);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => { // <-- TAMBAHAN
    setIsPasswordVisible(prevState => !prevState);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Reset error setiap kali mencoba login

    try {
      // Membuat sesi login dengan email dan password
      const session = await account.createEmailPasswordSession(email, password);
      console.log('Login berhasil!', session);

      // Jika berhasil, ambil data pengguna yang sedang login
      const user = await account.get();
      onLoginSuccess(user);

    } catch (err) {
      console.error('Gagal melakukan login:', err);
      setError(err.message); 
    }
  };

  // Jika belum login, tampilkan form login
  // if (!loggedInUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[url(bg.png)]">
        <img src="bg.png" alt="background" className='hidden' />
        <div id="defaultModal" tabindex="-1" className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
          <div className="relative p-4 w-full max-w-lg h-full md:h-auto">
            <div className="relative p-4 bg-white rounded-lg shadow">
              <div className="flex pb-4 mb-4 rounded-t border-b sm:mb-5 items-center gap-32">
                <Link to="/">
                  <img src="logo.png" alt="" className='w-12' />
                </Link>
                <h3 className="text-3xl font-bold text-gray-900 text-center justify-center">
                  Login
                </h3>
              </div>
              <form onSubmit={handleLogin} className="flex flex-col items-center">
                <div className="gap-4 mb-4 w-full">
                  <div className='mb-4'>
                    <label for="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                    <input type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Type your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div>
                    <label for="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                    <div className="flex">

                      <input type={isPasswordVisible ? 'text' : 'password'} name="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Type your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                      <div className="p-2 bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg">
                        <button
                          type="button" // 'type="button"' agar tidak men-submit form
                          onClick={togglePasswordVisibility}
                        >
                          {isPasswordVisible ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>
                  </div>
                  {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
                <button type="submit" className="text-white bg-red-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-1/2">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  // }

  // return (
  //   <Navigate to="/dashboard" />
  // )
};

export default LoginPage;