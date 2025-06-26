import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DashboardTeacher from './components/teachers/DashboardTeacher';
import DashboardStudent from './components/students/DashboardStudent';
import ProtectedRoute from './components/ProtectedRoute'; // Kita akan gunakan ini
import MaterialsTeacher from './components/teachers/MaterialsTeacher';
import Students from './components/teachers/Students';
import { account } from './appwrite';
import MaterialsStudent from './components/students/MaterialsStudent';
import CreateQuizPage from './components/teachers/CreateQuizPage';
import QuizListStudent from './components/students/QuizListStudent';
import TakeQuizPage from './components/students/TakeQuizPage';
import GradingListPage from './components/teachers/GradingListPage';
import GradingDetailPage from './components/teachers/GradingDetailPage';
import GradeRecapPage from './components/teachers/GradeRecapPage';

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
    if (user.labels.includes('teacher')) {
      navigate('/dashboard');
    } else if (user.labels.includes('student')) {
      navigate('/dashboard-student');
    } else {
      navigate('/login');
    }
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
          <Route path="materials" element={<MaterialsTeacher />} />
          <Route path="students" element={<Students />} />
          <Route path="create-quiz" element={<CreateQuizPage />} />
          <Route path="grading" element={<GradingListPage />} />
          <Route path="grade-submission/:submissionId" element={<GradingDetailPage />} />
          <Route path="grade-recap" element={<GradeRecapPage />} />
        </Route>
        <Route
          path="/dashboard-student"
          element={
            <ProtectedRoute user={loggedInUser}>
              <DashboardStudent user={loggedInUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route path="materials" element={<MaterialsStudent />} />
          <Route path="tasks" element={<QuizListStudent />} />
          <Route path="take-quiz/:quizId" element={<TakeQuizPage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
