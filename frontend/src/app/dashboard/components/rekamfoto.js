"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function RekamFoto() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const startCamera = async () => {
    setMessage("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch (err) {
      console.error("Gagal mengakses kamera:", err);
      setMessage("Tidak dapat mengakses kamera. Periksa izin browser Anda.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreaming(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 320, 240);
    setPhotoCaptured(true);
  };

  const sendPhoto = async () => {
    if (!canvasRef.current) return;
    setLoading(true);
    setMessage("");

    const blob = await new Promise((resolve) =>
      canvasRef.current.toBlob(resolve, "image/jpeg")
    );

    const formData = new FormData();
    formData.append("file", blob, "capture.jpg");

    try {
      const res = await fetch("http://localhost:8003/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Foto berhasil dikirim ke server!");
      } else {
        setMessage(`Gagal mengirim foto: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error kirim foto:", err);
      setMessage("Terjadi kesalahan saat mengirim foto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center"
    >
      <h3 className="text-[#2D3570] text-lg font-semibold mb-4">
        Rekam Foto Wajah
      </h3>

      {!streaming && (
        <button
          onClick={startCamera}
          className="bg-[#2D3570] hover:bg-[#1F2755] text-white px-4 py-2 rounded-lg mb-4 transition"
        >
          Mulai Kamera
        </button>
      )}

      <div className="relative w-[320px] h-[240px] bg-gray-100 rounded-lg overflow-hidden shadow-inner">
        <video
          ref={videoRef}
          width="320"
          height="240"
          autoPlay
          className={`${streaming ? "block" : "hidden"} object-cover`}
        />
        <canvas
          ref={canvasRef}
          width="320"
          height="240"
          className={`${photoCaptured ? "block" : "hidden"}`}
        />
      </div>

      {streaming && !photoCaptured && (
        <button
          onClick={capturePhoto}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg mt-4 transition"
        >
          Ambil Foto
        </button>
      )}

      {photoCaptured && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => {
              setPhotoCaptured(false);
              startCamera();
            }}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
          >
            Ulangi
          </button>
          <button
            onClick={sendPhoto}
            disabled={loading}
            className="bg-[#2D3570] hover:bg-[#1F2755] text-white px-4 py-2 rounded-lg transition"
          >
            {loading ? "Mengirim..." : "Kirim Foto"}
          </button>
          <button
            onClick={stopCamera}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Tutup Kamera
          </button>
        </div>
      )}

      {message && (
        <p
          className={`mt-3 text-sm ${message.includes("berhasil")
              ? "text-green-600"
              : "text-red-600"
            }`}
        >
          {message}
        </p>
      )}
    </motion.div>
  );
}
