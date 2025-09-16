import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCMHsINLAFxp_G-ou_2dqorjMLr0kk4tMc",
  authDomain: "vacay-a87fa.firebaseapp.com",
  projectId: "vacay-a87fa",
  storageBucket: "vacay-a87fa.firebasestorage.app",
  messagingSenderId: "712552147196",
  appId: "1:712552147196:web:f88dcf57316be2d7764f79",
  measurementId: "G-WW2L1YWPSR",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
