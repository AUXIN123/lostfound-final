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
  const [contact, setContact] = useState(user?.email || "");
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
      alert("Geolocation is not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
      },
      () => alert("Please allow location permission.")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return alert("Please sign in first.");
    if (!contact.trim()) return alert("Contact info is required.");

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
          alert("❌ Inappropriate image detected.");
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
        contact,
        image: imageUrl,
        userId: user.uid,
        uploaderName: user.displayName || user.email || "Anonymous",
        createdAt: Timestamp.now(),
        location,
        collected: false, // ⭐ important field
      });

      alert("Item added successfully!");
      router.push("/browse");
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center px-4 py-8 font-sans overflow-hidden">

      {/* Background animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#0f1226] via-[#1d1a33] to-[#000] opacity-80"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      {/* Card */}
      <motion.form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-8 flex flex-col gap-5 text-white"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-3xl font-bold text-center mb-4">📝 Report Lost Item</h1>

        {/* Item Name */}
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="bg-white/20 p-3 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none"
          required
        />

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-white/20 p-3 rounded-lg text-white outline-none focus:ring-2 focus:ring-cyan-400"
          required
        >
          <option value="" className="text-black">Select Category</option>
          {categories.map((c) => (
            <option key={c} value={c} className="text-black">
              {c}
            </option>
          ))}
        </select>

        {/* Description */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-white/20 p-3 h-28 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400"
          required
        />

        {/* Contact */}
        <input
          type="text"
          placeholder="Contact Info (Email or Phone)"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="bg-white/20 p-3 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400"
          required
        />

        {/* File upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="bg-white/10 p-3 rounded-lg cursor-pointer"
        />

        {/* Location button */}
        <button
          type="button"
          onClick={getUserLocation}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-3 rounded-xl font-semibold hover:opacity-90"
        >
          📍 Get My Location
        </button>

        {/* Show location */}
        {location && (
          <p className="text-green-300 text-sm text-center">
            Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || checking}
          className={`p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 font-semibold ${
            loading || checking ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.03]"
          }`}
        >
          {checking ? "🕵️ Checking Image..." : loading ? "📤 Uploading..." : "Add Lost Item"}
        </button>
      </motion.form>

      {/* Loading Overlay */}
      {(checking || loading) && (
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mb-4"></div>
          <p className="text-cyan-300 text-lg font-medium">
            {checking ? "Analyzing image..." : "Uploading..."}
          </p>
        </motion.div>
      )}
    </main>
  );
}
