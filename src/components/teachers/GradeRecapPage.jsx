// src/components/teachers/GradeRecapPage.jsx

import React, { useState, useEffect } from 'react';
import { databases, functions } from '../../appwrite'; // Pastikan path benar
import { Query } from 'appwrite';

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const SUBMISSIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_SUBMISSIONS_COLLECTION_ID;

const GradeRecapPage = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [gradedSubmissions, setGradedSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingStudents, setIsFetchingStudents] = useState(true);

    // 1. Ambil daftar semua siswa untuk mengisi dropdown
    useEffect(() => {
        const fetchAllStudents = async () => {
            try {
                const response = await functions.createExecution('685d0bac00245689b453');
                if (response.status === 'completed') {
                    const studentData = JSON.parse(response.responseBody);
                    setStudents(studentData);
                }
            } catch (error) {
                console.error("Gagal mengambil data siswa:", error);
            } finally {
                setIsFetchingStudents(false);
            }
        };
        fetchAllStudents();
    }, []);

    // 2. Ambil data submission setiap kali siswa yang dipilih berubah
    useEffect(() => {
        if (!selectedStudentId) {
            setGradedSubmissions([]);
            return;
        }

        const fetchGradedSubmissions = async () => {
            setIsLoading(true);
            try {
                const response = await databases.listDocuments(
                    DB_ID,
                    SUBMISSIONS_COLLECTION_ID,
                    [
                        Query.equal('studentId', selectedStudentId),
                        Query.equal('status', 'graded') // Hanya ambil kuis yang sudah dinilai
                    ]
                );
                setGradedSubmissions(response.documents);
            } catch (error) {
                console.error("Gagal mengambil rekap nilai:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGradedSubmissions();
    }, [selectedStudentId]);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Rekap Nilai Siswa</h1>

            {isFetchingStudents ? <p>Memuat daftar siswa...</p> : (
                <div className="mb-8">
                    <label htmlFor="student-select" className="block text-lg font-medium mb-2">Pilih Siswa:</label>
                    <select
                        id="student-select"
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        className="w-full md:w-1/2 p-2 border rounded-lg"
                    >
                        <option value="">-- Pilih seorang siswa --</option>
                        {students.map(student => (
                            <option key={student.$id} value={student.$id}>{student.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {selectedStudentId && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">
                        Riwayat Nilai untuk: {students.find(s => s.$id === selectedStudentId)?.name}
                    </h2>
                    {isLoading ? <p>Memuat nilai...</p> : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-100 text-sm text-gray-600">
                                <tr>
                                    <th className="px-4 py-3">Judul Kuis</th>
                                    <th className="px-4 py-3">Tanggal Pengerjaan</th>
                                    <th className="px-4 py-3">Nilai Akhir</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gradedSubmissions.length > 0 ? (
                                    gradedSubmissions.map(sub => (
                                        <tr key={sub.$id} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3">{sub.quiz.title}</td>
                                            <td className="px-4 py-3">{new Date(sub.submittedAt).toLocaleDateString('id-ID')}</td>
                                            <td className="px-4 py-3 font-bold">{sub.finalScore}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center py-6 text-gray-500">
                                            Siswa ini belum memiliki kuis yang sudah dinilai.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default GradeRecapPage;