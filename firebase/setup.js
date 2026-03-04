// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2ZjDm10vIORyOyOScG5adduReNn-oWro",
  authDomain: "smartvcard-d5f0b.firebaseapp.com",
  projectId: "smartvcard-d5f0b",
  storageBucket: "smartvcard-d5f0b.firebasestorage.app",
  messagingSenderId: "42665772190",
  appId: "1:42665772190:web:15338166cc3e33028ae78f",
  measurementId: "G-V09J3L6H42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only on client-side)
if (typeof window !== 'undefined') {
  getAnalytics(app);
}

export default app;