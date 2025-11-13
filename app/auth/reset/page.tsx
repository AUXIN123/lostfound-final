"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("📩 Password reset email sent! Check your inbox or spam folder.");
      setEmail("");
    } catch (err: any) {
      console.error("Reset error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a8a] via-[#312e81] to-[#111827] text-white relative overflow-hidden">
      {/* Subtle animated background orbs */}
      <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl top-10 left-10 animate-pulse" />
      <div className="absolute w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse" />

      <motion.form
        onSubmit={handleReset}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-2xl w-[90%] max-w-sm flex flex-col gap-5"
      >
        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Reset Password
        </h2>

        {message && (
          <p className="text-green-400 text-sm text-center bg-white/10 p-2 rounded-lg">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-400 text-sm text-center bg-white/10 p-2 rounded-lg">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Enter your email"
          className="p-3 rounded-lg bg-white/20 text-white outline-none placeholder-white/60 focus:ring-2 focus:ring-cyan-400 transition-all"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-70"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </motion.button>

        <a
          href="/auth/signin"
          className="text-sm text-center text-cyan-400 hover:underline hover:text-cyan-300 transition"
        >
          ← Back to Sign In
        </a>
      </motion.form>
    </main>
  );
}
