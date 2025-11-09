"use client";
import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaRegStickyNote } from 'react-icons/fa';

const RecordsSection = ({ historyData = [] }) => {
  // --- STATE FOR PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- PAGINATION LOGIC ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = historyData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(historyData.length / itemsPerPage);

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // --- HELPER FUNCTIONS ---
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString('id-ID', {
      hour: '2-digit', minute: '2-digit'
    }).replace('.', ':');
  };

  const getEmotionBadge = (emotion) => {
    let label = 'Netral';
    let style = 'bg-[#E3E7FF] text-[#3730A3]'; // Default Blue

    if (emotion === 'Positive') {
      label = 'Positif';
      style = 'bg-[#D1FAE5] text-[#065F46]'; // Green
    } else if (emotion === 'Negative') {
      label = 'Negatif';
      style = 'bg-[#FEE2E2] text-[#991B1B]'; // Red
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${style}`}>
        {label}
      </span>
    );
  };

  // --- RENDER ---
  return (
    <div className="bg-white rounded-[30px] shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="font-bold text-xl text-[#12225B]">Daftar Rekaman</h2>
      </div>

      {historyData.length === 0 ? (
        <div className="p-12 text-center text-gray-400 italic">
          Belum ada data riwayat.
        </div>
      ) : (
        <>
          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8FAFC] text-[#12225B] text-sm font-bold">
                <tr>
                  <th className="px-6 py-4 text-left">Tanggal</th>
                  <th className="px-6 py-4 text-left">Waktu</th>
                  <th className="px-6 py-4 text-left">Emosi</th>
                  <th className="px-6 py-4 text-left">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentItems.map((item) => (
                  <tr key={item._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-[#12225B] font-medium">
                      {formatDate(item.savedAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatTime(item.savedAt)}
                    </td>
                    <td className="px-6 py-4">
                      {getEmotionBadge(item.classified_emotion)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {item.note ? (
                        <div className="flex items-center" title={item.note}>
                          <FaRegStickyNote className="mr-2 text-blue-300 flex-shrink-0" />
                          <span className="truncate">{item.note}</span>
                        </div>
                      ) : (
                        <span className="text-gray-300 italic">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="p-4 flex items-center justify-between border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Halaman <span className="font-bold">{currentPage}</span> dari {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <FaChevronLeft className="text-[#12225B]" />
                </button>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <FaChevronRight className="text-[#12225B]" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecordsSection;