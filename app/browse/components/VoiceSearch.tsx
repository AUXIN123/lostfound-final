"use client";

import { useState } from "react";

export default function VoiceSearch({ onSearch }: { onSearch: (query: string) => void }) {
  const [searchText, setSearchText] = useState("");
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support voice recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setSearchText(text);
      onSearch(text);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        className="border p-2 w-full rounded text-black font-bold placeholder-gray-500 bg-white"
        placeholder="Search items..."
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          onSearch(e.target.value);
        }}
      />

      <button
        onClick={startListening}
        className={`p-3 rounded-full ${
          isListening ? "bg-red-500" : "bg-blue-500"
        } text-white`}
      >
        🎤
      </button>
    </div>
  );
}
