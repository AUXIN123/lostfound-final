import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

/**
 * 🔹 Create or return existing chat for a specific item
 * Each item will only have ONE chat between the same two users
 */
export const getOrCreateChat = async (
  userId1: string,
  userId2: string,
  itemId: string
) => {
  const chatsRef = collection(db, "chats");

  // ✅ Find if chat already exists for this item between these users
  const q = query(
    chatsRef,
    where("itemId", "==", itemId),
    where("participants", "array-contains", userId1)
  );

  const snapshot = await getDocs(q);
  const existingChat = snapshot.docs.find((doc) =>
    doc.data().participants.includes(userId2)
  );

  if (existingChat) {
    return existingChat.id; // ✅ Return existing chat
  }

  // ✅ Otherwise create a new chat
  const newChatRef = doc(collection(db, "chats"));
  await setDoc(newChatRef, {
    participants: [userId1, userId2],
    itemId,
    createdAt: serverTimestamp(),
    lastMessage: "",
  });

  return newChatRef.id;
};

/**
 * ✉️ Send a message
 */
export const sendMessage = async (chatId: string, text: string) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const messagesRef = collection(db, "chats", chatId, "messages");
  await addDoc(messagesRef, {
    text,
    senderId: user.uid,
    createdAt: serverTimestamp(),
  });

  // Update last message for preview list
  await setDoc(
    doc(db, "chats", chatId),
    { lastMessage: text, lastUpdated: serverTimestamp() },
    { merge: true }
  );
};

/**
 * 🔁 Subscribe to messages in real-time
 */
export const subscribeToMessages = (
  chatId: string,
  callback: (messages: any[]) => void
) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  });
};

/**
 * 💬 Subscribe to user's chat list
 */
export const subscribeToUserChats = (
  userId: string,
  callback: (chats: any[]) => void
) => {
  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, where("participants", "array-contains", userId));

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(chats);
  });
};
