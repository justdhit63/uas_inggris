import React, { useState, useEffect } from 'react'
import { databases } from '../appwrite'; 
import { ID } from 'appwrite';


const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const Test = () => {
    const [userTest, setUserTest] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchUserTest =  async () => {
        setLoading(true);
        try {
            const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
            console.log('Data yang diambil:', response.documents);
            setUserTest(response.documents);
        } catch (error) {
            console.error('Gagal mengambil data:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUserTest();
    }, []);

  return (
    <div>
      
    </div>
  )
}

export default Test
