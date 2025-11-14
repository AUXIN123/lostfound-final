"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ItemDetailsPage() {
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const ref = doc(db, "items", id as string);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setItem({ id: snap.id, ...snap.data() });
        } else {
          setItem(null);
        }
      } catch (error) {
        console.error("Error loading item:", error);
      }

      setLoading(false);
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading item...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <p className="text-xl mb-4">Item not found.</p>
        <Link href="/browse" className="underline">
          Go back
        </Link>
      </div>
    );
  }

  return (
    <motion.main
      className="min-h-screen p-6 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Link href="/browse" className="underline text-sm opacity-80">
        ← Back to browse
      </Link>

      <div className="mt-6 bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 max-w-2xl mx-auto">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-60 object-cover rounded-lg mb-4"
        />

        <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
        <p className="text-lg opacity-80 mb-4">{item.category}</p>

        <p className="opacity-90">{item.description}</p>

        <div className="mt-4 text-sm opacity-70">
          Posted on: {item.createdAt?.toDate?.().toLocaleString()}
        </div>
      </div>
    </motion.main>
  );
}
