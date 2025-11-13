"use client";
import { useState } from "react";
import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

export default function Auth() {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div style={{ marginTop: "20px" }}>
      {!user ? (
        <button
          onClick={handleLogin}
          style={{ backgroundColor: "#007BFF", color: "#fff", padding: "10px 20px", borderRadius: "8px" }}
        >
          Login with Google
        </button>
      ) : (
        <div>
          <p>Welcome, {user.displayName}</p>
          <button
            onClick={handleLogout}
            style={{ backgroundColor: "#222", color: "#fff", padding: "10px 20px", borderRadius: "8px" }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
<div className="bg-red-500 text-white p-4">Tailwind Works!</div>
