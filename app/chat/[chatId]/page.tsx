"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/auth/context/AuthContext";
import { sendMessage, subscribeToMessages } from "../../lib/firestoreChat";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase"; // ✅ CORRECT PATH
import { motion } from "framer-motion";

export default function ChatPage() {
  const { chatId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [reward, setReward] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 🔹 Subscribe to chat messages
  useEffect(() => {
    if (!chatId) return;
    const unsub = subscribeToMessages(chatId as string, setMessages);
    return () => unsub();
  }, [chatId]);

  // 🔹 Fetch reward info from Firestore
  useEffect(() => {
    const fetchReward = async () => {
      if (!chatId) return;
      try {
        const chatRef = doc(db, "chats", chatId as string);
        const chatSnap = await getDoc(chatRef);
        if (chatSnap.exists()) {
          const chatData = chatSnap.data();
          if (chatData.itemId) {
            const itemRef = doc(db, "items", chatData.itemId);
            const itemSnap = await getDoc(itemRef);
            if (itemSnap.exists()) {
              const itemData = itemSnap.data();
              if (itemData.reward && itemData.reward > 0) {
                setReward(itemData.reward);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching reward:", error);
      }
    };
    fetchReward();
  }, [chatId]);

  // 🔹 Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 Send message
  const handleSend = async () => {
    if (!user || !newMessage.trim()) return;
    await sendMessage(chatId as string, newMessage);
    setNewMessage("");
  };

  return (
    <main className="flex flex-col h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white">
      {/* 💰 Reward Banner */}
      {reward && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-center py-3 font-semibold shadow-lg"
        >
          💰 Reward offered: ${reward}
        </motion.div>
      )}

      {/* 🧭 Chat Header */}
      <header className="px-4 py-3 border-b border-gray-700 bg-gray-900/70 backdrop-blur-md flex items-center justify-between">
        <h1 className="text-lg font-semibold">💬 Chat</h1>
        <span className="text-sm text-gray-400">
          {messages.length} message{messages.length !== 1 && "s"}
        </span>
      </header>

      {/* 📨 Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-600">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex ${msg.senderId === user?.uid ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl shadow-lg break-words ${
                msg.senderId === user?.uid
                  ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
                  : "bg-gray-700 text-gray-100"
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* ✏️ Input Box */}
      <div className="p-4 bg-gray-900 border-t border-gray-700 flex gap-2 items-center">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400"
        />
        <button
          onClick={handleSend}
          className="bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
          ➤
        </button>
      </div>
    </main>
  );
}