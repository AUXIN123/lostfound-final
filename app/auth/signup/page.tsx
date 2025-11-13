"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "@/lib/firebase"; // ✅ uses your correct firebase setup

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send verification email
      await sendEmailVerification(user);

      alert("📧 Verification email sent! Please check your inbox or spam folder.");

      // Optional: redirect after 2s to sign-in page
      setTimeout(() => router.push("/auth/signin"), 2000);
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
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
          disabled={loading}
          className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-2 rounded hover:opacity-90 transition-opacity"
        >
          {loading ? "Creating Account..." : "Create Account"}
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
