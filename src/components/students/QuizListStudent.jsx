import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { databases, account } from '../../appwrite';
import { Query } from 'appwrite';

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const QUIZZES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_QUIZZES_COLLECTION_ID
const SUBMISSIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_SUBMISSIONS_COLLECTION_ID

const QuizListStudent = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
      const FetchQuizzesAndSubmissions = async () => {
        try {
            const currentUser = await account.get();
            const studentId = currentUser.$id;

            const quizResponse = await databases.listDocuments(DB_ID, QUIZZES_COLLECTION_ID);

            const submissionResponse = await databases.listDocuments(
                DB_ID,
                SUBMISSIONS_COLLECTION_ID,
                [Query.equal('studentId', studentId)]
            );

            const submissionsMap = new Map(submissionResponse.documents.map(sub => [sub.quiz.$id, sub]));

            const quizzesWithStatus = quizResponse.documents.map(quiz => {
                const submission = submissionsMap.get(quiz.$id);
                return {
                    ...quiz,
                    submissionStatus: submission ? submission.status : null,
                    finalScore: submission ? submission.finalScore : null
                };
            });

            setQuizzes(quizzesWithStatus);

        } catch (error) {
            console.error("Error fetching quizzes list: ", error);
        } finally {
            setIsLoading(false);
        }
      };
    
      FetchQuizzesAndSubmissions();
    }, []);
    
    const renderStatusButton = (quiz) => {
        switch (quiz.submissionStatus) {
            case 'graded':
                return <span className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-full">Finish (Nilai: {quiz.finalScore})</span>;
            case 'partially_graded':
            case 'submitted':
                return <span className="px-4 py-2 text-sm font-semibold text-white bg-yellow-500 rounded-full">Waiting for Grading</span>;
            default:
                return (
                    <Link to={`/dashboard-student/take-quiz/${quiz.$id}`} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700">
                        Attempt quiz
                    </Link>
                );
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center">Load task list...</div>;
    }

  return (
    <div className="p-8 w-full">
            <h1 className="text-2xl font-bold mb-6">List of Quizzes</h1>
            <div className="space-y-4 grid grid-cols-3 gap-4">
                {quizzes.length > 0 ? (
                    quizzes.map(quiz => (
                        <div key={quiz.$id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center h-32">
                            <div>
                                <h2 className="text-lg font-bold">{quiz.title}</h2>
                                <p className="text-sm text-gray-600">{quiz.description}</p>
                            </div>
                            <div>
                                {renderStatusButton(quiz)}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No Quiz available yet.</p>
                )}
            </div>
        </div>
  );
};

export default QuizListStudent
