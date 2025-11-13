import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { getStorage } from "firebase-admin/storage";
import vision from "@google-cloud/vision";

admin.initializeApp();
const client = new vision.ImageAnnotatorClient();

export const detectNsfw = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;
  if (!filePath) return null;

  const [result] = await client.safeSearchDetection(`gs://${object.bucket}/${filePath}`);
  const detections = result.safeSearchAnnotation || {};
  const { adult, violence, racy } = detections;

  const bad = ["LIKELY", "VERY_LIKELY"];

  if (bad.includes(adult) || bad.includes(violence) || bad.includes(racy)) {
    console.log("🚫 NSFW content detected. Deleting:", filePath);
    await getStorage().bucket(object.bucket).file(filePath).delete();
  } else {
    console.log("✅ Image is safe:", filePath);
  }

  return null;
});
