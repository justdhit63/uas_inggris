// src/components/teachers/GradingListPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// DIUBAH: Kita butuh 'functions' untuk memanggil data siswa
import { databases, functions } from '../../appwrite'; 
import { Query } from 'appwrite';

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const QUIZZES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_QUIZZES_COLLECTION_ID;
const SUBMISSIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_SUBMISSIONS_COLLECTION_ID;

const GradingListPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuizId, setSelectedQuizId] = useState('');
    const [submissions, setSubmissions] = useState([]);
    // DITAMBAHKAN: State untuk menyimpan data semua siswa dalam format Map
    const [studentMap, setStudentMap] = useState(new Map());
    const [isLoading, setIsLoading] = useState(false);

    // Ambil data siswa sekali saja saat komponen dimuat
    useEffect(() => {
        const fetchAllStudents = async () => {
            try {
                const response = await functions.createExecution('685d0bac00245689b453'); // Panggil fungsi getStudents
                if (response.status === 'completed') {
                    const studentData = JSON.parse(response.responseBody);
                    // Ubah array siswa menjadi Map untuk pencarian cepat berdasarkan ID
                    const newStudentMap = new Map(studentData.map(student => [student.$id, student]));
                    setStudentMap(newStudentMap);
                }
            } catch (error) {
                console.error("Error fetching students data:", error);
            }
        };
        fetchAllStudents();
    }, []);

    // Ambil semua kuis untuk ditampilkan di dropdown
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await databases.listDocuments(DB_ID, QUIZZES_COLLECTION_ID);
                setQuizzes(response.documents);
            } catch (error) {
                console.error("Error Fetching List Quiz:", error);
            }
        };
        fetchQuizzes();
    }, []);

    // Ambil submission yang perlu dinilai setiap kali kuis yang dipilih berubah
    useEffect(() => {
        if (!selectedQuizId) {
            setSubmissions([]);
            return;
        }
        const fetchSubmissionsToGrade = async () => {
            setIsLoading(true);
            try {
                const response = await databases.listDocuments(
                    DB_ID,
                    SUBMISSIONS_COLLECTION_ID,
                    [
                        Query.equal('quiz', selectedQuizId),
                        Query.equal('status', 'partially_graded')
                    ]
                );
                setSubmissions(response.documents);
            } catch (error) {
                console.error("Error Fetching Submissions:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubmissionsToGrade();
    }, [selectedQuizId]);

    return (
        <div className="p-8 w-full">
            <h1 className="text-2xl font-bold mb-6">Quiz Grading</h1>

            {/* Dropdown untuk memilih kuis (tidak ada perubahan) */}
            <div className="mb-6">
            <label htmlFor="quiz-select" className="block text-lg font-medium mb-2">Select a Quiz to Grade</label>
                <select id="quiz-select" value={selectedQuizId} onChange={(e) => setSelectedQuizId(e.target.value)} className="w-full md:w-1/4 p-2 border rounded-lg">
                    <option value="">-- Select a Quiz --</option>
                    {quizzes.map(quiz => (<option key={quiz.$id} value={quiz.$id}>{quiz.title}</option>))}
                </select>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Submission to be Graded</h2>
                {isLoading ? <p>Load...</p> : (
                    <div className="space-y-3">
                        {submissions.length > 0 ? submissions.map(sub => (
                            <div key={sub.$id} className="p-3 border rounded-lg flex justify-between items-center">
                                <div>
                                    {/* DIUBAH: Ambil nama siswa dari studentMap menggunakan studentId */}
                                    <p className="font-bold">Student: {studentMap.get(sub.studentId)?.name || 'Undefined'}</p>
                                    <p className="text-sm text-gray-500">Submitted at: {new Date(sub.submittedAt).toLocaleString()}</p>
                                </div>
                                <Link to={`/dashboard/grade-submission/${sub.$id}`} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                    Grade Now
                                </Link>
                            </div>
                        )) : <p>There are no submissions to grade for this quiz.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GradingListPage;