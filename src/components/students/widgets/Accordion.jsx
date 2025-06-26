import React, { useState } from 'react';

// Komponen untuk satu item akordeon
const AccordionItem = ({ title, content, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200">
      {/* Bagian Header/Tombol yang bisa diklik */}
      <button
        className="w-full flex justify-between items-center text-left py-4 px-5 focus:outline-none"
        onClick={onClick}
      >
        <span className="text-lg font-medium text-gray-800">{title}</span>
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
          isOpen={openIndex === index}
          onClick={() => handleItemClick(index)}
        />
      ))}
    </div>
  );
};

export default Accordion;