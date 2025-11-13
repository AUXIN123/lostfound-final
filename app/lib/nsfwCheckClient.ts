"use client";

import * as nsfwjs from "nsfwjs";
import * as tf from "@tensorflow/tfjs";

let model: nsfwjs.NSFWJS | null = null;

export async function loadModel() {
  if (!model) {
    model = await nsfwjs.load();
  }
  return model;
}

export async function isImageSafe(file: File): Promise<boolean> {
  const img = new Image();
  const reader = new FileReader();

  return new Promise<boolean>((resolve, reject) => {
    reader.onload = async () => {
      img.src = reader.result as string;
      img.onload = async () => {
        try {
          const model = await loadModel();
          const predictions = await model.classify(img);
          const nsfwScore =
            predictions.find(
              (p) => p.className === "Porn" || p.className === "Hentai"
            )?.probability || 0;
          resolve(nsfwScore < 0.7); // ✅ true = safe
        } catch (err) {
          reject(err);
        }
      };
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
