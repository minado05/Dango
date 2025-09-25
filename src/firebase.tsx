import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Get a reference to the storage service, which is used to create references in your storage bucket

// Create a storage reference from our storage service

const firebaseConfig = {
  apiKey: "AIzaSyBp5fpw5ay3LjOfQo661tZ85xv-5qr9JEc",
  authDomain: "dango-a380a.firebaseapp.com",
  projectId: "dango-a380a",
  storageBucket: "dango-a380a.firebasestorage.app",
  messagingSenderId: "338827472716",
  appId: "1:338827472716:web:ab6a2404fa2e00ab3729e9",
  measurementId: "G-54WKBV22B9",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage();
export const auth = getAuth(app);
export const db = getFirestore(app);
