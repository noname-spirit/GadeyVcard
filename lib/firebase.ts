import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// ...existing code...
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// ...existing code...
// ...existing code...
export { db };
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase is actually configured (not placeholder values)
export function isFirebaseConfigured(): boolean {
    const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    return !!(
        key && projectId &&
        !key.includes('YOUR_') &&
        !projectId.includes('YOUR_')
    );
}

let app: FirebaseApp | null = null;
let _db: Firestore | null = null;

function getDb(): Firestore {
    if (!isFirebaseConfigured()) {
        throw new Error('Firebase not configured');
    }
    if (!app) {
        app = initializeApp(firebaseConfig);
    }
    if (!_db) {
        _db = getFirestore(app);
    }
    return _db;
}

export const db = new Proxy({} as Firestore, {
    get(_, prop) {
        const realDb = getDb();
        const value = (realDb as unknown as Record<string | symbol, unknown>)[prop];
        if (typeof value === 'function') {
            return value.bind(realDb);
        }
        return value;
    }
});
