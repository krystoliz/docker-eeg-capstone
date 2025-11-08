"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

// --- THIS IS THE FIX ---
import {
  FaTachometerAlt,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
// -----------------------

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: FaTachometerAlt },
    { name: "Riwayat Sesi", href: "/dashboard/riwayatdetail", icon: FaFileAlt },
    { name: "Pengaturan", href: "/dashboard/pengaturan", icon: FaCog },
  ];

  return (
    <div className="w-64 bg-white shadow-md flex flex-col">
      <div className="p-4 flex items-center justify-center border-b">
        <Image
          src="/affectralengkap.png"
          alt="Affectra Logo"
          width={150}
          height={40}
        />
      </div>
      <div className="p-4 border-b">
        <Image
          src="/akun1.png"
          alt="User Avatar"
          width={50}
          height={50}
          className="rounded-full mx-auto"
        />
        <h3 className="text-center font-bold mt-2">
          {user ? user.fullName : "Loading..."}
        </h3>
        <p className="text-center text-gray-500 text-sm">Pengguna</p>
      </div>
      <nav className="flex-1 p-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link
                href={item.href}
                className={`flex items-center p-2 rounded ${
                  pathname === item.href
                    ? "bg-blue-100 text-blue-700":
                    "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon className="mr-3" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center p-2 w-full text-gray-600 hover:bg-gray-100 rounded"
        >
          <FaSignOutAlt className="mr-3" />
          Logout
        </button>
      </div>
    </div>
    
  );
};
              
export default Sidebar;