"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import axios from 'axios';
import HeaderSection from "./components/HeaderSection";
import SummarySection from "./components/SummarySection";
import RecordsSection from "./components/RecordsSection";

export default function RiwayatDetailPage() {
  const { token } = useAuth();
  const [fullHistory, setFullHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchFullHistory();
    }
  }, [token]);

  const fetchFullHistory = async () => {
    try {
      // Fetch history from backend
      const res = await axios.get('http://localhost:8001/auth/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFullHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch full history:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC] text-gray-400 italic">
        Memuat riwayat lengkap...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Pass data down to components */}
        <HeaderSection />
        <SummarySection historyData={fullHistory} />
        <RecordsSection historyData={fullHistory} />
      </div>
    </div>
  );
}