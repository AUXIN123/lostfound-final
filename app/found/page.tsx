"use client";

import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";

interface FoundItem {
  id: number;
  title: string;
  description: string;
  location: string;
  image: string; // ✅ added image property
}

export default function FoundPage() {
  const [query, setQuery] = useState("");

  const items: FoundItem[] = [
    {
      id: 1,
      title: "Wallet",
      description: "Brown leather wallet found near Dhanmondi.",
      location: "Dhaka",
      image: "/images/wallet.jpg", // ✅ store image in public/images folder
    },
    {
      id: 2,
      title: "Phone",
      description: "iPhone 12 found in Gulshan area.",
      location: "Dhaka",
      image: "/images/phone.jpg",
    },
    {
      id: 3,
      title: "Bag",
      description: "Black backpack found near New Market.",
      location: "Dhaka",
      image: "/images/bag.jpg",
    },
  ];

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.location.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">👜 Found Items</h1>

        {/* Search bar */}
        <div className="flex items-center mb-8 border rounded-lg overflow-hidden bg-white shadow-sm">
          <Search className="ml-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search items..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 outline-none"
          />
        </div>

        {/* Items grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
            >
              <Image
                src={item.image}
                alt={item.title}
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-gray-600 mb-2">{item.description}</p>
                <p className="text-sm text-gray-500">📍 {item.location}</p>
                <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Claim Item
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No items found.</p>
        )}
      </div>
    </div>
  );
}
