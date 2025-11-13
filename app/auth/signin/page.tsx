"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Mail, Lock, LogIn } from "lucide-react";
import { motion } from "framer-motion";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        alert("Please verify your email before signing in.");
        return;
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <form
          onSubmit={handleSignin}
          className="bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-[380px] border border-gray-700"
        >
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-6 text-center text-blue-400"
          >
            Welcome Back
          </motion.h2>

          <div className="flex items-center gap-2 mb-4 border border-gray-600 rounded-lg px-3 py-2 focus-within:border-blue-500 transition-colors">
            <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-transparent outline-none text-white placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-2 mb-4 border border-gray-600 rounded-lg px-3 py-2 focus-within:border-blue-500 transition-colors">
            <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-transparent outline-none text-white placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 py-2.5 rounded-lg font-medium transition-all duration-200"
          >
            <LogIn className="w-5 h-5 text-white flex-shrink-0" />
            Sign In
          </motion.button>

          <p className="text-gray-400 text-sm text-center mt-4">
            Don’t have an account?{" "}
            <span
              onClick={() => router.push("/auth/signup")}
              className="text-blue-400 hover:underline cursor-pointer"
            >
              Sign up
            </span>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
