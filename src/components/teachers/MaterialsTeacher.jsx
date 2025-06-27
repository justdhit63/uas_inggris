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

const MaterialsTeacher = () => {
    const [materials, setMaterials] = useState([]);
    const [formData, setFormData] = useState({
        chapter: "",
        title: "",
        content: "",
    });
    const [editId, setEditId] = useState(null);
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
    }, [])


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const resetForm = () => {
        setFormData({ chapter: "", title: "", content: "" });
        setEditId(null);
    }

    const handleAdd = async () => {
        if (!formData.title || !formData.chapter || !formData.content) return;
        try {
            const response = await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                formData
            );
            setMaterials([...materials, response]);
            resetForm();
        } catch (error) {
            console.error("Error adding material: ", error);
        }
    };

    const handleEdit = (material) => {
        setEditId(material.$id);
        setFormData({
            chapter: material.chapter,
            title: material.title,
            content: material.content,
        });
    };

    const handleUpdate = async () => {
        if (!editId) return;
        try {
            const response = await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                editId,
                formData
            );
            setMaterials(
                materials.map((item) => (item.$id === editId ? response : item))
            );
        } catch (error) {
            console.error("Error updating material: ", error);
        }
    };

    const handleDelete = async (documentId) => {
        try {
            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, documentId);
            setMaterials(materials.filter((item) => item.$id !== documentId));
            if (editId === documentId) resetForm();
        } catch (error) {
            console.error("Error deleting material: ", error);
        }
    };

    //   const resetForm = () => {
    //     setFormData({
    //       title: "",
    //       description: "",
    //       date: "",
    //       file: null,
    //     });
    //     setEditId(null);
    //   };

    return (
        <div className="w-full p-6">
            {/* Main Content */}
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        {editId ? "Edit Material" : "Add New Material"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <input type="text" name="chapter" placeholder="Chapter" value={formData.chapter} onChange={handleInputChange} className="border rounded px-4 py-2 w-full" />
                        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} className="border rounded px-4 py-2 w-full" />
                        <textarea name="content" placeholder="Content" value={formData.content} onChange={handleInputChange} className="border rounded px-4 py-2 w-full md:col-span-3" rows="4"></textarea>
                    </div>
                    <div className="mt-4 flex gap-4">
                        <button
                            onClick={editId ? handleUpdate : handleAdd}
                            className={`${editId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-purple-600 hover:bg-purple-700"
                                } text-white px-6 py-2 rounded`}
                        >
                            {editId ? "Update Material" : (
                                <>
                                    <FaPlus className="inline mr-2" />
                                    Add Material
                                </>
                            )}
                        </button>
                        {editId && (
                            <button
                                onClick={resetForm}
                                className="text-gray-600 border border-gray-400 px-6 py-2 rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chapter</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (<tr><td colSpan="4" className="text-center py-6">Loading materials...</td></tr>) :
                                materials.length > 0 ? (
                                    materials.map((item) => (
                                        <tr key={item.$id}> {/* DIUBAH: key menggunakan item.$id */}
                                            <td className="px-6 py-4">{item.chapter}</td>
                                            <td className="px-6 py-4">{item.title}</td>
                                            <td className="px-6 py-4 truncate max-w-sm">{item.content}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-yellow-600 mr-3" onClick={() => handleEdit(item)}> <FaPencilAlt /> </button>
                                                <button className="text-red-600" onClick={() => handleDelete(item.$id)}> <FaTrash /> </button> {/* DIUBAH: kirim item.$id */}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="text-center py-6">No materials added yet.</td></tr>
                                )}
                        </tbody>
                    </table>
                </div>
        </div>
    );
};

export default MaterialsTeacher;
