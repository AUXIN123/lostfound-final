"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Icons
import { MdDevices } from "react-icons/md";        // Electronics
import { FaRegFileAlt, FaKey, FaWallet, FaDog } from "react-icons/fa"; 
import { GiClothes, GiJewelCrown } from "react-icons/gi"; 
import { BsBagFill } from "react-icons/bs";
import { FaBoxOpen } from "react-icons/fa";

import VoiceSearch from "./components/VoiceSearch";

export default function BrowsePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");

  const bgControls = useAnimation();

  // Background animation
  useEffect(() => {
    const animate = async () => {
      while (true) {
        await bgControls.start({
          background: [
            "radial-gradient(circle at 10% 20%, #0fe0c9, #0c3b68)",
            "radial-gradient(circle at 90% 80%, #1a2a6c, #ff5f6d)",
            "radial-gradient(circle at 50% 50%, #2b5876, #4e4376)",
          ],
          transition: { duration: 6, repeat: Infinity, repeatType: "reverse" },
        });
      }
    };
    animate();
  }, [bgControls]);

  // Voice Search handler
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  // Fetch items from Firestore
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const ref = collection(db, "items");
        let q =
          selectedCategory === "All"
            ? query(ref, orderBy("createdAt", "desc"))
            : query(
                ref,
                where("category", "==", selectedCategory),
                orderBy("createdAt", "desc")
              );

        const snap = await getDocs(q);

        setItems(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    fetchData();
  }, [selectedCategory]);

  // Search filtering
  const filteredItems = useMemo(() => {
    if (!searchText.trim()) return items;
    return items.filter((item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [items, searchText]);

  // Category List (Option B Icons)
  const categories = [
    { name: "All", icon: <FaBoxOpen /> },
    { name: "Electronics", icon: <MdDevices /> },
    { name: "Documents", icon: <FaRegFileAlt /> },
    { name: "Clothing", icon: <GiClothes /> },
    { name: "Bags", icon: <BsBagFill /> },
    { name: "Jewelry", icon: <GiJewelCrown /> },
    { name: "Keys", icon: <FaKey /> },
    { name: "Wallets", icon: <FaWallet /> },
    { name: "Pets", icon: <FaDog /> },
    { name: "Other", icon: <FaBoxOpen /> },
  ];

  return (
    <motion.main
      animate={bgControls}
      className="min-h-screen p-6 text-white transition-all"
    >
      <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-300 via-pink-400 to-yellow-300 text-transparent bg-clip-text">
        ✨ Lost & Found
      </h1>

      {/* Voice Search */}
      <div className="max-w-xl mx-auto mb-6">
        <VoiceSearch onSearch={handleSearch} />
      </div>

      {/* Category Filter */}
      <div className="flex gap-3 overflow-x-auto py-2 mb-6 scrollbar-hide">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;

          return (
            <button
              key={cat.name}
              aria-pressed={isSelected}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition whitespace-nowrap ${
                isSelected
                  ? "bg-white/20 border-white"
                  : "border-white/20 hover:bg-white/10"
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Items Grid */}
      {loading ? (
        <p className="text-center text-gray-200">Loading items...</p>
      ) : filteredItems.length === 0 ? (
        <p className="text-center text-gray-300">No matching items.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              href={`/item/${item.id}`}
              className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:bg-white/20 transition"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-sm opacity-80">{item.category}</p>
            </Link>
          ))}
        </div>
      )}
    </motion.main>
  );
}
