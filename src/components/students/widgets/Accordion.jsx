import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Komponen untuk satu item akordeon
const AccordionItem = ({ title, chapter, content, isOpen, onClick }) => {
  const navigate = useNavigate(); // Hook untuk navigasi

  const handleRead = (chap) => {
    if (chap == "Chapter 1") {
      navigate('/dashboard-student/chapter-1')
    } else if (chap == "Chapter 2") {
      navigate('/dashboard-student/chapter-2')
    } else if (chap == "Chapter 3") {
      navigate('/dashboard-student/chapter-3')
    } else if (chap == "Chapter 4") {
      navigate('/dashboard-student/chapter-4')
    } else if (chap == "Chapter 5") {
      navigate('/dashboard-student/chapter-5')
    }
  }

  return (
    <div className="border-b border-gray-200">
      {/* Bagian Header/Tombol yang bisa diklik */}
      <button
        className="w-full flex justify-between items-center text-left py-4 px-5 focus:outline-none"
        onClick={onClick}
      >
        <span className="text-lg font-medium text-gray-800">{chapter}: {title}</span>
        {/* Ikon panah yang berotasi berdasarkan state `isOpen` */}
        <svg
          className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Bagian Konten yang bisa expand/collapse */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}
      >
        <div className="p-5 bg-gray-50 text-gray-700">
          {content}
        </div>
        <button
          className="text-sm bg-blue-500 text-white px-3 py-1 rounded mt-4"
          onClick={() => handleRead(chapter)}
        >
          Read
        </button>
      </div>
    </div>
  );
};

// Komponen utama Akordeon
const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleItemClick = (index) => {
    // Jika item yang diklik sudah terbuka, tutup. Jika tidak, buka.
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-lg shadow-md overflow-hidden bg-white">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          chapter={item.chapter}
          isOpen={openIndex === index}
          onClick={() => handleItemClick(index)}
        />
      ))}
    </div>
  );
};

export default Accordion;