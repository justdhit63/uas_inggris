import React, { useState, useEffect } from 'react';
import { databases, storage } from '../../appwrite';
import { ID, Query, Client, Account, Databases, Functions, Storage } from 'appwrite';
import { useNavigate } from 'react-router-dom';

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const MATERIALS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_MATERIALS_COLLECTION_ID;
const QUIZZES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_QUIZZES_COLLECTION_ID;
const QUESTIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_QUESTIONS_COLLECTION_ID;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

const CreateQuizPage = () => {
    const navigate = useNavigate();

    // State untuk data dari luar
    const [materials, setMaterials] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [audioFile, setAudioFile] = useState(null);

    // State untuk form kuis
    const [quizFormData, setQuizFormData] = useState({
        title: '',
        material: '',
        description: ''
    });
    const [createdQuiz, setCreatedQuiz] = useState(null);

    // State untuk form pertanyaan
    const [questionType, setQuestionType] = useState('multiple_choice');
    const [questionText, setQuestionText] = useState('');
    const [maxPoints, setMaxPoints] = useState(10);
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);

    const handleFinishCreation = () => {
        alert('Quizzes and questions have been saved. You will be returned to the dashboard.');
        navigate('/dashboard'); // Arahkan kembali ke dashboard utama guru
    };

    // Mengambil daftar materi untuk dropdown
    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await databases.listDocuments(DB_ID, MATERIALS_COLLECTION_ID);
                setMaterials(response.documents);
            } catch (error) {
                console.error("Error Fetching Materials: ", error);
            }
        }
        fetchMaterials();
    }, []);

    const handleQuizFormChange = (e) => {
        const { name, value } = e.target;
        setQuizFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateQuiz = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const newQuiz = await databases.createDocument(
                DB_ID,
                QUIZZES_COLLECTION_ID,
                ID.unique(),
                quizFormData
            );
            setCreatedQuiz(newQuiz);
            alert("Quiz created successfully! Now add questions.");
        } catch (error) {
            console.error("Failed to create quiz: ", error);
            alert('Failed to create quiz');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        if (!createdQuiz) return;
        setIsLoading(true);

        try {
            let audioFileId = null;

            // 1. Upload file audio jika ada
            if (audioFile) {
                const uploadedFile = await storage.createFile(
                    BUCKET_ID,
                    ID.unique(),
                    audioFile
                );
                audioFileId = uploadedFile.$id;
            }

            let questionData = {
                quiz: createdQuiz.$id,
                questionType,
                questionText,
                maxPoints: parseInt(maxPoints, 10),
                audioFileId: audioFileId,
            };

            if (questionType === 'multiple_choice') {
                questionData.options = options.filter(opt => opt !== '');
                questionData.correctAnswerIndex = parseInt(correctAnswerIndex, 10);
            }
            await databases.createDocument(
                DB_ID,
                QUESTIONS_COLLECTION_ID,
                ID.unique(),
                questionData
            );
            alert('Question added');
            // Reset form pertanyaan
            setQuestionText('');
            setOptions['', '', '', ''];
            setMaxPoints(10);
            setAudioFile(null);
            e.target.reset();
        } catch (error) {
            console.error("Failed adding question :", error);
            alert('Failed adding question.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="p-8 w-full">
            <h1 className="text-2xl font-bold mb-6">Create a New Quiz</h1>

            {/* Bagian 1: Form Membuat Kuis */}
            <form onSubmit={handleCreateQuiz} className="bg-white p-6 rounded-lg shadow-lg border-gray-100 mb-8">
                <fieldset disabled={createdQuiz || isLoading}>
                    <legend className="text-lg font-semibold mb-4">Quiz Detail</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block mb-2">Audio File (Optional)</label>
                            <input
                                type="file"
                                accept="audio/*"
                                onChange={(e) => setAudioFile(e.target.files[0])}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                            />
                        </div>
                        <div>
                            <label htmlFor="title" className="block mb-2">Title</label>
                            <input type="text" id="title" name="title" value={quizFormData.title} onChange={handleQuizFormChange} className="w-full border rounded p-2" required />
                        </div>
                        <div>
                            <label htmlFor="material" className="block mb-2">Related Material</label>
                            <select id="material" name="material" value={quizFormData.material} onChange={handleQuizFormChange} className="w-full border rounded p-2" required>
                                <option value="" disabled>Choose Material</option>
                                {materials.map(mat => (
                                    <option key={mat.$id} value={mat.$id}>{mat.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block mb-2">Description (Optional)</label>
                            <textarea id="description" name="description" value={quizFormData.description} onChange={handleQuizFormChange} className="w-full border rounded p-2"></textarea>
                        </div>
                    </div>
                    <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400">
                        {isLoading ? 'Saving...' : 'Create Quiz'}
                    </button>
                </fieldset>
            </form>

            {/* Bagian 2: Form Menambahkan Pertanyaan (Muncul setelah kuis dibuat) */}
            {createdQuiz && (
                <>
                    <form onSubmit={handleAddQuestion} className="bg-white p-6 rounded-lg shadow-md">
                        <legend className="text-lg font-semibold mb-4">Add Question for: {createdQuiz.title}</legend>

                        {/* Pilihan Tipe Pertanyaan */}
                        <div className="mb-4">
                            <label className="block mb-2">Question Type</label>
                            <select value={questionType} onChange={(e) => setQuestionType(e.target.value)} className="w-full md:w-1/3 border rounded p-2">
                                <option value="multiple_choice">Multiple Choices</option>
                                <option value="essay">Essay</option>
                            </select>
                        </div>

                        {/* Input Pertanyaan */}
                        <div className="mb-4">
                            <label className="block mb-2">Question Text</label>
                            <textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)} className="w-full border rounded p-2" required></textarea>
                        </div>

                        {/* Input Dinamis Berdasarkan Tipe */}
                        {questionType === 'multiple_choice' && (
                            <div className="mb-4 border p-4 rounded">
                                <h3 className="font-semibold mb-2">Answer Choices</h3>
                                {options.map((opt, index) => (
                                    <div key={index} className="flex items-center mb-2">
                                        <input type="radio" name="correctAnswer" value={index} checked={correctAnswerIndex === index} onChange={() => setCorrectAnswerIndex(index)} className="mr-2" />
                                        <input type="text" placeholder={`Pilihan ${index + 1}`} value={opt} onChange={(e) => handleOptionChange(index, e.target.value)} className="w-full border rounded p-2" />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block mb-2">Max Points</label>
                            <input type="number" value={maxPoints} onChange={(e) => setMaxPoints(e.target.value)} className="w-1/4 border rounded p-2" required />
                        </div>

                        <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Add Question'}
                        </button>
                    </form>
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleFinishCreation}
                            className="bg-gray-700 text-white font-bold px-6 py-3 rounded-lg hover:bg-gray-800"
                        >
                            Finish & Back to Dashboard
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CreateQuizPage
