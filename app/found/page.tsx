"use client";

import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import MessageOwnerButton from "./components/MessageOwnerButton";

interface FoundItem {
  id: number;
  title: string;
  description: string;
  location: string;
  image: string;
  ownerId: string;
}

export default function FoundPage() {
  const [query, setQuery] = useState("");

  const items: FoundItem[] = [
    {
      id: 1,
      title: "Wallet",
      description: "Brown leather wallet found near Dhanmondi.",
      location: "Dhaka",
      image: "/images/wallet.jpg",
      ownerId: "user1",
    },
    {
      id: 2,
      title: "Phone",
      description: "iPhone 12 found in Gulshan area.",
      location: "Dhaka",
      image: "/images/phone.jpg",
      ownerId: "user2",
    },
    {
      id: 3,
      title: "Bag",
      description: "Black backpack found near New Market.",
      location: "Dhaka",
      image: "/images/bag.jpg",
      ownerId: "user3",
    },
  ];

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.location.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#1e3a8a] via-[#312e81] to-[#0f172a] text-white p-8">
      {/* Animated floating background orbs */}
      <motion.div
        className="absolute w-96 h-96 bg-purple-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse top-10 left-10"
        animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-blue-600/30 rounded-full mix-blend-multiply filter blur-3xl bottom-10 right-10"
        animate={{ x: [0, -40, 0], y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />

      <motion.h1
        className="text-4xl sm:text-5xl font-bold mb-6 z-10 text-center"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        👜 Found Items
      </motion.h1>

      {/* Search bar */}
      <motion.div
        className="flex items-center mb-10 border rounded-lg overflow-hidden bg-white/10 backdrop-blur-md shadow-lg w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <Search className="ml-3 text-gray-300" />
        <input
          type="text"
          placeholder="Search items..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 bg-transparent outline-none text-white placeholder-gray-300"
        />
      </motion.div>

      {/* Items grid */}
      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 z-10"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { delayChildren: 0.4, staggerChildren: 0.2 },
          },
        }}
      >
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl hover:shadow-2xl transition-transform transform hover:scale-105 overflow-hidden"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Image
              src={item.image}
              alt={item.title}
              width={400}
              height={250}
              className="w-full h-56 object-cover"
            />
            <div className="p-5">
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
              <p className="text-gray-200 mb-2">{item.description}</p>
              <p className="text-sm text-gray-400">📍 {item.location}</p>

              {/* ✅ Message owner button (replaces Claim Item) */}
              <MessageOwnerButton
                ownerId={item.ownerId}
                itemId={item.id.toString()}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredItems.length === 0 && (
        <motion.p
          className="text-center text-gray-300 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No items found.
        </motion.p>
      )}
    </main>
  );
}
