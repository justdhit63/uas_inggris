// src/components/students/TakeQuizPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { databases, account } from '../../appwrite';
import { ID, Query } from 'appwrite';

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const QUIZZES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_QUIZZES_COLLECTION_ID;
const QUESTIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_QUESTIONS_COLLECTION_ID;
const SUBMISSIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_SUBMISSIONS_COLLECTION_ID;
const ANSWERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_ANSWERS_COLLECTION_ID;

const TakeQuizPage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({}); // { questionId: answerValue }
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const quizResponse = await databases.getDocument(DB_ID, QUIZZES_COLLECTION_ID, quizId);
                setQuiz(quizResponse);

                const questionsResponse = await databases.listDocuments(
                    DB_ID,
                    QUESTIONS_COLLECTION_ID,
                    [Query.equal('quiz', quizId)]
                );
                setQuestions(questionsResponse.documents);
            } catch (error) {
                console.error("Error load quizzes:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuizData();
    }, [quizId]);

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleQuizSubmit = async () => {
        setIsLoading(true);
        try {
            const currentUser = await account.get();
            const studentId = currentUser.$id;
            let autoGradeScore = 0;
            let hasEssays = false;

            // 1. Hitung skor otomatis & cek apakah ada esai
            for (const question of questions) {
                if (question.questionType === 'essay') {
                    hasEssays = true;
                } else if (question.questionType === 'multiple_choice') {
                    const studentAnswerIndex = answers[question.$id];
                    if (studentAnswerIndex !== undefined && parseInt(studentAnswerIndex, 10) === question.correctAnswerIndex) {
                        autoGradeScore += question.maxPoints;
                    }
                }
            }

            // 2. Tentukan status
            const submissionStatus = hasEssays ? 'partially_graded' : 'graded';

            // 3. Buat dokumen submission utama
            const submissionPayload = {
                quiz: quizId,
                studentId: studentId,
                status: submissionStatus,
                autoGradeScore,
                submittedAt: new Date().toISOString(),
            };
            // Jika tidak ada esai, nilai akhir bisa langsung diisi
            if (!hasEssays) {
                submissionPayload.finalScore = autoGradeScore;
            }

            const submissionDoc = await databases.createDocument(
                DB_ID, SUBMISSIONS_COLLECTION_ID, ID.unique(), submissionPayload
            );
            const submissionId = submissionDoc.$id;

            // 4. Simpan setiap jawaban siswa
            const answerPromises = Object.entries(answers).map(([questionId, answerValue]) => {
                const question = questions.find(q => q.$id === questionId);
                const answerPayload = {
                    submission: submissionId,
                    question: questionId,
                    studentId,
                };
                if (question.questionType === 'multiple_choice') {
                    answerPayload.selectedIndex = parseInt(answerValue, 10);
                } else {
                    answerPayload.answerText = answerValue;
                }
                return databases.createDocument(DB_ID, ANSWERS_COLLECTION_ID, ID.unique(), answerPayload);
            });

            await Promise.all(answerPromises);
            
            alert('Quiz submitted successfully!');
            navigate('/dashboard-student');

        } catch (error) {
            console.error("Error send answer:", error);
            alert('An Error occured while submitting your answers.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center">Loading the quiz...</div>;
    }

    return (
        <div className="p-8 w-full">
            <h1 className="text-2xl font-bold mb-2">{quiz?.title}</h1>
            <p className="text-gray-600 mb-6">{quiz?.description}</p>
            
            <div className="space-y-6">
                {questions.map((q, index) => (
                    <div key={q.$id} className="bg-white p-4 rounded-lg shadow-md">
                        <p className="font-semibold mb-2">{index + 1}. {q.questionText} ({q.maxPoints} poin)</p>
                        {q.questionType === 'multiple_choice' ? (
                            <div className="space-y-2">
                                {q.options.map((opt, optIndex) => (
                                    <label key={optIndex} className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={q.$id}
                                            value={optIndex}
                                            onChange={(e) => handleAnswerChange(q.$id, e.target.value)}
                                            className="mr-3"
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <textarea
                                rows="5"
                                className="w-full border rounded p-2 mt-2"
                                placeholder="Enter your essay answer here..."
                                onChange={(e) => handleAnswerChange(q.$id, e.target.value)}
                            ></textarea>
                        )}
                    </div>
                ))}
            </div>

            <button 
                onClick={handleQuizSubmit} 
                className="mt-8 mb-8 bg-green-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                disabled={isLoading}
            >
                {isLoading ? 'Submitting...' : 'Finish & Submit Answer'}
            </button>
        </div>
    );
};

export default TakeQuizPage;