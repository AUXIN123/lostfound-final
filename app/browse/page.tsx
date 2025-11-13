"use client";

import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import Image from "next/image";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  FaLaptop,
  FaFileAlt,
  FaTshirt,
  FaKey,
  FaGem,
  FaWallet,
  FaDog,
  FaShoppingBag,
  FaBoxOpen,
} from "react-icons/fa";
import { IoMdInfinite } from "react-icons/io";

interface Item {
  id: string;
  itemName: string;
  description: string;
  image?: string;
  category?: string;
  uploaderName?: string;
  createdAt?: any;
  location?: { lat: number; lng: number };
}

export default function BrowsePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("Newest");

  // 🔹 Define categories with icons
  const categories = [
    { name: "All", icon: <IoMdInfinite className="text-white" /> },
    { name: "Electronics", icon: <FaLaptop className="text-cyan-400" /> },
    { name: "Documents", icon: <FaFileAlt className="text-yellow-300" /> },
    { name: "Clothing", icon: <FaTshirt className="text-pink-400" /> },
    { name: "Bags", icon: <FaShoppingBag className="text-blue-400" /> },
    { name: "Jewelry", icon: <FaGem className="text-purple-400" /> },
    { name: "Keys", icon: <FaKey className="text-orange-400" /> },
    { name: "Wallets", icon: <FaWallet className="text-green-400" /> },
    { name: "Pets", icon: <FaDog className="text-amber-400" /> },
    { name: "Other", icon: <FaBoxOpen className="text-gray-300" /> },
  ];

  // 🌀 Animated gradient background control
  const bgControls = useAnimation();

  useEffect(() => {
    const loop = async () => {
      while (true) {
        await bgControls.start({
          background: [
            "radial-gradient(circle at 10% 20%, #0f0c29, #302b63, #24243e)",
            "radial-gradient(circle at 90% 80%, #1a2a6c, #b21f1f, #fdbb2d)",
            "radial-gradient(circle at 20% 70%, #16222a, #3a6073)",
            "radial-gradient(circle at 70% 30%, #000428, #004e92)",
          ],
          transition: { duration: 15, repeat: Infinity, repeatType: "mirror" },
        });
      }
    };
    loop();
  }, [bgControls]);

  // 🧠 Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const db = getFirestore();
        let q;
        if (selectedCategory === "All") {
          q = query(collection(db, "items"), orderBy("createdAt", "desc"));
        } else {
          q = query(
            collection(db, "items"),
            where("category", "==", selectedCategory),
            orderBy("createdAt", "desc")
          );
        }

        const snapshot = await getDocs(q);
        const data: Item[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Item[];

        setItems(data);
        setFilteredItems(data);
      } catch (error) {
        console.error("❌ Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [selectedCategory]);

  // 🔍 Search + Sort
  useEffect(() => {
    let filtered = items.filter(
      (item) =>
        item.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortOrder === "A-Z") {
      filtered = filtered.sort((a, b) =>
        (a.itemName || "").localeCompare(b.itemName || "")
      );
    } else if (sortOrder === "Z-A") {
      filtered = filtered.sort((a, b) =>
        (b.itemName || "").localeCompare(a.itemName || "")
      );
    } else if (sortOrder === "Oldest") {
      filtered = filtered.sort(
        (a, b) => a.createdAt?.seconds - b.createdAt?.seconds
      );
    } else {
      filtered = filtered.sort(
        (a, b) => b.createdAt?.seconds - a.createdAt?.seconds
      );
    }

    setFilteredItems(filtered);
  }, [searchQuery, sortOrder, items]);

  return (
    <motion.main
      className="relative min-h-screen text-white p-8 overflow-hidden"
      animate={bgControls}
    >
      {/* 🌌 Floating animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-cyan-400/40 rounded-full blur-sm"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0.2 + Math.random() * 0.6,
              scale: 0.8 + Math.random() * 1.5,
            }}
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 20 + Math.random() * 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* 🔹 Title */}
      <motion.h1
        className="text-4xl font-bold text-center mb-8 drop-shadow-lg"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        ✨ Browse Lost & Found Items
      </motion.h1>

      {/* 🔍 Filters */}
      <motion.div
        className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <input
          type="text"
          placeholder="🔎 Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 rounded-full bg-white/10 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-4 py-2 rounded-full bg-white/10 text-white outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option>Newest</option>
          <option>Oldest</option>
          <option>A-Z</option>
          <option>Z-A</option>
        </select>
      </motion.div>

      {/* 🏷️ Animated Categories */}
      <motion.div
        className="flex flex-wrap justify-center gap-4 mb-10 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {categories.map((cat) => (
          <motion.button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all ${
              selectedCategory === cat.name
                ? "bg-cyan-500 text-white scale-105 shadow-lg"
                : "bg-white/10 text-gray-300 hover:bg-cyan-400/30"
            }`}
          >
            <motion.span
              animate={{ rotate: selectedCategory === cat.name ? 360 : 0 }}
              transition={{ duration: 0.8 }}
            >
              {cat.icon}
            </motion.span>
            {cat.name}
          </motion.button>
        ))}
      </motion.div>

      {/* Items Grid */}
      {loading ? (
        <div className="flex flex-wrap justify-center gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-72 h-80 bg-white/10 rounded-2xl animate-pulse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <motion.p
          className="text-center text-gray-300 text-lg relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No items found.
        </motion.p>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto relative z-10"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden hover:scale-[1.03] transition-transform cursor-pointer"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="relative w-full h-48 bg-gray-800">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.itemName || "Lost item"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-semibold">{item.itemName}</h2>
                  {item.category && (
                    <span className="inline-block text-xs bg-cyan-500/30 text-cyan-300 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  )}
                  <p className="text-gray-300 text-sm line-clamp-2">
                    {item.description}
                  </p>
                  {item.location && (
                    <p className="text-xs text-green-400">
                      📍 {item.location.lat.toFixed(3)}, {item.location.lng.toFixed(3)}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    {item.createdAt?.toDate
                      ? item.createdAt.toDate().toLocaleString()
                      : "Unknown date"}
                  </p>
                  {item.uploaderName && (
                    <p className="text-xs text-cyan-400">
                      👤 {item.uploaderName}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.main>
  );
}
