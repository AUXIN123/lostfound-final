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
 * Create or return an existing chat between two users
 */
export const getOrCreateChat = async (userId1: string, userId2: string) => {
  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, where("participants", "in", [
    [userId1, userId2],
    [userId2, userId1],
  ]));

  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    return snapshot.docs[0].id;
  }

  // Create new chat
  const newChat = await addDoc(chatsRef, {
    participants: [userId1, userId2],
    createdAt: serverTimestamp(),
  });
  return newChat.id;
};

/**
 * Send a message
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
};

/**
 * Subscribe to messages in real-time
 */
export const subscribeToMessages = (chatId: string, callback: (messages: any[]) => void) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  });
};

/**
 * Get user's chat list
 */
export const subscribeToUserChats = (userId: string, callback: (chats: any[]) => void) => {
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