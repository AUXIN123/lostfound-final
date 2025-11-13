// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBpRh_sYQhvvZLXTuKhShOv5GF5h8XSc7s",
  authDomain: "lostandfound-b454a.firebaseapp.com",
  projectId: "lostandfound-b454a",
  storageBucket: "lostandfound-b454a.appspot.com", // ✅ FIXED DOMAIN
  messagingSenderId: "300563641985",
  appId: "1:300563641985:web:bcd9a5459f3dcde7c23f80",
  measurementId: "G-RTGTCB4F77",
};

// ✅ Initialize Firebase app only once
const app = initializeApp(firebaseConfig);

// ✅ Export initialized services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// ✅ Default export (optional)
export default app;
