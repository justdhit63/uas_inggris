import React, { useState, useEffect } from 'react'
import { FiMessageSquare } from "react-icons/fi";
import { FaBookOpen, FaClipboardList, FaSignOutAlt, FaHome, FaGraduationCap } from "react-icons/fa";
import { MdCalendarToday } from "react-icons/md";
import { BsPeopleFill } from "react-icons/bs";
import { functions } from '../../appwrite';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                // Panggil Appwrite Function berdasarkan NAMA atau ID-nya
                // Pastikan nama 'getStudents' sama dengan nama fungsi di dashboard Appwrite
                const response = await functions.createExecution('685d0bac00245689b453');

                // Response dari function adalah string JSON, jadi perlu di-parse
                if (response.status === 'completed') {
                    const studentData = JSON.parse(response.responseBody);
                    setStudents(studentData);
                } else {
                    throw new Error('Execute Function Failed: ' + response.stderr);
                }

            } catch (err) {
                console.error("Error fetching students data:", err);
                setError("Error fetching students data. Try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.phone && student.phone.includes(searchTerm))
    );

    if (isLoading) {
        return <div className="p-8 text-center">Load students data...</div>;
    }

    // Tampilan jika ada error
    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    return (
        <div className='w-full px-8 py-8'>
            {/* Main Content */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Total students: {filteredStudents.length}</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border border-gray-300 rounded-md px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="absolute right-2 top-2 text-purple-600">🔍</button>
                </div>
            </div>

            <div className="w-full">
                <table className="bg-white shadow-md rounded-lg overflow-hidden w-full ">
                    <thead className="bg-gray-100 text-left text-sm text-gray-600">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">ID student</th>
                            <th className="px-6 py-4">Email</th>
                        </tr>
                    </thead>
                    <tbody>

                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <tr key={student.$id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <img
                                            src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                                            alt={student.name}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        {student.name}
                                    </td>
                                    <td className="px-6 py-4">ID: {student.phone || 'N/A'}</td>
                                    <td className="px-6 py-4">{student.email}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-6 text-gray-500">
                                    No students matched your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Students
