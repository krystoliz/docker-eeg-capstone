"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaTrashAlt, FaTimes, FaChevronDown } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function RiwayatSesi() {
  const router = useRouter();
  const { token } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(null);

  // Animation variants
  const fadeUp = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } };

  // Mappings for UI assets
  const emojiImages = {
    Positif: "/positif.png",
    Negatif: "/negatif.png",
    Netral: "/netral.png",
  };

  // 1. Fetch Data on Load
  useEffect(() => {
    if (token) {
      fetchHistory();
    }
  }, [token]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:8001/auth/history', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Transform backend data to match the complex UI's expected format
      const formattedData = res.data.map((item) => {
        const dateObj = new Date(item.savedAt);
        
        // Translate emotion
        let moodStr = "Netral";
        if (item.classified_emotion === "Positive") moodStr = "Positif";
        if (item.classified_emotion === "Negative") moodStr = "Negatif";

        return {
          _id: item._id, // IMPORTANT: Keep real DB ID
          mood: moodStr,
          note: item.note || "", 
          tempNote: item.note || "",
          showInput: false,
          // Placeholder photo until we have real ones
          photo: "/flowers.png", 
          timestamp: dateObj,
          // ISO date for grouping
          isoDate: dateObj.toISOString().slice(0, 10),
          // Formatted time and date for display
          time: dateObj.toLocaleTimeString("id-ID", { hour12: false, hour: '2-digit', minute: '2-digit' }).replace('.', ':'),
          date: dateObj.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }),
        };
      });

      setSessions(formattedData);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Event Handlers for Interactive UI
  const handleToggleInput = (index) => {
    const updated = [...sessions];
    updated[index].showInput = !updated[index].showInput;
    // Reset temp note if canceling
    if (!updated[index].showInput) {
        updated[index].tempNote = updated[index].note;
    }
    setSessions(updated);
  };

  const handleTempNoteChange = (index, val) => {
    const updated = [...sessions];
    updated[index].tempNote = val;
    setSessions(updated);
  };

  // NOTE: In a real app, you'd want an API endpoint to update just the note of a specific session.
  // For now, we'll just update the local state visually as we don't have a PATCH /history/:id endpoint yet.
  const handleSaveNote = async (index) => {
    const updated = [...sessions];
    updated[index].note = updated[index].tempNote;
    updated[index].showInput = false;
    setSessions(updated);
    // TODO: Add API call here to save note to backend:
    // await axios.patch(`.../history/${updated[index]._id}`, { note: updated[index].note }, ...)
  };

  const handleDeleteNote = async (index) => {
    if (!confirm("Hapus catatan ini?")) return;
    const updated = [...sessions];
    updated[index].note = "";
    updated[index].tempNote = "";
    setSessions(updated);
    // TODO: Add API call here to delete note from backend
  };

  const handleShowPhoto = (index) => setCurrentPhotoIndex(index);
  const handleClosePhoto = () => setCurrentPhotoIndex(null);

  // 3. Grouping Logic (Group by Date)
  const grouped = sessions.reduce((acc, item, idx) => {
    if (!acc[item.isoDate]) acc[item.isoDate] = { items: [], firstIndex: idx };
    // Store the original index so our handlers above work correctly
    acc[item.isoDate].items.push({ ...item, originalIndex: idx });
    return acc;
  }, {});
  const sortedDateKeys = Object.keys(grouped).sort((a, b) => (a < b ? 1 : -1));

  const formatHeaderDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long", day: "2-digit", month: "long", year: "numeric",
      });
    } catch { return iso; }
  };

  // 4. The Complex JSX
  return (
    <div className="bg-white rounded-[30px] p-6 shadow-sm flex flex-col max-h-[600px]"> {/* Added max-h for scrolling */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[#12225B] font-bold text-xl">
          Riwayat Sesi
        </h3>
        <button
          onClick={() => router.push("/dashboard/riwayatdetail")}
          className="text-sm text-white bg-[#12225B] px-4 py-2 rounded-xl hover:bg-[#0c1844] shadow transition flex items-center"
        >
          📊 Lihat Detail
        </button>
      </div>

      <div className="relative flex-1 overflow-hidden"> {/* Container for scrollable area */}
        {loading ? (
             <p className="text-gray-400 text-center italic mt-10">Memuat riwayat...</p>
        ) : sessions.length === 0 ? (
             <p className="text-gray-400 text-center italic mt-10">Belum ada sesi terekam.</p>
        ) : (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.28, delay: 0.05 }}
          className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300"
        >
          {sortedDateKeys.map((iso) => (
            <div key={iso} className="mb-6">
              {/* Sticky Date Header */}
              <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 py-2 mb-2">
                <span className="bg-[#F5F7FB] text-[#12225B] text-xs font-bold px-3 py-1 rounded-full border border-[#E0E5F5]">
                  {formatHeaderDate(iso)}
                </span>
              </div>

              {/* Session Items for this Date */}
              {grouped[iso].items.map((s) => (
                <div key={s._id} className="bg-[#F8FAFC] rounded-2xl p-4 mb-3 border border-gray-100 hover:border-blue-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      {/* Emotion Icon */}
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <img src={emojiImages[s.mood]} alt={s.mood} className="w-8 h-8 object-contain" />
                      </div>
                      <div>
                        <p className="font-bold text-[#12225B] text-base">{s.mood}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {s.time}
                        </p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleInput(s.originalIndex)}
                        className="p-2 text-gray-400 hover:text-[#12225B] hover:bg-white rounded-lg transition"
                        title="Catatan"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleShowPhoto(s.originalIndex)}
                        className="text-[#12225B] text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
                      >
                        Lihat Foto
                      </button>
                    </div>
                  </div>

                  {/* Note Input Area */}
                  {s.showInput && (
                    <div className="mt-4 bg-white rounded-xl border border-[#E0E5F5] p-3 animate-in fade-in slide-in-from-top-2">
                      <textarea
                        value={s.tempNote}
                        onChange={(e) => handleTempNoteChange(s.originalIndex, e.target.value)}
                        placeholder="Tulis catatan untuk sesi ini..."
                        className="w-full text-[#12225B] text-sm outline-none resize-none placeholder-gray-300"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-gray-50">
                        <button
                           onClick={() => handleToggleInput(s.originalIndex)}
                           className="text-xs text-gray-500 px-3 py-1.5 hover:bg-gray-100 rounded-md transition"
                        >
                           Batal
                        </button>
                        <button
                          onClick={() => handleSaveNote(s.originalIndex)}
                          className="bg-[#12225B] text-white px-4 py-1.5 rounded-md text-xs font-bold hover:bg-[#0c1844] transition"
                        >
                          Simpan
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Saved Note Display */}
                  {s.note && !s.showInput && (
                    <div className="mt-3 flex justify-between items-start bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                      <p className="text-sm text-[#12225B] flex-1 italic">&ldquo;{s.note}&rdquo;</p>
                      <button
                        onClick={() => handleDeleteNote(s.originalIndex)}
                        className="text-red-400 hover:text-red-600 ml-3 p-1"
                        title="Hapus Catatan"
                      >
                        <FaTrashAlt size={12} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </motion.div>
        )}
        
        {/* Scroll indicator if content is long */}
        {!loading && sessions.length > 3 && (
             <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none flex justify-center items-end pb-1">
               <FaChevronDown className="text-gray-300 animate-bounce" size={16} />
             </div>
        )}
      </div>

      {/* Photo Modal */}
      <AnimatePresence>
        {currentPhotoIndex !== null && sessions[currentPhotoIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4"
            onClick={handleClosePhoto} // Close on background click
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()} // Prevent close on content click
              className="bg-white rounded-3xl shadow-2xl p-2 w-full max-w-md relative overflow-hidden"
            >
               <div className="relative">
                  <img
                    src={sessions[currentPhotoIndex].photo}
                    alt={`Foto Sesi`}
                    className="w-full aspect-[4/3] object-cover rounded-2xl"
                  />
                  <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent flex justify-between items-start">
                     <span className="text-white font-medium drop-shadow-md">
                        {sessions[currentPhotoIndex].time} • {sessions[currentPhotoIndex].mood}
                     </span>
                     <button
                        onClick={handleClosePhoto}
                        className="bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 rounded-full transition"
                      >
                        <FaTimes size={16} />
                      </button>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}