"use client";

import MessageOwnerButton from "./MessageOwnerButton";

export default function FoundItemsList({ items }: { items: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-md flex flex-col justify-between h-full p-4"
        >
          <div>
            <img
              src={item.image}
              alt={item.itemName || "Lost item"}
              className="rounded-t-lg object-cover w-full h-48"
            />
            <h3 className="text-lg font-semibold mt-2">{item.itemName}</h3>
            <p className="text-gray-600 text-sm">{item.description}</p>
            {item.location && (
              <p className="text-sm mt-1 text-gray-500">
                📍 {item.location.lat.toFixed(3)}, {item.location.lng.toFixed(3)}
              </p>
            )}
          </div>

          {/* 💬 Message Owner Button */}
          <MessageOwnerButton ownerId={item.userId} itemId={item.id} />
        </div>
      ))}
    </div>
  );
}
