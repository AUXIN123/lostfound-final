"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth/context/AuthContext";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AddItemPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to add a lost item.");
      return;
    }

    try {
      setLoading(true);
      
      const db = getFirestore();
      const storage = getStorage();
      
      let imageUrl = null;
      if (image) {
        // Upload image
        const storageRef = ref(storage, `lostItems/${Date.now()}-${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Add item to Firestore
      const docRef = await addDoc(collection(db, "items"), {
        itemName,
        description,
        image: imageUrl,
        userId: user.uid,
        createdAt: Timestamp.now(),
      });

      console.log("✅ Added new item with ID:", docRef.id);
      alert("✅ Item added successfully!");
      router.push("/browse");
    } catch (error) {
      console.error("❌ Error adding item:", error);
      alert("Error adding item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Report Lost Item</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md bg-white/10 p-6 rounded-xl"
      >
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="p-3 rounded bg-white/20 text-white"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-3 rounded bg-white/20 text-white"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="p-3 bg-white/10 text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-3 rounded hover:opacity-80"
        >
          {loading ? "Uploading..." : "Add Lost Item"}
        </button>
      </form>
    </main>
  );
}