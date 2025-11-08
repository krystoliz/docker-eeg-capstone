"use client";
import React from 'react';
// --- ENSURE TOOLTIP IS IMPORTED HERE ---
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
// ---------------------------------------

const RekapEmosi = () => {
  // Dummy data to match your design colors for now
  const data = [
    { name: 'Positif', value: 45, color: '#A7D7C5' }, // Soft Green
    { name: 'Negatif', value: 20, color: '#F5A9A9' }, // Soft Red
    { name: 'Netral', value: 35, color: '#B8C0EC' },  // Soft Blue
  ];

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
      
      <div className="flex-1 w-full min-h-0 flex items-center">
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
      </div>
    </div>
  );
};

export default RekapEmosi;