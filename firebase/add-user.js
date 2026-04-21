import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firestore";

/**
 * Ajoute un utilisateur dans la collection "users" de Firestore.
 * @param {string} uid - L'UID Firebase Auth de l'utilisateur
 * @param {{ displayName?: string, email?: string, photoURL?: string }} data
 */
export async function addUser(uid, data = {}) {
  const userRef = doc(db, "users", uid);

  try {
  await setDoc(userRef, {
    uid,
    displayName: data.displayName ?? null,
    email: data.email ?? null,
    photoURL: data.photoURL ?? null,
    createdAt: serverTimestamp(),
  }, { merge: true });

  }catch (error) {
    console.error("Error adding user to Firestore:", error);
    throw error;
  }

}
