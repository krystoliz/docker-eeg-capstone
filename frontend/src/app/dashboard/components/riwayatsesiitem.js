import React from 'react';
import { FaFileAlt } from "react-icons/fa";

// Use default values in destructuring to prevent crashes
const RiwayatSesiItem = ({ title = 'Sesi', date = '-', emotion = 'Netral' }) => {
  
  const getBadgeStyle = (emo) => {
    // Ensure emo is a string to prevent .toLowerCase() crashes if undefined
    const safeEmo = (emo || 'Netral').toString();
    switch (safeEmo) {
      case 'Positif': return 'bg-[#D1FAE5] text-[#065F46]'; // Green
      case 'Negatif': return 'bg-[#FEE2E2] text-[#991B1B]'; // Red
      default: return 'bg-[#E0E7FF] text-[#3730A3]';       // Blue/Neutral
    }
  };

  return (
    <div className="flex items-center p-3 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer">
      <div className="w-12 h-12 bg-[#E3E7FF] rounded-xl flex items-center justify-center mr-4">
        <FaFileAlt className="text-[#12225B] text-xl" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-[#12225B]">{title}</h4>
        <p className="text-xs text-gray-500 mt-1">{date}</p>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeStyle(emotion)}`}>
        {emotion}
      </div>
    </div>
  );
};

export default RiwayatSesiItem;