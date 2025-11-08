"use client"; // Add this
import React, { useEffect } from "react";
import RegisterLeftSection from "./components/RegisterLeftSection";
import RegisterRightSection from "./components/RegisterRightSection";

// --- Our Imports ---
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
// -----------------

const RegisterPage = () => {
  // --- Our Logic ---
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  // Show nothing or a loading spinner while checking auth
  if (loading || user) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }
  // -----------------

  return (
    <div className="flex h-screen">
      <RegisterLeftSection />
      <RegisterRightSection />
    </div>
  );
};

export default RegisterPage;