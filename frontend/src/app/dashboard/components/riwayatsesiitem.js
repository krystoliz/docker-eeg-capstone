"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaSmile, FaMeh, FaFrown } from "react-icons/fa";

export default function RiwayatSesiItem({ session }) {
  const emotionColor = {
    Positif: "text-green-600",
    Netral: "text-yellow-600",
    Negatif: "text-red-600",
  };

  const emotionIcon = {
    Positif: <FaSmile className="text-green-500 text-lg" />,
    Netral: <FaMeh className="text-yellow-500 text-lg" />,
    Negatif: <FaFrown className="text-red-500 text-lg" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex justify-between items-center bg-[#F5F7FB] border border-gray-200 rounded-xl px-4 py-3 text-sm hover:shadow-md transition"
    >
      <div className="flex flex-col">
        <span className="font-medium text-[#2D3570]">
          {new Date(session.created_at).toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </span>
        {session.note && (
          <span className="text-gray-500 mt-1 italic line-clamp-2">
            “{session.note}”
          </span>
        )}
      </div>

      <div className={`flex items-center gap-2 ${emotionColor[session.emotion] || "text-gray-600"}`}>
        {emotionIcon[session.emotion] || <FaMeh className="text-gray-400" />}
        <span className="font-medium">{session.emotion || "Tidak diketahui"}</span>
      </div>
    </motion.div>
  );
}
