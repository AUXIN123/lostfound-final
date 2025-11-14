// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBpRh_sYQhvvZLXTuKhShOv5GF5h8XSc7s",
  authDomain: "lostandfound-b454a.firebaseapp.com",
  databaseURL: "https://lostandfound-b454a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lostandfound-b454a",
  storageBucket: "lostandfound-b454a.appspot.com",  // FIXED
  messagingSenderId: "300563641985",
  appId: "1:300563641985:web:bcd9a5459f3dcde7c23f80",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
