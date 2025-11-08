"use client";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
// ===== GLOBAL STORE untuk sinkronisasi dengan RiwayatSesi =====
let globalSessions = [];

export const setGlobalSessions = (sessions) => {
  globalSessions = sessions;
  // 🟢 Simpan juga ke sessionStorage agar tetap sinkron antar halaman
  try {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("globalSessions", JSON.stringify(sessions));
    }
  } catch (e) {
    console.warn("Gagal simpan sessionStorage di rekapemosi:", e);
  }
};

// ===== DUMMY EEG REALISTIC: 7 HARI × 30 MENIT/HARI × 10 DETIK =====
const generateDummyRiwayat = () => {
  const moods = ["Positif", "Netral", "Negatif"];
  const now = new Date();
  const intervalMs = 10000; // tiap 10 detik
  const durationPerDay = 30 * 60 * 1000; // 30 menit per hari
  const entriesPerDay = durationPerDay / intervalMs; // 180 entri per hari

  const data = [];
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const dayDate = new Date(now);
    dayDate.setDate(now.getDate() - dayOffset);
    const baseTime = new Date(dayDate);
    baseTime.setHours(9, 0, 0, 0); // alat aktif 09.00–09.30

    for (let i = 0; i < entriesPerDay; i++) {
      const timestamp = new Date(baseTime.getTime() + i * intervalMs);
      const mood = moods[Math.floor(Math.random() * moods.length)];
      data.push({
        mood,
        date: timestamp.toLocaleDateString("id-ID"),
        timestamp,
      });
    }
  }

  // urutkan terbaru → lama
  return data.sort((a, b) => b.timestamp - a.timestamp);
};

const dummyRiwayat = generateDummyRiwayat();

export default function RekapEmosi() {
  const fadeUp = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

  const [selectedRange, setSelectedRange] = useState("Rekap Emosi 1 Hari");
  const [showDropdown, setShowDropdown] = useState(false);
  const [sessionsData, setSessionsData] = useState(globalSessions.length ? globalSessions : dummyRiwayat);

  // ===== Sinkronisasi real-time dengan globalSessions & sessionStorage =====
  useEffect(() => {
    const syncData = () => {
      try {
        const stored = typeof window !== "undefined" ? sessionStorage.getItem("globalSessions") : null;
        const parsed = stored ? JSON.parse(stored) : [];
        if (parsed.length && parsed.length !== sessionsData.length) {
          setSessionsData(parsed);
        } else if (globalSessions.length && globalSessions.length !== sessionsData.length) {
          setSessionsData(globalSessions);
        }
      } catch (e) {
        console.warn("Sync rekapemosi error:", e);
      }
    };

    syncData(); // sync langsung di awal
    const interval = setInterval(syncData, 2000);
    return () => clearInterval(interval);
  }, [sessionsData]);

  // ===== Hitung persentase emosi berdasarkan range =====
  const data = useMemo(() => {
    const now = new Date();
    let days = 1;
    if (selectedRange.includes("3")) days = 3;
    if (selectedRange.includes("7")) days = 7;

    const startDate = new Date(now);
    startDate.setDate(now.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);

    const rangeData = sessionsData.filter(
      (s) => new Date(s.timestamp) >= startDate && new Date(s.timestamp) <= now
    );

    const counts = { Positif: 0, Netral: 0, Negatif: 0 };
    rangeData.forEach((s) => counts[s.mood]++);

    const total = rangeData.length || 1;

    return [
      { name: "Positif", value: Math.round((counts.Positif / total) * 100), color: "#FFD84D" },
      { name: "Netral", value: Math.round((counts.Netral / total) * 100), color: "#8CA7FF" },
      { name: "Negatif", value: Math.round((counts.Negatif / total) * 100), color: "#FF5A5A" },
    ];
  }, [selectedRange, sessionsData]);
  // --- WIRING START ---
  const { token } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchHistoryData();
    }
  }, [token]);

  const fetchHistoryData = async () => {
    try {
      // Reuse the existing history endpoint
      const res = await axios.get('http://localhost:8001/auth/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      processChartData(res.data);
    } catch (err) {
      console.error("Failed to fetch history for chart:", err);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (data) => {
    // Count occurrences of each emotion
    const counts = { Positive: 0, Negative: 0, Neutral: 0 };
    data.forEach(item => {
      const emotion = item.classified_emotion;
      if (counts[emotion] !== undefined) {
        counts[emotion]++;
      }
    });

    // Format for Recharts
    const formattedData = [
      { name: 'Positif', value: counts.Positive, color: '#A7D7C5' }, // Soft Green
      { name: 'Negatif', value: counts.Negative, color: '#F5A9A9' }, // Soft Red
      { name: 'Netral', value: counts.Neutral, color: '#B8C0EC' },  // Soft Blue
    ].filter(item => item.value > 0); // Only show emotions that have data

    setChartData(formattedData);
  };
  // --- WIRING END ---

return (
    <div className="bg-white rounded-[30px] p-6 shadow-sm flex flex-col h-[300px]">
      <h2 className="font-bold text-xl text-[#12225B] mb-4">Rekap Emosi</h2>
      
      <div className="flex-1 w-full min-h-0">
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            Memuat data...
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                itemStyle={{ color: '#12225B' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                formatter={(value) => <span className="text-[#12225B] text-sm">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            Belum ada data sesi.
          </div>
        )}
      </div>
    </div>
  );
}
