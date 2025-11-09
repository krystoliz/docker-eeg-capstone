"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from "@/context/AuthContext";
import axios from 'axios';
// Komponen RekamFoto — menampilkan foto terbaru hasil deteksi EEG
const RekamFoto = () => {
  const { token } = useAuth();
  const [hasSession, setHasSession] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      checkHistory();
    }
  }, [token]);

  const checkHistory = async () => {
    try {
      // We just need to know if ANY history exists to show a photo
      const res = await axios.get('http://localhost:8001/auth/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.length > 0) {
        setHasSession(true);
      }
    } catch (err) {
      console.error("Failed to check history for photo:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[30px] p-6 shadow-sm flex flex-col lg:col-span-4">
      <h2 className="font-bold text-xl text-[#12225B] mb-4">Hasil Rekaman Foto</h2>
      
      <div className="flex-1 flex items-center justify-center min-h-[200px] bg-[#F5F7FB] rounded-3xl overflow-hidden relative">
        {loading ? (
           <p className="text-gray-400 text-sm italic">Memuat...</p>
        ) : hasSession ? (
           // --- PLACEHOLDER IMAGE ---
           // Since we don't have real photo capture yet, we use a static image
           // to simulate what it would look like.
           <Image
             src="/stasiun.jpeg" // Make sure this image exists in your public folder!
             alt="Rekaman Foto"
             fill
             className="object-cover"
           />
           // -------------------------
        ) : (
           <div className="text-center px-4">
             <p className="text-gray-400 text-sm italic">Belum ada sesi terekam.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default RekamFoto;