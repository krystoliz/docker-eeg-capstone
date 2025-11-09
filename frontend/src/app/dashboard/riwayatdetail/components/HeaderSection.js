"use client";
import React from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

const HeaderSection = () => {
  return (
    <div>
      <Link 
        href="/dashboard" 
        className="inline-flex items-center text-gray-500 hover:text-[#12225B] transition-colors mb-4"
      >
        <FaArrowLeft className="mr-2" />
        Kembali ke Dashboard
      </Link>
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-[#12225B]">Riwayat Sesi Lengkap</h1>
          <p className="text-gray-500 mt-2">
            Pantau perjalanan emosi Anda secara mendetail.
          </p>
        </div>
        {/* Optional: Add a date range picker here later */}
      </div>
    </div>
  );
};

export default HeaderSection;