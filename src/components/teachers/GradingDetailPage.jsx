// src/components/teachers/GradingDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// DIUBAH: Kita butuh 'functions' untuk memanggil data siswa
import { databases, functions } from '../../appwrite';
import { Query } from 'appwrite';

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const SUBMISSIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_SUBMISSIONS_COLLECTION_ID;
const ANSWERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_ANSWERS_COLLECTION_ID;

const GradingDetailPage = () => {
    const { submissionId } = useParams();
    const navigate = useNavigate();

    const [submission, setSubmission] = useState(null);
    const [studentAnswers, setStudentAnswers] = useState([]);
    // DITAMBAHKAN: State terpisah untuk menyimpan nama siswa
    const [studentName, setStudentName] = useState('');
    const [grades, setGrades] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissionDetails = async () => {
            try {
                // 1. Ambil data submission utama
                const subResponse = await databases.getDocument(DB_ID, SUBMISSIONS_COLLECTION_ID, submissionId);
                setSubmission(subResponse);

                // 2. Ambil semua jawaban esai terkait submission ini
                const ansResponse = await databases.listDocuments(
                    DB_ID,
                    ANSWERS_COLLECTION_ID,
                    [Query.equal('submission', submissionId)]
                );
                const essayAnswers = ansResponse.documents.filter(ans => ans.question.questionType === 'essay');
                setStudentAnswers(essayAnswers);

                // 3. DITAMBAHKAN: Ambil nama siswa menggunakan studentId dari submission
                if (subResponse.studentId) {
                    const studentsResponse = await functions.createExecution('685d0bac00245689b453');
                    if (studentsResponse.status === 'completed') {
                        const allStudents = JSON.parse(studentsResponse.responseBody);
                        const currentStudent = allStudents.find(student => student.$id === subResponse.studentId);
                        if (currentStudent) {
                            setStudentName(currentStudent.name);
                        } else {
                            setStudentName('Not Found');
                        }
                    }
                }

            } catch (error) {
                console.error("Failed fetching submission details:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubmissionDetails();
    }, [submissionId]);

    const handleGradeChange = (answerId, points) => {
        setGrades(prev => ({ ...prev, [answerId]: parseInt(points, 10) || 0 }));
    };
    
    // ... (Fungsi handleFinalizeGrade Anda tidak perlu diubah)
    const handleFinalizeGrade = async () => {
        setIsLoading(true);
        try {
            let manualScore = 0;
            const updatePromises = [];

            // 1. Siapkan update untuk setiap jawaban esai
            for (const answer of studentAnswers) {
                const points = grades[answer.$id] || 0;
                manualScore += points;
                updatePromises.push(
                    databases.updateDocument(DB_ID, ANSWERS_COLLECTION_ID, answer.$id, {
                        pointsAwarded: points
                    })
                );
            }
            await Promise.all(updatePromises); // Jalankan semua update jawaban

            // 2. Hitung nilai akhir dan update submission utama
            const finalScore = (submission.autoGradeScore || 0) + manualScore;
            await databases.updateDocument(DB_ID, SUBMISSIONS_COLLECTION_ID, submissionId, {
                finalScore,
                status: 'graded'
            });

            alert('The grade has been saved successfully!');
            navigate('/dashboard/grading');

        } catch (error) {
            console.error("Failed saving grade:", error);
            alert('An error occured while saving the grade.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center">Load...</div>;
    if (!submission) return <div className="p-8 text-center">Submission not found.</div>;

    return (
        <div className="p-8">
            {/* DIUBAH: Logika untuk menampilkan nama sudah diperbaiki */}
            <h1 className="text-2xl font-bold mb-2">Quiz Grading: {submission.quiz?.title || 'Judul Kuis'}</h1>
            <h2 className="text-xl text-gray-700 mb-4">Student: {studentName}</h2>
            
            <p className="mb-6 p-3 bg-blue-100 rounded-lg">Multiple Choices Score: <strong>{submission.autoGradeScore}</strong></p>

            <div className="space-y-6">
                <h3 className="text-lg font-semibold">Essay Answers to be Graded</h3>
                {studentAnswers.length > 0 ? studentAnswers.map(answer => (
                    <div key={answer.$id} className="bg-white p-4 rounded-lg shadow">
                        <p className="font-bold text-gray-800 mb-2">{answer.question?.questionText || 'Teks pertanyaan tidak tersedia'}</p>
                        <p className="p-3 bg-gray-50 border rounded mb-3">{answer.answerText}</p>
                        <div className="flex items-center">
                            <input
                                type="number"
                                max={answer.question?.maxPoints || 100}
                                min="0"
                                onChange={(e) => handleGradeChange(answer.$id, e.target.value)}
                                className="w-24 p-2 border rounded"
                                placeholder="Nilai"
                            />
                            <span className="ml-2 text-gray-600">/ {answer.question?.maxPoints || 100} poin</span>
                        </div>
                    </div>
                )) : <p>There are no essay answers on this quiz.</p>}
            </div>

            <button
                onClick={handleFinalizeGrade}
                className="mt-8 bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                disabled={isLoading}
            >
                {isLoading ? 'Saving...' : 'Save Final Score'}
            </button>
        </div>
    );
};

export default GradingDetailPage;