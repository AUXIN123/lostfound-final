"use client";

import { useAuth } from "./auth/context/AuthContext";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/app/found/components/ui/Button"; // ✅ Use named import

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white overflow-hidden">
      {/* 🔹 Title */}
      <motion.h1
        className="text-4xl sm:text-5xl font-bold mb-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        ✨ <span className="text-cyan-400">Lost & Found</span>{" "}
        <span className="text-pink-400">BD</span>
      </motion.h1>

      {/* 🔹 Subtitle */}
      <motion.p
        className="text-center max-w-xl mb-8 text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Report lost items, find your belongings, and help others. Everything in
        one modern, animated platform.
      </motion.p>

      {/* 🔹 Main Buttons */}
      <motion.div
        className="flex flex-wrap justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <Link href="/browse">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            🔍 Browse Found Items
          </Button>
        </Link>
        <Link href="/add-item">
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
            ➕ Report Lost Item
          </Button>
        </Link>
      </motion.div>

      {/* 🔹 Auth Buttons */}
      <div className="absolute top-6 right-6 flex gap-3">
        {user ? (
          <>
            <span className="text-sm text-gray-300">
              👋 {user.email}
            </span>
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
    </main>
  );
}