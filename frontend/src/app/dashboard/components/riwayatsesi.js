"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RiwayatSesiItem from "./riwayatsesiitem";

export default function RiwayatSesi() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch("http://localhost:8002/api/sessions");
        const json = await res.json();
        if (res.ok && Array.isArray(json)) {
          setSessions(json);
        } else {
          console.error("Format data sesi tidak valid:", json);
        }
      } catch (err) {
        console.error("Gagal mengambil data sesi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-md p-6 w-full"
    >
      <h3 className="text-[#2D3570] text-lg font-semibold mb-4">
        Riwayat Sesi Anda
      </h3>

      {loading ? (
        <p className="text-gray-500 text-sm italic">Memuat riwayat sesi...</p>
      ) : sessions.length === 0 ? (
        <p className="text-gray-500 text-sm italic">Belum ada sesi yang tercatat.</p>
      ) : (
        <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
          {sessions.map((sesi, idx) => (
            <RiwayatSesiItem key={idx} session={sesi} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
