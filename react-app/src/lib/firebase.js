import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "upview-ventures-sbhack.firebaseapp.com",
  projectId: "upview-ventures-sbhack",
  storageBucket: "upview-ventures-sbhack.firebasestorage.app",
  messagingSenderId: "950149196797",
  appId: "1:950149196797:web:71d27b1cd436fbd0800794",
  measurementId: "G-1HVWML614Q"
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
