import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useOutlet, Link } from 'react-router-dom';
import { FaBookOpen, FaClipboardList, FaSignOutAlt, FaHome, FaGraduationCap } from "react-icons/fa";
import { MdCalendarToday } from "react-icons/md";
import { BsPeopleFill } from "react-icons/bs";
import { databases } from '../../appwrite';
import { IoMdCalendar } from "react-icons/io";

const DashboardStudent = ({ user, onLogout }) => {
  const outlet = useOutlet();
  const [materials, setMaterials] = useState([]);

  const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
  const COLLECTION_ID = import.meta.env.VITE_APPWRITE_MATERIALS_COLLECTION_ID

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
              <div className="bg-orange-400 text-white p-6 rounded-lg flex flex-col justify-between h-32 w-64 items-center">
                <span className="text-2xl font-bold text-center">360</span>
                <span>Unfinished tasks</span>
              </div>
              <div className="bg-violet-500 text-white p-6 rounded-lg flex flex-col justify-between items-center h-32">
                <span className="text-2xl font-bold">{materials.length}</span>
                <span>Total Materials</span>
              </div>
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
            <button className="text-sm text-white bg-violet-500 px-4 py-1 rounded-md">
              View All
            </button>
          </div>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="py-2">Title</th>
                <th className="py-2">Date</th>
                <th className="py-2">Due</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td>Connect Words</td>
                <td>Jul 04, 2024</td>
                <td>Jul 17, 2024</td>
                <td>
                  <span className="text-sm">✏️</span>
                </td>
              </tr>
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