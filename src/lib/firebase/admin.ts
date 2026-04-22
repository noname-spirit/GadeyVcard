import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Initialise le SDK Firebase Admin avec les credentials du compte de service.
 * Utilise un guard pour éviter la re-initialisation en Next.js hot reload.
 * Requiert les variables d'environnement :
 *   - FIREBASE_PROJECT_ID
 *   - FIREBASE_CLIENT_EMAIL
 *   - FIREBASE_PRIVATE_KEY  (avec \n pour les sauts de ligne)
 */
function initAdminApp() {
  if (getApps().length > 0) return getApps()[0];

  return initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const adminApp = initAdminApp();

/** Instance Firestore Admin — bypass les règles de sécurité */
export const adminDb = getFirestore(adminApp);
