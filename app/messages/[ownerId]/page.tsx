"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useState } from "react";

export default function MessageOwnerPage() {
  const { ownerId } = useParams();
  const searchParams = useSearchParams();
  const itemId = searchParams.get("item");

  const [message, setMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    // 📨 Example: send message to Firestore or API route
    console.log("Sending message:", {
      to: ownerId,
      about: itemId,
      content: message,
    });

    alert("Message sent to the owner!");
    setMessage("");
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Message Item Owner</h1>
      <p className="text-gray-600 mb-6">
        You’re messaging the owner of item <strong>{itemId}</strong>
      </p>

      <form onSubmit={handleSendMessage} className="space-y-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message..."
          className="w-full border rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
