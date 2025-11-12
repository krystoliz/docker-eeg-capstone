"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CatatanAnda() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setNotes(data);
        } else {
          console.error("Gagal ambil catatan:", data?.message ?? data);
        }
      } catch (err) {
        console.error("Error ambil catatan:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [token]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      const res = await fetch("http://localhost:8000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newNote }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotes((prev) => [data, ...prev]);
        setNewNote("");
      } else {
        console.error("Gagal menambah catatan:", data?.message ?? data);
      }
    } catch (err) {
      console.error("Error tambah catatan:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-2xl shadow-md p-6"
    >
      <h3 className="text-[#2D3570] text-lg font-semibold mb-3">
        Catatan Anda
      </h3>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Tulis catatan baru..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2D3570]/40"
        />
        <button
          onClick={handleAddNote}
          className="bg-[#2D3570] hover:bg-[#1F2755] text-white px-4 py-2 rounded-lg font-medium"
        >
          Tambah
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm italic">Memuat catatan...</p>
      ) : notes.length === 0 ? (
        <p className="text-gray-500 text-sm italic">
          Belum ada catatan hari ini.
        </p>
      ) : (
        <ul className="space-y-3 max-h-64 overflow-y-auto">
          {notes.map((note) => (
            <motion.li
              key={note._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-[#F5F7FB] border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#2D3570]"
            >
              {note.content}
              <span className="block text-xs text-gray-500 mt-1">
                {new Date(note.created_at).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
