"use client";

import Link from "next/link";
import { useAuth } from "@/app/auth/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Brand */}
        <Link href="/" className="text-2xl font-bold hover:opacity-90">
          Lost & Found
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-6 items-center">
          <Link href="/browse" className="hover:text-gray-200">
            Browse Items
          </Link>

          {user ? (
            <>
              <Link href="/add-item" className="hover:text-gray-200">
                Report Lost Item
              </Link>
              <button
                onClick={logout}
                className="bg-white text-blue-600 px-3 py-1 rounded-lg hover:bg-gray-200 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="hover:text-gray-200">
                Sign In
              </Link>
              <Link href="/auth/signup" className="hover:text-gray-200">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
