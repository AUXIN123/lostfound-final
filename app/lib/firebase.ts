// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// ✅ Firebase configuration (fallback for local dev)
const localConfig = {
  apiKey: "AIzaSyBpRh_sYQhvvZLXTuKhShOv5GF5h8XSc7s",
  authDomain: "lostandfound-b454a.firebaseapp.com",
  projectId: "lostandfound-b454a",
  storageBucket: "lostandfound-b454a.appspot.com",
  messagingSenderId: "300563641985",
  appId: "1:300563641985:web:bcd9a5459f3dcde7c23f80",
  measurementId: "G-RTGTCB4F77",
};

// ✅ Use environment variables if available (for production)
const firebaseConfig = process.env.FIREBASE_API_KEY
  ? {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    }
  : localConfig;

// ✅ Initialize Firebase app only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Export initialized services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
