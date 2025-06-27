import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useOutlet, Link } from 'react-router-dom';
import { FaBookOpen, FaClipboardList, FaSignOutAlt, FaHome, FaGraduationCap, FaBook } from "react-icons/fa";
import { MdCalendarToday } from "react-icons/md";
import { BsPeopleFill } from "react-icons/bs";
import { databases, account } from '../../appwrite';
import { IoMdCalendar } from "react-icons/io";
import { Query } from 'appwrite';

const DashboardStudent = ({ user, onLogout }) => {
  const outlet = useOutlet();
  const [materials, setMaterials] = useState([]);
  const [unfinishedTasks, setUnfinishedTasks] = useState(0);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [task, setTask] = useState([]);

  const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
  const COLLECTION_ID = import.meta.env.VITE_APPWRITE_MATERIALS_COLLECTION_ID
  const QUIZZES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_QUIZZES_COLLECTION_ID
  const SUBMISSIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_SUBMISSIONS_COLLECTION_ID

  const getMaterials = async () => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
      setMaterials(response.documents);
    } catch (error) {
      console.error("Error fetching materials", error);
    }
  }

  useEffect(() => {
    getMaterials();
  }, [])

  const getQuizzes = async () => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, QUIZZES_COLLECTION_ID);
      setTask(response.documents);
    } catch (error) {
      console.error("Error fetching tasks: ", error);
    }
  };

  useEffect(() => {
    getQuizzes();
  }, [])
  

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoadingTasks(true);
      try {
        // 1. Ambil ID siswa yang sedang login
        const currentUser = await account.get();
        const studentId = currentUser.$id;

        // 2. Ambil data materi (seperti sebelumnya)
        const materialsResponse = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
        setMaterials(materialsResponse.documents.slice(0, 5));

        // 3. Ambil jumlah total kuis yang ada
        const totalQuizzesResponse = await databases.listDocuments(DATABASE_ID, QUIZZES_COLLECTION_ID, [Query.limit(1)]); // Cukup ambil 1 untuk mendapatkan total
        const totalQuizzes = totalQuizzesResponse.total;

        // 4. Ambil jumlah kuis yang sudah dikerjakan oleh siswa ini
        const submittedQuizzesResponse = await databases.listDocuments(
          DATABASE_ID,
          SUBMISSIONS_COLLECTION_ID,
          [
            Query.equal('studentId', studentId),
            Query.limit(1) // Cukup ambil 1 untuk mendapatkan total
          ]
        );
        const submittedCount = submittedQuizzesResponse.total;

        // 5. Hitung selisihnya dan simpan ke state
        setUnfinishedTasks(totalQuizzes - submittedCount);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoadingTasks(false);
      }
    };

    fetchDashboardData();
  }, []);

  const activeLinkStyle = {
    color: '#ef5b4c',
    fontWeight: '600'
  };

  const renderDashboard = () => (
    <main className="flex-1">
      <div className="py-2 px-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="font-semibold">{user.name}</span>
            <img
              src="/logo.png"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Greeting + Stats */}
      <div className="bg-[url(https://cdn.pixabay.com/photo/2023/03/19/23/28/background-7863504_1280.jpg)]">
        <div className="backdrop-brightness-90 w-full">
          <div className="flex justify-center">
            <div className="grid grid-cols-2 gap-4 my-12">
              <Link to='/dashboard-student/tasks' className="bg-orange-400 text-white p-6 rounded-lg flex flex-col justify-between h-32 w-64 items-center">
                {isLoadingTasks ? (
                  <span className="text-2xl font-bold text-center">...</span>
                ) : (
                  <span className="text-2xl font-bold text-center">{unfinishedTasks}</span>
                )}
                <span>Unfinished tasks</span>
              </Link>
              <Link to='/dashboard-student/materials' className="bg-violet-500 text-white p-6 rounded-lg flex flex-col justify-between items-center h-32">
                <span className="text-2xl font-bold">{materials.length}</span>
                <span>Total Materials</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar + Materials + Tasks */}
      <div className="grid grid-cols-3 gap-4 p-4">
        {/* Calendar */}
        <div className="bg-white p-6 rounded-lg shadow col-span-1">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">June 2025</h3>
            <IoMdCalendar className="text-xl" />
          </div>
          <div className="grid grid-cols-7 text-center text-gray-500 text-sm mb-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 text-center text-sm gap-1">
            {Array.from({ length: 30 }, (_, i) => (
              <div
                key={i}
                className="py-1 text-gray-700 hover:bg-gray-200 rounded cursor-default"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Learning Materials */}
        <div className="bg-white p-6 rounded-lg shadow col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Learning Materials</h3>
            <Link to='/dashboard-student/materials'
              className="text-sm text-white bg-orange-500 px-4 py-1 rounded-md"
            >
              View All
            </Link>
          </div>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="py-2">Chapter</th>
                <th className="py-2">Title</th>
              </tr>
            </thead>
            <tbody>
              {materials.length > 0 ? (
                materials.map((item) => (
                  <tr className="border-t">
                    <td>{item.chapter}</td>
                    <td>{item.title}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="2" className="text-center py-6">No materials added yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Task */}
        <div className="bg-white p-6 rounded-lg shadow col-span-3 mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Task</h3>
            <Link to='/dashboard-student/tasks' className="text-sm text-white bg-violet-500 px-4 py-1 rounded-md">
              View All
            </Link>
          </div>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-600 border-b mb-4">
                <th className="py-2">Title</th>
                <th className="py-2">Description</th>
              </tr>
            </thead>
            <tbody>
                {task.length > 0 ? (
                  task.map((quiz) => (
                    <tr className='border-b border-b-gray-900'>
                      <td>{quiz.title}</td>
                      <td>{quiz.description}</td>
                    </tr>
                  ))
                ) : (
                <tr><td colSpan="2" className="text-center py-6">No tasks added yet.</td></tr>
                )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )

  return (
    <div className="flex h-screen font-sans bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md px-6 py-8 flex flex-col justify-between fixed h-full">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
            <span className="text-2xl font-bold text-[#ef5b4c]">Learn<span className="text-black">Sphere</span>.</span>
          </div>

          {/* Menu menggunakan NavLink untuk navigasi berbasis URL */}
          <nav className="space-y-6">
            <NavLink to="/dashboard-student" end style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="flex items-center gap-3 text-gray-600 hover:text-[#ef5b4c] cursor-pointer">
              <FaHome /> Dashboard
            </NavLink>
            <NavLink to="/dashboard-student/materials" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="flex items-center gap-3 text-gray-600 hover:text-[#ef5b4c] cursor-pointer">
              <FaBookOpen /> Learning Materials
            </NavLink>
            <NavLink to="/dashboard-student/tasks" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="flex items-center gap-3 text-gray-600 hover:text-[#ef5b4c] cursor-pointer">
              <FaClipboardList /> Task
            </NavLink>
            <NavLink to="/dashboard-student/books" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="flex items-center gap-3 text-gray-600 hover:text-[#ef5b4c] cursor-pointer">
              <FaBook /> Book
            </NavLink>
          </nav>
        </div>

        <div>
          <a onClick={onLogout} className="flex items-center gap-3 text-gray-600 hover:text-red-500 cursor-pointer">
            <FaSignOutAlt /> Logout
          </a>
        </div>
      </aside>

      <div className="ml-64 flex-1">
        {outlet ? <Outlet /> : renderDashboard()}
      </div>
    </div>
  );
};

export default DashboardStudent;