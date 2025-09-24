import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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

export const auth = getAuth(app);
