"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Logout({ showLogout, setShowLogout }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowLogout(false);
    router.push("/login");
  };

  return (
    <AnimatePresence>
      {showLogout && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl shadow-lg px-8 py-6 w-[90%] max-w-sm text-center"
          >
            <h2 className="text-[#2D3570] text-lg font-semibold mb-2">
              Konfirmasi Logout
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Apakah kamu yakin ingin keluar?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogout(false)}
                className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Tidak
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-lg bg-[#2D3570] text-white hover:bg-[#1F2755] transition"
              >
                Ya
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
