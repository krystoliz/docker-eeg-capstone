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
