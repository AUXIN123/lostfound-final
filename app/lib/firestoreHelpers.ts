// lib/firestoreHelpers.ts
"use client";

import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  Timestamp 
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";

export const uploadImage = async (file: File): Promise<string> => {
  const storage = getStorage(); // Initialize inside function
  try {
    const storageRef = ref(storage, `lostItems/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const addLostItem = async (itemData: any, imageFile?: File): Promise<string> => {
  const db = getFirestore(); // Initialize inside function
  try {
    let imageURL = '';

    if (imageFile) {
      imageURL = await uploadImage(imageFile);
    }

    const docRef = await addDoc(collection(db, "items"), {
      ...itemData,
      imageURL,
      createdAt: Timestamp.now(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error adding item:", error);
    throw error;
  }
};

export const getLostItems = async (): Promise<any[]> => {
  const db = getFirestore(); // Initialize inside function
  try {
    const querySnapshot = await getDocs(collection(db, "items"));
    const items: any[] = [];
    
    querySnapshot.forEach((doc) => {
      items.push({ 
        id: doc.id, 
        ...doc.data() 
      });
    });
    
    return items;
  } catch (error) {
    console.error("Error loading items:", error);
    throw error;
  }
};// Update lost item
export const updateLostItem = async (itemId: string, updates: any): Promise<void> => {
  const db = getFirestore();
  try {
    await updateDoc(doc(db, "items", itemId), updates);
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};

// Delete lost item
export const deleteLostItem = async (itemId: string): Promise<void> => {
  const db = getFirestore();
  try {
    await deleteDoc(doc(db, "items", itemId));
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};