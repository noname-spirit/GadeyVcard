import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'REDACTED_FIREBASE_KEY',
  authDomain: 'generateur-vcard.firebaseapp.com',
  projectId: 'generateur-vcard',
  storageBucket: 'generateur-vcard.firebasestorage.app',
  messagingSenderId: '187676946208',
  appId: '1:187676946208:web:2db51f14d09d8649687145',
};

// Prevent re-initialization in Next.js hot reload
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
