"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Sidebar from "./components/sidebar";
import EmosiTerakhir from "./components/emositerakhir";
import RekapEmosi from "./components/rekapemosi";
import RiwayatSesi from "./components/riwayatsesi";
import CatatanAnda from "./components/catatanaanda";
import RekamFoto from "./components/rekamfoto";

// --- Our Imports ---
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
// -----------------

export default function Dashboard() {
  // --- Our Logic ---
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not logged in
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Show loading screen while checking auth
  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }
  // -----------------

  // User is logged in, show the dashboard
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center">
            {/* We will get the user from context in the Sidebar component */}
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* --- THIS IS THE NEXT STEP --- */}
            {/* We will wire this up in Phase 4 */}
            <EmosiTerakhir />
            {/* --------------------------- */}

            <RekapEmosi />
            <RiwayatSesi />
            <CatatanAnda />
            <RekamFoto />
          </div>
        </main>
      </div>
    </div>
  );
}