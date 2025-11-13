"use client";

import { useAuth } from "./auth/context/AuthContext";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/app/found/components/ui/Button"; // ✅ Keep your existing Button path

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white overflow-hidden">
      {/* 🌌 Animated Background Orbs */}
      <motion.div
        className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl top-20 left-10"
        animate={{
          x: [0, 50, -50, 0],
          y: [0, 40, -40, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl bottom-20 right-10"
        animate={{
          x: [0, -60, 60, 0],
          y: [0, -40, 40, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 🔹 Auth Buttons (Top Right) */}
      <div className="absolute top-6 right-6 flex gap-3 z-20">
        {user ? (
          <>
            <span className="text-sm text-gray-300">👋 {user.email}</span>
            <Button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/auth/signin">
              <Button
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-green-400 to-emerald-500 text-white">
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>

      {/* 🔹 Title */}
      <motion.h1
        className="text-5xl sm:text-6xl font-bold mb-4 text-center relative z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        ✨ <span className="text-cyan-400">Lost & Found</span>{" "}
        <span className="text-pink-400">BD</span>
      </motion.h1>

      {/* 🔹 Subtitle */}
      <motion.p
        className="text-center max-w-xl mb-8 text-gray-300 text-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Report lost items, discover found belongings, and help others in your
        community — all in one secure and friendly platform.
      </motion.p>

      {/* 🔹 Main Action Buttons */}
      <motion.div
        className="flex flex-wrap justify-center gap-4 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <Link href="/browse">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:scale-105 hover:opacity-90 transition">
            🔍 Browse Found Items
          </Button>
        </Link>
        <Link href="/add-item">
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg hover:scale-105 hover:opacity-90 transition">
            ➕ Report Lost Item
          </Button>
        </Link>
      </motion.div>

      {/* 🌠 Floating Emojis Animation */}
      <motion.div
        className="absolute text-6xl opacity-20 bottom-20 left-10 select-none"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        🔑
      </motion.div>
      <motion.div
        className="absolute text-6xl opacity-20 top-32 right-20 select-none"
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        🧢
      </motion.div>
      <motion.div
        className="absolute text-6xl opacity-20 top-1/3 left-1/4 select-none"
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
      >
        🎒
      </motion.div>
    </main>
  );
}
