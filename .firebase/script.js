// ================================
// 🔥 Firebase Lost & Found Script
// ================================

// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

// ================================
// 🔧 Firebase Config
// ================================
const firebaseConfig = {
  apiKey: "AIzaSyBnp_qYWVnZ1IHaUSHyo5VF6RP6s2hZs7k",
  authDomain: "lostandfound-b454a.firebaseapp.com",
  projectId: "lostandfound-b454a",
  storageBucket: "lostandfound-b454a.firebasestorage.app",
  messagingSenderId: "300563641985",
  appId: "1:300563641985:web:bcd9a5459f3dcde7c23f80",
  measurementId: "G-RT0TC84F77",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

console.log("✅ Firebase connected successfully!");

// ================================
// 🧩 DOM Elements
// ================================
const titleInput = document.querySelector("#title");
const locationInput = document.querySelector("#location");
const descriptionInput = document.querySelector("#description");
const fileInput = document.querySelector("#photo");
const previewImage = document.querySelector("#preview");
const postButton = document.querySelector("#postButton");

// ================================
// 🖼️ Image Preview
// ================================
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
      previewImage.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

// ================================
// 🚀 Post Lost Item
// ================================
postButton.addEventListener("click", async () => {
  const title = titleInput.value.trim();
  const location = locationInput.value.trim();
  const description = descriptionInput.value.trim();
  const file = fileInput.files[0];

  if (!title || !location || !description || !file) {
    alert("⚠️ Please fill all fields and attach a photo.");
    return;
  }

  try {
    postButton.disabled = true;
    postButton.innerText = "Uploading...";

    // Upload image to Firebase Storage
    const storageRef = ref(storage, `lostItems/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const imageURL = await getDownloadURL(storageRef);

    // Add item to Firestore
    await addDoc(collection(db, "lostItems"), {
      title,
      location,
      description,
      imageURL,
      createdAt: Timestamp.now(),
    });

    alert("✅ Lost item posted successfully!");

    // Reset form
    titleInput.value = "";
    locationInput.value = "";
    descriptionInput.value = "";
    fileInput.value = "";
    previewImage.style.display = "none";

  } catch (error) {
    console.error("❌ Error adding lost item:", error);
    alert("Failed to post item. Check console for details.");
  } finally {
    postButton.disabled = false;
    postButton.innerText = "Post Lost Item";
  }
});
