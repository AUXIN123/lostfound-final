"use client";

import { useRouter } from "next/navigation";

type MessageOwnerButtonProps = {
  ownerId: string;
  itemId: string;
};

export default function MessageOwnerButton({ ownerId, itemId }: MessageOwnerButtonProps) {
  const router = useRouter();

  const handleMessageClick = () => {
    // Navigate to a chat or message page (you can adjust this path as needed)
    router.push(`/messages/${ownerId}?item=${itemId}`);
  };

  return (
    <button
      onClick={handleMessageClick}
      className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      💬 Message Owner
    </button>
  );
}
