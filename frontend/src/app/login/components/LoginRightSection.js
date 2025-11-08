"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoadingOverlay from "./LoadingOverlay";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

// --- Our Imports ---
import { useAuth } from "@/context/AuthContext";
// -----------------

const LoginRightSection = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // --- Our Logic ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error } = useAuth(); // Get login function and error state
  // const router = useRouter(); // We don't need this, AuthContext handles redirect
  // -----------------

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // --- Replace simulation with real login ---
    await login(email, password);
    // ----------------------------------------
    
    setLoading(false);
    // Redirect is now handled by the 'login' function in AuthContext
  };

  return (
    <form
      className="w-full lg:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center items-center relative"
      onSubmit={handleLogin} // This now calls our new function
    >
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
        <h2 className="text-3xl font-bold mb-4 text-center">Login</h2>
        <p className="text-gray-600 mb-8 text-center">
          Selamat datang kembali! Silakan masukkan kredensial Anda.
        </p>
        
        {/* --- Display Error Message --- */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {/* ----------------------------- */}

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
            // --- Connect to state ---
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            // --------------------
          />
        </div>
        <div className="mb-6 relative">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan password"
            // --- Connect to state ---
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            // --------------------
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-gray-600"
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
        </div>
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center text-gray-600 text-sm">
            <input
              className="mr-2 leading-tight"
              type="checkbox"
            />
            Ingat saya
          </label>
          <Link
            href="/forgotpassword"
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            Lupa Password?
          </Link>
        </div>
        <div className="flex flex-col items-center">
          <button
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="text-gray-600 text-sm mt-4">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-bold text-blue-500 hover:text-blue-800"
            >
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default LoginRightSection;