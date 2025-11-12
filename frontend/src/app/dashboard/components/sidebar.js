"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaChartPie, FaHistory, FaStickyNote, FaSignOutAlt, FaUserCircle } from "react-icons/fa";

export default function Sidebar({ active, setActive }) {
  const router = useRouter();
  const [userName, setUserName] = useState("User");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Ambil nama lengkap dari localStorage, ambil nama depan saja
  useEffect(() => {
    const storedName = localStorage.getItem("userFullName");
    if (storedName) {
      const firstName = storedName.split(" ")[0];
      setUserName(firstName);
    }
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userFullName");
    setShowLogoutConfirm(false);
    router.push("/login");
  };

  return (
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full md:w-[250px] bg-[#F2F4FA] border-r border-gray-200 flex flex-col justify-between rounded-2xl shadow-sm p-5"
    >
      {/* Bagian atas - User info */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <FaUserCircle className="text-4xl text-[#2D3570]" />
          <div>
            <span className="text-gray-600 text-sm">User</span>
            <div className="bg-gray-200 px-3 py-1 rounded-lg mt-1 text-[#2D3570] font-semibold">
              {userName}
            </div>
          </div>
        </div>

        {/* Navigasi */}
        <nav className="flex flex-col gap-3">
          <button
            onClick={() => setActive("rekap")}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
              active === "rekap"
                ? "bg-[#2D3570] text-white"
                : "text-[#2D3570] hover:bg-gray-200"
            }`}
          >
            <FaChartPie />
            Rekap Emosi
          </button>

          <button
            onClick={() => setActive("riwayat")}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
              active === "riwayat"
                ? "bg-[#2D3570] text-white"
                : "text-[#2D3570] hover:bg-gray-200"
            }`}
          >
            <FaHistory />
            Riwayat Sesi
          </button>

          <button
            onClick={() => setActive("catatan")}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
              active === "catatan"
                ? "bg-[#2D3570] text-white"
                : "text-[#2D3570] hover:bg-gray-200"
            }`}
          >
            <FaStickyNote />
            Catatan Anda
          </button>
        </nav>
      </div>

      {/* Tombol Logout */}
      <div className="mt-10">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center justify-center gap-2 text-red-600 font-medium bg-red-100 hover:bg-red-200 rounded-lg py-2 w-full transition"
        >
          <FaSignOutAlt />
          Keluar
        </button>

        {/* Popup konfirmasi logout */}
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl shadow-lg p-6 w-[90%] sm:w-[350px]"
            >
              <h2 className="text-lg font-semibold text-[#2D3570] mb-3">
                Konfirmasi Keluar
              </h2>
              <p className="text-sm text-gray-600 mb-5">
                Apakah Anda yakin ingin keluar dari akun ini?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 rounded-lg text-gray-600 bg-gray-200 hover:bg-gray-300 transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition"
                >
                  Ya, Keluar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
}
