// src/components/teachers/UploadBookPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { databases, storage } from '../../appwrite';
import { ID } from 'appwrite';

// --- GANTI DENGAN ID ANDA ---
const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID; // ID bucket yang Anda buat di Langkah 1
const BOOKS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_BOOKS_COLLECTION_ID;  // ID koleksi yang Anda buat di Langkah 1
// ----------------------------

const UploadBookPage = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    // const [coverFile, setCoverFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !author || !pdfFile) {
            alert('All fields are required.');
            return;
        }
        setIsLoading(true);

        try {
            // Langkah 1: Upload Cover Image ke Storage
            // const coverImage = await storage.createFile(BUCKET_ID, ID.unique(), coverFile);
            
            // Langkah 2: Upload File PDF ke Storage
            const pdfDocument = await storage.createFile(BUCKET_ID, ID.unique(), pdfFile);

            // Langkah 3: Simpan semua informasi (termasuk ID file) ke Database
            await databases.createDocument(
                DB_ID,
                BOOKS_COLLECTION_ID,
                ID.unique(),
                {
                    title,
                    author,
                    description,
                    pdfFileId: pdfDocument.$id
                }
            );

            alert('The book has been successfully uploaded!');
            navigate('/dashboard'); // Arahkan kembali ke dashboard guru

        } catch (error) {
            console.error('Failed to upload the book:', error);
            alert('An error occurred while uploading the book.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Upload a New Book</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
                <div className="mb-4">
                    <label className="block mb-2 font-semibold">Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-semibold">Author</label>
                    <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full p-2 border rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-semibold">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" rows="4"></textarea>
                </div>
                <div className="mb-6">
                    <label className="block mb-2 font-semibold">Book File (PDF)</label>
                    <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100" required />
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400">
                    {isLoading ? 'Uploading...' : 'Save'}
                </button>
            </form>
        </div>
    );
};

export default UploadBookPage;