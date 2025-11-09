"use client";
// --- ENSURE THIS LINE HAS { useState } ---
import React, { useState } from "react";
// ----------------------------------------
import Link from "next/link";
import Image from "next/image";
import LoadingOverlay from "./LoadingOverlay";
import { FaUser, FaLock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

const LoginRightSection = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  return (
    <form
      className="w-full lg:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center items-center relative bg-white"
      onSubmit={handleLogin}
    >
      {loading && <LoadingOverlay />}
      <div className="w-full max-w-sm">
        <h2 className="text-4xl font-extrabold mb-2 text-[#12225B] text-left">
          Halo, Yuk masuk dulu!
        </h2>
        <p className="text-gray-600 mb-8 text-left">
          Masuk ke akunmu untuk mulai melacak emosi.
        </p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Email Input Field */}
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaUser className="text-gray-400" />
          </div>
          <input
            className="shadow appearance-none border border-gray-300 rounded-lg w-full py-3 pl-10 pr-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            id="email"
            type="email"
            placeholder="jhon@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Input Field */}
        <div className="mb-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaLock className="text-gray-400" />
          </div>
          <input
            className="shadow appearance-none border border-gray-300 rounded-lg w-full py-3 pl-10 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 top-0 h-full pr-3 flex items-center text-gray-600"
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
        </div>

        <div className="flex justify-end mb-6">
          <Link
            href="/forgotpassword"
            className="inline-block align-baseline font-semibold text-sm text-[#12225B] hover:text-blue-800"
          >
            Lupa kata sandi?
          </Link>
        </div>

        <div className="flex flex-col items-center">
          <button
            className="w-full bg-[#12225B] hover:bg-[#0c1844] text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? "Masuk..." : "Masuk"}
          </button>
          
          <p className="text-gray-600 text-sm mt-4">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-bold text-[#12225B] hover:text-blue-800"
            >
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default LoginRightSection;