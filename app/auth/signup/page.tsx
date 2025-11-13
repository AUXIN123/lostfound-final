"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getAuth } from "firebase/auth";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/auth/signin");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#232526] to-[#414345] text-white">
      <form
        onSubmit={handleSignup}
        className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg w-80 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="p-2 rounded bg-white/20 text-white outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="p-2 rounded bg-white/20 text-white outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-2 rounded hover:opacity-90 transition-opacity"
        >
          Create Account
        </button>

        <p className="text-sm text-center mt-2">
          Already have an account?{" "}
          <a href="/auth/signin" className="text-cyan-400 hover:underline">
            Sign In
          </a>
        </p>
      </form>
    </main>
  );
}