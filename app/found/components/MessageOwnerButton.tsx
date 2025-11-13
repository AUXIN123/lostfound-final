"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth/context/AuthContext";
import { getOrCreateChat } from "../../lib/firestoreChat";

export default function MessageOwnerButton({ ownerId }: { ownerId: string }) {
  const router = useRouter();
  const { user } = useAuth();

  const handleChat = async () => {
    if (!user) {
      alert("Please sign in to send a message.");
      return;
    }
    if (user.uid === ownerId) {
      alert("You cannot message yourself!");
      return;
    }

    const chatId = await getOrCreateChat(user.uid, ownerId);
    router.push(`/chat/${chatId}`);
  };

  return (
    <button
      onClick={handleChat}
      className="px-4 py-2 mt-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold hover:opacity-90 transition"
    >
      💬 Message Owner
    </button>
  );
}