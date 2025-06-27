// src/components/students/BookSectionPage.jsx

import React, { useState, useEffect } from 'react';
import { databases, storage } from '../../appwrite';

// --- GANTI DENGAN ID ANDA ---
const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID; // ID bucket yang Anda buat di Langkah 1
const BOOKS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_BOOKS_COLLECTION_ID; 
// ----------------------------

const BookSectionPage = () => {
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await databases.listDocuments(DB_ID, BOOKS_COLLECTION_ID);
                setBooks(response.documents);
            } catch (error) {
                console.error("Error fetching book:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBooks();
    }, []);

    if (isLoading) {
        return <div className="p-8 text-center">Loading book collection...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Collection of Books</h1>
            {books.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {books.map(book => (
                        <div key={book.$id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                            <div className="p-4 flex flex-col flex-grow">
                                <h2 className="text-lg font-bold">{book.title}</h2>
                                <p className="text-sm text-gray-600 mb-2">by. {book.author}</p>
                                <p className="text-sm text-gray-700 flex-grow">{book.description || 'Tidak ada deskripsi.'}</p>
                                <a 
                                    href={storage.getFileDownload(BUCKET_ID, book.pdfFileId)}
                                    className="mt-4 w-full bg-green-600 text-white text-center font-bold py-2 rounded-lg hover:bg-green-700"
                                >
                                    Download PDF
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No books available yet.</p>
            )}
        </div>
    );
};

export default BookSectionPage;