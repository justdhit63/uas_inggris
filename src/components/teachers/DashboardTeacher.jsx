// src/components/teachers/DashboardTeacher.jsx

// DIUBAH: Impor NavLink, Outlet, dan useOutlet. Hapus useState dan MaterialsTeacher.
import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useOutlet } from 'react-router-dom';
import { FaBookOpen, FaClipboardList, FaSignOutAlt, FaHome, FaGraduationCap, FaClipboardCheck, FaBook } from "react-icons/fa";
import { MdCalendarToday } from "react-icons/md";
import { BsPeopleFill } from "react-icons/bs";
import { functions, databases } from '../../appwrite';
import { FaClipboardQuestion } from 'react-icons/fa6';
import { Query } from 'appwrite';
import { IoMdCalendar } from 'react-icons/io';

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const SUBMISSIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_SUBMISSIONS_COLLECTION_ID;

const DashboardTeacher = ({ user, onLogout }) => {
    const [students, setStudents] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [ungradedCount, setUngradedCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
    const COLLECTION_ID = import.meta.env.VITE_APPWRITE_MATERIALS_COLLECTION_ID

    useEffect(() => {
        const fetchUngradedCount = async () => {
            try {
                // Ambil jumlah submission dengan status 'partially_graded'
                const response = await databases.listDocuments(
                    DB_ID,
                    SUBMISSIONS_COLLECTION_ID,
                    [
                        Query.equal('status', 'partially_graded'),
                        Query.limit(1) // Trik efisiensi, kita hanya butuh totalnya
                    ]
                );
                setUngradedCount(response.total);
            } catch (error) {
                console.error("Gagal mengambil data tugas belum dinilai:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUngradedCount();
    }, []);

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

    // useEffect(() => {
    //     const fetchStudents = async () => {
    //         try {
    //             // Panggil Appwrite Function berdasarkan NAMA atau ID-nya
    //             // Pastikan nama 'getStudents' sama dengan nama fungsi di dashboard Appwrite
    //             const response = await functions.createExecution('685fba1400251a6883fa');

    //             // Response dari function adalah string JSON, jadi perlu di-parse
    //             if (response.status === 'completed') {
    //                 const studentData = JSON.parse(response.responseBody);
    //                 setStudents(studentData);
    //             } else {
    //                 throw new Error('Excution the function failed: ' + response.stderr);
    //             }

    //         } catch (err) {
    //             console.error("Failed to load students data:", err);
    //         }
    //     };

    //     fetchStudents();
    // }, []);

    // DIHAPUS: State untuk mengganti view tidak diperlukan lagi.
    // const [currentView, setCurrentView] = useState('dashboard');

    // const students = [
    //     { name: "Daniel Moore", id: "12384309", progress: 90 },
    //     { name: "John Scott", id: "47893225", progress: 75 },
    //     { name: "Maria Gomez", id: "38294729", progress: 60 },
    //     { name: "Anthony Adams", id: "38579393", progress: 45 },
    //     { name: "Sarah Davis", id: "35739237", progress: 30 },
    //     { name: "John Hill", id: "39258486", progress: 70 },
    //     { name: "Anthony Davis", id: "58510934", progress: 85 },
    //     { name: "Elizabeth Allen", id: "47854029", progress: 100 },
    // ];

    // DIHAPUS: Fungsi ini tidak lagi diperlukan karena navigasi ditangani oleh NavLink.
    // const handleBackToDashboard = () => { ... };

    // DITAMBAHKAN: Hook dari React Router untuk memeriksa apakah ada rute anak yang aktif.
    const outlet = useOutlet();

    // DITAMBAHKAN: Style untuk link yang sedang aktif di sidebar.
    const activeLinkStyle = {
        color: '#ef5b4c',
        fontWeight: '600'
    };

    // Fungsi renderDashboard tetap sama, kita akan menggunakannya sebagai tampilan default.
    const renderDashboard = () => (
        <main className="flex-1 p-8 overflow-auto">
            {/* ... Konten header, kartu, dan tabel Anda tidak berubah ... */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="font-semibold">{user ? user.name : 'Teacher'}</span>
                    <img src="/logo.png" alt="profile" className="w-10 h-10 rounded-full object-cover" />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-6 mb-6">
                <Link to='/dashboard/grading' className="bg-orange-400 text-white p-6 rounded-lg shadow flex flex-col justify-between">
                    {isLoading ? (
                        <div className="text-3xl font-bold">...</div>
                    ) : (
                        <div className="text-3xl font-bold">{ungradedCount}</div>
                    )}
                    <div className="flex justify-between items-center"><span>Ungraded Assignments</span><FaClipboardList className="text-xl" /></div>
                </Link>
                <Link to='/dashboard/materials' className="bg-violet-500 text-white p-6 rounded-lg shadow flex flex-col justify-between">
                    <div className="text-3xl font-bold">{materials.length}</div>
                    <div className="flex justify-between items-center"><span>Total Materials</span><FaBookOpen className="text-xl" /></div>
                </Link>
                <Link to='/dashboard/students' className="bg-teal-400 text-white p-6 rounded-lg shadow flex flex-col justify-between">
                    {/* <div className="text-3xl font-bold">{students.length}</div> */}
                    <div className="flex justify-between items-center"><span>Students</span><FaGraduationCap className="text-xl" /></div>
                </Link>
            </div>
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Students</h3>
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="text-gray-600 border-b">
                                <th>Name</th>
                                <th>ID Student</th>
                                <th>Class</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* {students.length > 0 ? (
                                students.map((student) => (
                                    <tr key={student.$id} className="border-b">
                                        <td className="py-2 flex items-center gap-2">
                                            <img src={`https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png`} alt={student.name} className="w-6 h-6 rounded-full" />
                                            {student.name}
                                        </td>
                                        <td>ID: {student.phone}</td>
                                        <td>{student.email}</td>
                                    </tr>
                                ))
                            ) : (
                                <p>None..</p>
                            )} */}

                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col gap-6">
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
                </div>
            </div>
        </main>
    );

    // DIHAPUS: Blok 'if' untuk merender MaterialsTeacher. Ini sekarang ditangani oleh Router.
    // if (currentView === 'materials') { ... }

    // DIUBAH: Struktur return disatukan menjadi satu.
    return (
        <div className="flex h-screen font-sans bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md px-6 py-8 flex flex-col justify-between fixed h-full">
                <div>
                    <div className="flex items-center gap-2 mb-10">
                        <img src="/logo.png" alt="Logo" className="w-8 h-8" />
                        <span className="text-2xl font-bold text-[#ef5b4c]">Learn<span className="text-black">Sphere</span>.</span>
                    </div>

                    {/* DIUBAH: Menu sekarang menggunakan NavLink untuk navigasi berbasis URL */}
                    <nav className="space-y-6">
                        <NavLink to="/dashboard" end style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="flex items-center gap-3 text-gray-600 hover:text-[#ef5b4c] cursor-pointer">
                            <FaHome /> Dashboard
                        </NavLink>
                        <NavLink to="/dashboard/students" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="flex items-center gap-3 text-gray-600 hover:text-[#ef5b4c] cursor-pointer">
                            <BsPeopleFill /> Students
                        </NavLink>
                        <NavLink to="/dashboard/materials" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="flex items-center gap-3 text-gray-600 hover:text-[#ef5b4c] cursor-pointer">
                            <FaBookOpen /> Learning Materials
                        </NavLink>
                        <NavLink to="/dashboard/create-quiz" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="flex items-center gap-3 text-gray-600 hover:text-[#ef5b4c] cursor-pointer">
                            <FaClipboardQuestion /> Create Quiz
                        </NavLink>
                        <NavLink to="/dashboard/grading" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="flex items-center gap-3 text-gray-600 hover:text-[#ef5b4c] cursor-pointer">
                            <FaClipboardCheck /> Grade Quiz
                        </NavLink>
                        <NavLink to="/dashboard/grade-recap" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="flex items-center gap-3 text-gray-600 hover:text-[#ef5b4c] cursor-pointer">
                            <FaClipboardList /> Recap Quiz
                        </NavLink>
                        <NavLink to="/dashboard/upload-book" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="flex items-center gap-3 text-gray-600 hover:text-[#ef5b4c] cursor-pointer">
                            <FaBook /> Add Books
                        </NavLink>
                    </nav>
                </div>

                <div>
                    <a onClick={onLogout} className="flex items-center gap-3 text-gray-600 hover:text-red-500 cursor-pointer">
                        <FaSignOutAlt /> Logout
                    </a>
                </div>
            </aside>

            {/* DIUBAH: Logika untuk menampilkan konten utama */}
            <div className="ml-64 flex-1">

                {outlet ? <Outlet /> : renderDashboard()}
            </div>
        </div>
    );
};

export default DashboardTeacher;