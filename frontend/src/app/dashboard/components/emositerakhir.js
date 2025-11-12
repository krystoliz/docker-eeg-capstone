// src/app/dashboard/components/emositerakhir.js
"use client";
import React, { useState, useEffect, useMemo } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useAuth } from "@/context/AuthContext";
// import { motion } from "framer-motion";

/*
  Komponen EmosiTerakhir — menampilkan emosi terakhir terdeteksi dari EEG.
  Props:
    - emotion: string ("Positif" | "Netral" | "Negatif")
    - time: string (waktu deteksi)
    - date: string (tanggal deteksi)
    - firstName: string (nama depan user)
  Semua style & layout disalin persis dari file page.js.
*/

export default function EmosiTerakhir({ emotion, time, date, firstName }) {
  const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  // --- WIRING START ---
  const [emotionData, setEmotionData] = useState(null);
  const { token } = useAuth();
  // 1. Setup WebSocket URL with token
  const websocketUrl = useMemo(() => {
    return token ? `ws://localhost:8000/ws?token=${token}` : null;
  }, [token]);

  // 2. Connect to WebSocket
  const { lastMessage, readyState } = useWebSocket(websocketUrl, {
    shouldReconnect: () => true,
  });

  // 3. Listen for incoming messages
  useEffect(() => {
    if (lastMessage !== null) {
      const data = JSON.parse(lastMessage.data);
      setEmotionData(data);
    }
  }, [lastMessage]);

  // 4. Dynamic Styling based on emotion
  let bgColor = "bg-[#E3E7FF]"; // Default (Neutral/Waiting) - matches your design's soft blue
  let emotionText = "Menunggu...";

  if (readyState !== ReadyState.OPEN) {
     emotionText = "Menghubungkan...";
  } else if (emotionData) {
    const emotion = emotionData.classified_emotion;
    if (emotion === "Positive") {
      bgColor = "bg-[#D1FAE5]"; // Soft Green
      emotionText = "Positif";
    } else if (emotion === "Negative") {
      bgColor = "bg-[#FEE2E2]"; // Soft Red
      emotionText = "Negatif";
    } else {
       bgColor = "bg-[#E3E7FF]"; // Soft Blue for Neutral
       emotionText = "Netral";
    }
  }
  // --- WIRING END ---
  return (
    
    <div className={`rounded-[30px] p-8 shadow-sm ${bgColor} transition-all duration-500 flex flex-col justify-between min-h-[220px]`}>
      <div>
        <h2 className="font-bold text-xl text-[#12225B]">Emosi Terakhir</h2>
        <p className="text-[#12225B] opacity-60 text-sm mt-1">
          {/* Show today's date in Indonesian format */}
          {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
      
      <div>
        <h3 className="text-5xl font-extrabold text-[#12225B] tracking-tight">
          {emotionText}
        </h3>
      </div>
    </div>
  );

}
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSmile, FaMeh, FaFrown } from "react-icons/fa";

export default function EmosiTerakhir({ fullName }) {
  const [emotion, setEmotion] = useState(null);
  const [loading, setLoading] = useState(true);

  const firstName = fullName?.split(" ")[0] || "User";

  useEffect(() => {
    const fetchEmotion = async () => {
      try {
        const res = await fetch("http://localhost:8002/api/eeg-latest");
        const data = await res.json();
        if (res.ok) {
          setEmotion(data.emotion);
        } else {
          console.error("Gagal ambil data emosi:", data);
        }
      } catch (err) {
        console.error("Error fetch emotion:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmotion();
  }, []);

  const emotionColor = {
    Positif: "text-green-600 bg-green-50",
    Netral: "text-yellow-600 bg-yellow-50",
    Negatif: "text-red-600 bg-red-50",
  };

  const emotionIcon = {
    Positif: <FaSmile className="text-green-500 text-3xl" />,
    Netral: <FaMeh className="text-yellow-500 text-3xl" />,
    Negatif: <FaFrown className="text-red-500 text-3xl" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row justify-between items-center"
    >
      <div>
        <h3 className="text-[#2D3570] text-lg font-semibold">
          Halo, {firstName}!
        </h3>
        <p className="text-gray-600 text-sm mt-1">
          Ini hasil emosi terakhir kamu yang terdeteksi oleh sistem.
        </p>
      </div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`flex items-center gap-3 mt-4 md:mt-0 px-5 py-3 rounded-xl shadow-inner ${emotionColor[emotion] || "bg-gray-50 text-gray-600"
          }`}
      >
        {loading ? (
          <p className="italic text-gray-500 text-sm">Memuat...</p>
        ) : emotion ? (
          <>
            {emotionIcon[emotion]}
            <span className="text-base font-medium">{emotion}</span>
          </>
        ) : (
          <p className="italic text-gray-500 text-sm">
            Tidak ada data emosi terbaru
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
