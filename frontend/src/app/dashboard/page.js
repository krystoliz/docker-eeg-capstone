"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "./components/sidebar";
import RekapEmosi from "./components/rekapemosi";
import RiwayatSesi from "./components/riwayatsesi";
import CatatanAnda from "./components/catatananda";
import EmosiTerakhir from "./components/emositerakhir";
import RekamFoto from "./components/rekamfoto";

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("rekap");
  const [userFullName, setUserFullName] = useState("");
  const [firstName, setFirstName] = useState("");

  // Ambil nama dari localStorage
  useEffect(() => {
    const storedName = localStorage.getItem("userFullName");
    if (storedName) {
      setUserFullName(storedName);
      const first = storedName.split(" ")[0];
      setFirstName(first);
    }
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#EEF1F8] font-sans">
      {/* Sidebar */}
      <div className="md:w-1/4 lg:w-1/5">
        <Sidebar active={activeSection} setActive={setActiveSection} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col p-5 md:p-8 gap-6 overflow-y-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-[#2D3570]">Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">
              Selamat datang kembali, <span className="font-medium">{firstName || "User"}</span> 👋
            </p>
          </div>
          <RekamFoto />
        </motion.div>

        {/* Konten dinamis */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-1 xl:grid-cols-3 gap-6"
        >
          {/* Kolom kiri */}
          <div className="flex flex-col gap-6 col-span-2">
            {activeSection === "rekap" && (
              <>
                <EmosiTerakhir firstName={firstName} />
                <RekapEmosi />
              </>
            )}
            {activeSection === "riwayat" && <RiwayatSesi />}
            {activeSection === "catatan" && <CatatanAnda />}
          </div>

          {/* Kolom kanan */}
          <div className="flex flex-col gap-6">
            {activeSection !== "rekap" && (
              <EmosiTerakhir firstName={firstName} />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
