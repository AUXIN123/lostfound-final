"use client";

import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
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
  contactInfo?: string;
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
  const [messageBoxOpen, setMessageBoxOpen] = useState<string | null>(null);
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

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

  // 🌀 Animated background
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

  // 💬 Send message
  const handleSendMessage = async (itemId: string) => {
    if (!senderName || !senderEmail || !message) {
      alert("Please fill in all fields before sending your message.");
      return;
    }

    try {
      setSending(true);
      const db = getFirestore();
      await addDoc(collection(db, "messages"), {
        itemId,
        senderName,
        senderEmail,
        message,
        sentAt: serverTimestamp(),
      });
      alert("Message sent successfully!");
      setMessage("");
      setSenderName("");
      setSenderEmail("");
      setMessageBoxOpen(null);
    } catch (err) {
      console.error("❌ Error sending message:", err);
      alert("Failed to send message. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.main
      className="relative min-h-screen text-white p-8 overflow-hidden"
      animate={bgControls}
    >
      {/* 🌌 Floating particles */}
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

      <motion.h1
        className="text-4xl font-bold text-center mb-8 drop-shadow-lg"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        ✨ Browse Lost & Found Items
      </motion.h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10 relative z-10">
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
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-4 mb-10 relative z-10">
        {categories.map((cat) => (
          <motion.button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            whileHover={{ scale: 1.1 }}
            className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all ${
              selectedCategory === cat.name
                ? "bg-cyan-500 text-white scale-105 shadow-lg"
                : "bg-white/10 text-gray-300 hover:bg-cyan-400/30"
            }`}
          >
            {cat.icon} {cat.name}
          </motion.button>
        ))}
      </div>

      {/* Items */}
      {loading ? (
        <div className="flex flex-wrap justify-center gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-72 h-80 bg-white/10 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <p className="text-center text-gray-300 text-lg">No items found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto relative z-10">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden hover:scale-[1.03] transition-transform cursor-pointer"
              whileHover={{ y: -5 }}
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
                <p className="text-gray-300 text-sm line-clamp-2">{item.description}</p>
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
                  <p className="text-xs text-cyan-400">👤 {item.uploaderName}</p>
                )}
                {item.contactInfo && (
                  <p className="text-xs text-yellow-400">📞 {item.contactInfo}</p>
                )}

                {/* 💬 Message box */}
                <button
                  onClick={() =>
                    setMessageBoxOpen(messageBoxOpen === item.id ? null : item.id)
                  }
                  className="w-full mt-2 bg-cyan-500/30 hover:bg-cyan-500/50 rounded-lg py-1 text-sm transition"
                >
                  💬 {messageBoxOpen === item.id ? "Cancel" : "Send Message"}
                </button>

                {messageBoxOpen === item.id && (
                  <div className="mt-3 space-y-2">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-2 py-1 rounded bg-white/10 text-white text-sm"
                    />
                    <input
                      type="email"
                      placeholder="Your email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full px-2 py-1 rounded bg-white/10 text-white text-sm"
                    />
                    <textarea
                      placeholder="Write your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      className="w-full px-2 py-1 rounded bg-white/10 text-white text-sm"
                    />
                    <button
                      onClick={() => handleSendMessage(item.id)}
                      disabled={sending}
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg py-1 text-sm transition"
                    >
                      {sending ? "Sending..." : "Send"}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.main>
  );
}
