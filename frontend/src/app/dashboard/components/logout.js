"use client";
import React from "react";

// --- Our Imports ---
import { useAuth } from "@/context/AuthContext";
// -----------------

const Logout = () => {
  // --- Our Logic ---
  const { logout } = useAuth(); // Get the logout function
  // -----------------

  const handleLogout = () => {
    logout(); // <-- Call the REAL logout function
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
};

export default Logout;