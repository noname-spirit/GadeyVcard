import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

interface UserData {
  displayName?: string;
  email?: string;
  photoURL?: string;
}

/**
 * Crée ou met à jour le document profil dans la collection "users".
 * Le document est identifié par l'UID Firebase Auth de l'utilisateur.
 * Utilise { merge: true } pour ne pas écraser un profil existant
 * si l'utilisateur se reconnecte ou met à jour son compte.
 *
 * @param uid  - UID Firebase Auth de l'utilisateur
 * @param data - Données du profil : displayName, email, photoURL
 */
export async function addUser(uid: string, data: UserData = {}): Promise<void> {
  const userRef = doc(db, 'users', uid);

  try {
    await setDoc(userRef, {
      uid,
      displayName: data.displayName ?? null,
      email:       data.email       ?? null,
      photoURL:    data.photoURL    ?? null,
      createdAt:   serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error('Erreur lors de la création du profil utilisateur :', error);
    throw error;
  }
}
