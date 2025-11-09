"use client";
// --- ENSURE TOOLTIP IS IMPORTED HERE ---
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
// ---------------------------------------
import {useAuth} from "@/context/AuthContext";
import React, { useEffect, useState } from 'react';

const RekapEmosi = () => {
  // --- WIRING START ---
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchHistoryData();
    }
  }, [token]);

  const fetchHistoryData = async () => {
    try {
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

  const processChartData = (historyData) => {
    const counts = { Positive: 0, Negative: 0, Neutral: 0 };
    historyData.forEach(item => {
      // Ensure we match the exact string from the backend
      if (counts[item.classified_emotion] !== undefined) {
        counts[item.classified_emotion]++;
      }
    });

    const formattedData = [
      { name: 'Positif', value: counts.Positive, color: '#A7D7C5' },
      { name: 'Negatif', value: counts.Negative, color: '#F5A9A9' },
      { name: 'Netral', value: counts.Neutral, color: '#B8C0EC' },
    ].filter(item => item.value > 0);

    setData(formattedData);
  };
  // --- WIRING END ---
  // Custom Legend to match screenshot (on the right side)
  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="flex flex-col justify-center space-y-2 ml-4">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center text-[#12225B] text-sm font-medium">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
            {entry.value}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-white rounded-[30px] p-6 shadow-sm flex flex-col h-[250px] lg:col-span-4">
      <div className="flex justify-between items-center mb-2">
         <h2 className="font-bold text-lg text-[#12225B]">Rekap Emosi</h2>
         <select className="text-xs bg-gray-100 text-[#12225B] border-none rounded-lg px-2 py-1 outline-none">
            <option>Mingguan</option>
            <option>Bulanan</option>
         </select>
      </div>
      
      <div className="flex-1 w-full min-h-0 flex items-center justify-center">
        {loading ? (
          <p className="text-gray-400 text-sm italic">Memuat data...</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="40%" // Moved chart slightly left to make room for legend
                cy="50%"
              innerRadius={50} // Makes it a doughnut chart
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
              cornerRadius={6} // Rounded edges on segments
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none"/>
              ))}
            </Pie>
            <Tooltip 
               contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
               itemStyle={{ color: '#12225B', fontWeight: 'bold' }}
            />
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              content={renderLegend}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
    </div>
  );
};
export default RekapEmosi;