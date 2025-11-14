import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/app/auth/context/AuthContext";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Report Lost Items in Dhaka | Lost & Found",
  description: "Find or report lost items in Dhaka — fast, free, and community-based lost & found service.",
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

        {/* Local Business JSON-LD Schema */}
        <Script id="schema" type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Lost & Found Dhaka",
            "description": "A platform to report and find lost items in Dhaka.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Dhaka",
              "addressRegion": "Dhaka",
              "addressCountry": "Bangladesh"
            },
            "url": "https://lostfound-final.vercel.app/"
          }
          `}
        </Script>
      </body>
    </html>
  );
}
