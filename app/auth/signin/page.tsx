"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        alert("⚠️ Please verify your email before signing in.");
        return;
      }

      router.push("/"); // redirect to homepage or dashboard
    } catch (err: any) {
      console.error("Signin error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#232526] to-[#414345] text-white">
      <form
        onSubmit={handleSignin}
        className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg w-80 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>

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
          disabled={loading}
          className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white p-2 rounded hover:opacity-90 transition-opacity"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <a
          href="/auth/reset"
          className="text-cyan-400 text-sm text-center hover:underline mt-2"
        >
          Forgot password?
        </a>

        <p className="text-sm text-center mt-2">
          Don’t have an account?{" "}
          <a href="/auth/signup" className="text-green-400 hover:underline">
            Sign Up
          </a>
        </p>
      </form>
    </main>
  );
}
