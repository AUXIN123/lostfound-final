"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";

interface Item {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  createdAt?: any;
}

export default function BrowsePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const db = getFirestore(); // Initialize Firestore directly
        const querySnapshot = await getDocs(collection(db, "items"));
        const fetchedItems: Item[] = [];
        querySnapshot.forEach((doc) => {
          fetchedItems.push({ id: doc.id, ...doc.data() } as Item);
        });
        setItems(fetchedItems);
      } catch (error) {
        console.error("❌ Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading items...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        No items found.
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-6 text-center">Browse Lost & Found Items</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg shadow p-4 hover:shadow-lg transition bg-white"
          >
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}
            <h2 className="text-xl font-medium">{item.name}</h2>
            <p className="text-gray-700 mt-2">{item.description}</p>
            <p className="text-gray-500 text-sm mt-2">
              {item.createdAt?.toDate
                ? item.createdAt.toDate().toLocaleString()
                : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}