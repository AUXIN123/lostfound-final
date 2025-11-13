import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/app/auth/context/AuthContext";

export const metadata: Metadata = {
  title: "Lost & Found",
  description: "A simple lost and found web app built with Next.js + Firebase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-[#232526] to-[#414345] text-white min-h-screen">
        <AuthProvider>
          <main className="p-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
