"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function RekapEmosi() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const COLORS = ["#4CAF50", "#FFB300", "#F44336"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8002/api/rekap");
        const json = await res.json();
        if (res.ok && Array.isArray(json)) {
          setData(json);
        } else {
          console.error("Format rekap emosi tidak valid:", json);
        }
      } catch (err) {
        console.error("Error ambil rekap emosi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-2xl shadow-md p-6 w-full"
    >
      <h3 className="text-[#2D3570] text-lg font-semibold mb-4">
        Rekap Emosi Anda
      </h3>

      {loading ? (
        <p className="text-gray-500 text-sm italic">Memuat grafik...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-500 text-sm italic">Belum ada data emosi.</p>
      ) : (
        <div className="h-[250px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="emotion"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} kali`, name]}
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  border: "1px solid #eee",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
