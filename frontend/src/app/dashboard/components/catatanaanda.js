"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function CatatanAnda() {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);

  // Animation variant matching your other components
  const fadeUp = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

  // Base URL for notes - adjusting to likely backend structure
  // You might need to update this if your backend route is different (e.g., /api/notes)
  const NOTES_API_URL = 'http://localhost:8001/notes'; 

  // 1. Fetch Notes on Load
  useEffect(() => {
    if (token) {
      fetchNotes();
    }
  }, [token]);

  const fetchNotes = async () => {
    try {
      // Assuming GET /notes returns an array of notes for the user
      const res = await axios.get(NOTES_API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(res.data);
    } catch (err) {
      console.error("Gagal mengambil catatan:", err);
      // Fallback to empty if API fails/doesn't exist yet
      setNotes([]); 
    }
  };

  // 2. Handle Add Note
  const handleAddNote = async () => {
    if (!newNote.trim()) return; // Don't add empty notes

    setLoading(true);
    try {
      // Optimistic update (show it immediately before server confirms)
      const tempId = Date.now().toString();
      const tempNote = { _id: tempId, noteContent: newNote };
      setNotes([...notes, tempNote]);
      setNewNote(""); // Clear input

      // Send to backend
      await axios.post(NOTES_API_URL, 
        { noteContent: newNote }, 
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Refresh to get real ID from server
      fetchNotes();
    } catch (err) {
      console.error("Gagal menambah catatan:", err);
      alert("Gagal menyimpan catatan.");
      fetchNotes(); // Revert on error
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Delete Note
  const handleDeleteMainNote = async (id) => {
    if (!confirm("Hapus catatan ini?")) return;

    try {
      // Optimistic update
      setNotes(notes.filter((n) => n._id !== id));

      // Send delete to backend
      await axios.delete(`${NOTES_API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Gagal menghapus catatan:", err);
      alert("Gagal menghapus catatan.");
      fetchNotes(); // Revert on error
    }
  };

  // --- YOUR REQUESTED JSX ---
  return (
    <motion.div 
      variants={fadeUp} 
      initial="hidden" 
      animate="visible" 
      transition={{ duration: 0.28, delay: 0.06 }}
      className="h-full" // Ensure it takes height if in a grid
    >
      <h3 className="text-[#2D3570] font-semibold mb-3 text-lg">Catatan Anda</h3>
      <div className="bg-white rounded-[30px] shadow-sm p-6 flex flex-col h-auto max-h-[500px]">
        
        {/* Notes List Area */}
        <div className="flex-1 overflow-y-auto mb-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div key={note._id} className="flex items-center justify-between bg-[#F5F7FB] rounded-xl p-4 mb-3">
                <p className="text-sm text-[#2D3570] flex-1 break-words">{note.noteContent}</p>
                <button
                  onClick={() => handleDeleteMainNote(note._id)}
                  className="text-[#FF5A5A] hover:text-red-700 ml-3 p-2 transition-colors"
                  aria-label="Delete note"
                >
                  <FaTrashAlt size={14} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm text-center italic py-4">
              Belum ada catatan tambahan.
            </p>
          )}
        </div>

        {/* Input Area */}
        <div>
            <p className="text-[#2D3570] font-semibold mb-2 text-sm">Berikan catatan tambahan disini</p>

            <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Ketik disini..."
            className="w-full border-2 border-[#E0E5F5] rounded-xl p-3 text-sm outline-none focus:border-[#2D3570] transition-colors resize-none h-24 mb-3 text-[#2D3570] placeholder-gray-400"
            disabled={loading}
            />

            <button
            onClick={handleAddNote}
            disabled={loading}
            className={`bg-[#2D3570] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#1F2755] shadow-sm text-sm transition-all w-full sm:w-auto ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
            {loading ? 'Menyimpan...' : 'Tambah'}
            </button>
        </div>
      </div>
    </motion.div>
  );
}