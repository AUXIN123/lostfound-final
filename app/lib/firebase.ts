import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TEMPORARY: Hardcoded config for testing
const firebaseConfig = {
  apiKey: "AIzaSyBpRh_sYQhvvZLXTuKhShOv5GF5h8XSc7s",
  authDomain: "lostandfound-b454a.firebaseapp.com",
  projectId: "lostandfound-b454a",
  storageBucket: "lostandfound-b454a.firebasestorage.app",
  messagingSenderId: "300563641985",
  appId: "1:300563641985:web:bcd9a5459f3dcde7c23f80",
};

console.log("🔥 Using API Key:", firebaseConfig.apiKey);

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;