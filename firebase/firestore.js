// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// /jaklxhjaksxhakxhjlkjh
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "REDACTED_FIREBASE_KEY",
  authDomain: "generateur-vcard.firebaseapp.com",
  projectId: "generateur-vcard",
  storageBucket: "generateur-vcard.firebasestorage.app",
  messagingSenderId: "187676946208",
  appId: "1:187676946208:web:2db51f14d09d8649687145",
  measurementId: "G-T3C5CH4DGY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);