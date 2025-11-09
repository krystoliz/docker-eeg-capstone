"use client";
import React, { useMemo } from 'react';

const SummarySection = ({ historyData = [] }) => {
  // Calculate stats
  const stats = useMemo(() => {
    const total = historyData.length;
    let positive = 0;
    let negative = 0;
    let neutral = 0;

    historyData.forEach(item => {
      if (item.classified_emotion === 'Positive') positive++;
      else if (item.classified_emotion === 'Negative') negative++;
      else neutral++;
    });

    return { total, positive, negative, neutral };
  }, [historyData]);

  const StatCard = ({ title, count, colorBg, colorText }) => (
    <div className={`${colorBg} rounded-2xl p-6 flex flex-col justify-center items-center shadow-sm`}>
      <h3 className={`text-4xl font-extrabold ${colorText} mb-2`}>{count}</h3>
      <p className={`${colorText} opacity-80 font-medium`}>{title}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard 
        title="Total Sesi" 
        count={stats.total} 
        colorBg="bg-white" 
        colorText="text-[#12225B]" 
      />
      <StatCard 
        title="Positif" 
        count={stats.positive} 
        colorBg="bg-[#A7D7C5]" 
        colorText="text-[#065F46]" 
      />
      <StatCard 
        title="Netral" 
        count={stats.neutral} 
        colorBg="bg-[#B8C0EC]" 
        colorText="text-[#3730A3]" 
      />
      <StatCard 
        title="Negatif" 
        count={stats.negative} 
        colorBg="bg-[#F5A9A9]" 
        colorText="text-[#991B1B]" 
      />
    </div>
  );
};

export default SummarySection;