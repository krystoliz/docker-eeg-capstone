"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import RiwayatSesiItem from './riwayatsesiitem';
import { useAuth } from "@/context/AuthContext";
import axios from 'axios';

const RiwayatSesi = () => {
  const { token } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

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
      // Take only the latest 3 sessions for the dashboard view
      // Ensure res.data is an array before slicing
      setSessions(Array.isArray(res.data) ? res.data.slice(0, 3) : []);
    } catch (err) {
      console.error("Failed to fetch history:", err);
      setSessions([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).replace('.', ':');
    } catch (e) {
      return '-';
    }
  };

  return (
    <div className="bg-white rounded-[30px] p-6 shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-xl text-[#12225B]">Riwayat Sesi</h2>
        <Link href="/dashboard/riwayatdetail" className="text-sm text-blue-500 font-semibold hover:underline">
          Lihat Semua
        </Link>
      </div>

      <div className="flex flex-col space-y-4 min-h-[200px]">
        {loading ? (
           <p className="text-gray-400 text-center italic flex-1 flex items-center justify-center">
             Memuat riwayat...
           </p>
        ) : sessions.length > 0 ? (
          sessions.map((item) => {
            // --- ROBUST DATA MAPPING ---
            if (!item) return null;
            const rawEmotion = item.classified_emotion || 'Neutral';
            const emotionID = rawEmotion === 'Positive' ? 'Positif' : 
                              rawEmotion === 'Negative' ? 'Negatif' : 'Netral';
            // ---------------------------

            return (
              <RiwayatSesiItem 
                key={item._id || Math.random()}
                title={`Sesi ${emotionID}`}
                date={formatDate(item.savedAt)}
                emotion={emotionID}
              />
            );
          })
        ) : (
           <p className="text-gray-400 text-center italic flex-1 flex items-center justify-center">
             Belum ada sesi terekam.
           </p>
        )}
      </div>
    </div>
  );
};

export default RiwayatSesi;