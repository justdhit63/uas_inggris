import React, { useState, useEffect } from "react";
import {
    FaPlus,
    FaPencilAlt,
    FaTrash,
    FaFileAlt,
    FaBookOpen,
    FaClipboardList,
    FaSignOutAlt,
    FaHome,
} from "react-icons/fa";
import { MdCalendarToday } from "react-icons/md";
import { BsPeopleFill } from "react-icons/bs";
import { databases } from "../../appwrite";
import { ID } from 'appwrite';
import Accordion from "./widgets/Accordion";

const MaterialsStudent = () => {
    const [materials, setMaterials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
    const COLLECTION_ID = import.meta.env.VITE_APPWRITE_MATERIALS_COLLECTION_ID

    const getMaterials = async () => {
        try {
            const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
            setMaterials(response.documents);
        } catch (error) {
            console.error("Error fetching materials", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getMaterials();
    }, [getMaterials()])

    const accordionItems = materials.map(material => ({
        title: `${material.chapter}: ${material.title}`,
        content: material.content
    }));

    return (
        <div className="w-full p-12">
            {/* Main Content */}
            <h2 className="text-2xl font-bold mb-6">Learning Materials</h2>
            <div className="bg-gray-100 rounded-lg shadow overflow-auto w-full p-6">
                {isLoading ? (<tr><td colSpan="4" className="text-center py-6">Loading materials...</td></tr>) : (<Accordion items={accordionItems} />)}
                
            </div>
        </div>
    );
};

export default MaterialsStudent;
