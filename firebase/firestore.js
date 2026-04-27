// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZar-nOYC7X5AtffYVqQPX4uVr9a4XE54",
  authDomain: "generateur-vcard.firebaseapp.com",
  projectId: "generateur-vcard",
  storageBucket: "generateur-vcard.firebasestorage.app",
  messagingSenderId: "187676946208",
  appId: "1:187676946208:web:2db51f14d09d8649687145",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);