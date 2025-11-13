"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/context/AuthContext";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { isImageSafe, loadModel } from "../lib/nsfwCheckClient";
import { motion } from "framer-motion";

export default function AddItemPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [contact, setContact] = useState(user?.email || ""); // ✅ Contact info
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const categories = [
    "Electronics",
    "Documents",
    "Clothing",
    "Bags",
    "Jewelry",
    "Keys",
    "Wallets",
    "Pets",
    "Other",
  ];

  useEffect(() => {
    loadModel();
  }, []);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        alert(`📍 Location captured!\nLat: ${latitude}\nLng: ${longitude}`);
      },
      (err) => {
        console.error("Error getting location:", err);
        alert("Unable to access location. Please allow permission.");
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to add a lost item.");
      return;
    }

    if (!contact.trim()) {
      alert("Please provide your contact information (email or phone).");
      return;
    }

    try {
      setLoading(true);
      const db = getFirestore();
      const storage = getStorage();

      let imageUrl = null;
      if (image) {
        setChecking(true);
        const safe = await isImageSafe(image);
        setChecking(false);

        if (!safe) {
          alert("❌ Inappropriate image detected. Please upload a different one.");
          setLoading(false);
          return;
        }

        const storageRef = ref(storage, `lostItems/${Date.now()}-${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "items"), {
        itemName,
        description,
        category,
        contact, // ✅ Save contact info
        image: imageUrl,
        userId: user.uid,
        uploaderName: user.displayName || user.email || "Anonymous",
        createdAt: Timestamp.now(),
        location,
      });

      alert("✅ Item added successfully!");
      router.push("/browse");
    } catch (error) {
      console.error("❌ Error adding item:", error);
      alert("Error adding item");
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

  return (
    <main className="relative flex flex-col items-center p-8 text-white min-h-screen overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 opacity-70"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.h1
        className="text-4xl font-extrabold mb-8 z-10"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        📝 Report Lost Item
      </motion.h1>

      <motion.form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md bg-white/10 p-8 rounded-2xl backdrop-blur-md shadow-xl border border-white/20 z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <motion.input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="p-3 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          required
          whileFocus={{ scale: 1.02 }}
        />

        <motion.select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 rounded bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          required
          whileFocus={{ scale: 1.02 }}
        >
          <option value="" disabled>
            Select Category
          </option>
          {categories.map((cat) => (
            <option key={cat} value={cat} className="text-black">
              {cat}
            </option>
          ))}
        </motion.select>

        <motion.textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-3 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          required
          whileFocus={{ scale: 1.02 }}
        />

        {/* ✅ Contact Field */}
        <motion.input
          type="text"
          placeholder="Contact Info (Email or Phone)"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="p-3 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          required
          whileFocus={{ scale: 1.02 }}
        />

        <motion.input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="p-3 bg-white/10 text-white cursor-pointer rounded"
          whileHover={{ scale: 1.02 }}
        />

        <motion.button
          type="button"
          onClick={getUserLocation}
          className="p-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold hover:opacity-90 transition"
          whileHover={{ scale: 1.05 }}
        >
          📍 Get My Location
        </motion.button>

        {location && (
          <motion.p
            className="text-sm text-green-300 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </motion.p>
        )}

        <motion.button
          type="submit"
          disabled={loading || checking}
          className={`p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold transition ${
            loading || checking ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.03]"
          }`}
          whileTap={{ scale: 0.98 }}
        >
          {checking
            ? "🕵️ Checking Image..."
            : loading
            ? "📤 Uploading..."
            : "Add Lost Item"}
        </motion.button>
      </motion.form>

      {(checking || loading) && (
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mb-4"></div>
          <p className="text-cyan-300 text-lg font-medium">
            {checking ? "Analyzing image for safety..." : "Uploading your item..."}
          </p>
        </motion.div>
      )}
    </main>
  );
}
