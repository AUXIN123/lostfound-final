"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Search } from "lucide-react";

interface LostItem {
  id: number;
  title: string;
  description: string;
  location: string;
  image: string | null;
}

export default function LostPage() {
  const [items, setItems] = useState<LostItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // 🖼️ Handle image upload & preview
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ➕ Handle adding a new lost item
  const handleAddItem = () => {
    if (!title || !description || !location) return alert("⚠️ Please fill all fields!");

    const newItem: LostItem = {
      id: Date.now(),
      title,
      description,
      location,
      image,
    };

    setItems([newItem, ...items]);
    setTitle("");
    setDescription("");
    setLocation("");
    setImage(null);
  };

  // 🔍 Filter items by search
  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.location.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          🔍 Report Lost Items
        </h1>

        {/* 🔎 Search bar */}
        <div className="flex items-center mb-8 border rounded-lg overflow-hidden bg-white shadow-sm">
          <Search className="ml-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search lost items..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 outline-none"
          />
        </div>

        {/* 🧾 Add item form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10 border">
          <h2 className="text-xl font-semibold mb-4">Add Lost Item</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Item title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-3 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="p-3 border rounded-lg"
            />
          </div>

          <textarea
            placeholder="Item description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border rounded-lg mt-4 h-24"
          />

          {/* 🖼️ Image Upload + Submit */}
          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Upload Box + Preview */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer bg-blue-50 border-2 border-dashed border-blue-400 rounded-lg px-5 py-3 hover:bg-blue-100 transition">
                <Upload className="text-blue-500" />
                <span className="text-blue-600 font-medium">Attach Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {image && (
                <div className="relative w-28 h-28 border rounded-lg overflow-hidden shadow-sm">
                  <Image src={image} alt="Preview" fill className="object-cover" />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleAddItem}
              className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition md:self-start"
            >
              Post Lost Item
            </button>
          </div>
        </div>

        {/* 📋 Lost items list */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
            >
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5">
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-gray-600 mb-2">{item.description}</p>
                <p className="text-sm text-gray-500">📍 {item.location}</p>
              </div>
            </div>
          ))}
        </div>

        {/* No items yet */}
        {filteredItems.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No lost items reported yet.
          </p>
        )}
      </div>
    </div>
  );
}
