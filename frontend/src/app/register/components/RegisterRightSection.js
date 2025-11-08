"use client";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
// ... (other imports)
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import { useAuth } from "@/context/AuthContext";

const RegisterRightSection = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- Our Logic ---
  const [fullName, setFullName] = useState(""); // <-- ADD fullName STATE
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register, error } = useAuth();
  const [clientError, setClientError] = useState(null);
  // -----------------

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setClientError("Password do not match!");
      return;
    }
    
    setClientError(null);
    setLoading(true);

    // --- Pass fullName to the register function ---
    await register(email, password, fullName);
    // -------------------------------------------
    
    setLoading(false);
  };

  return (
    <form
      className="w-full lg:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center items-center relative overflow-y-auto"
      onSubmit={handleRegister}
    >
      {/* ... (LoadingOverlay, Image, h2, p, error messages are all the same) ... */}
      {loading && <LoadingOverlay />}
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image
            src="/affectra.png"
            alt="Affectra Logo"
            width={150}
            height={150}
          />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-center">Daftar Akun</h2>
        <p className="text-gray-600 mb-8 text-center">
          Buat akun Anda untuk memulai.
        </p>

        {(error || clientError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error || clientError}</span>
          </div>
        )}

        {/* --- ADD FULL NAME INPUT --- */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="fullName"
          >
            Nama Lengkap (Full Name)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="fullName"
            type="text"
            placeholder="Masukkan nama lengkap"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        {/* ------------------------- */}

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {/* ... (rest of the form: password, confirm password, buttons) ... */}
        <div className="mb-4 relative">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-gray-600"
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
        </div>
        <div className="mb-6 relative">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="confirm-password"
          >
            Konfirmasi Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Konfirmasi password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-gray-600"
          >
            {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
        </div>
        <div className="flex flex-col items-center">
          <button
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Daftar"}
          </button>
          <p className="text-gray-600 text-sm mt-4">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-bold text-blue-500 hover:text-blue-800"
            >
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default RegisterRightSection;