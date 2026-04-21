import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { app } from './firestore';

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

const ERROR_MESSAGES = {
  'auth/invalid-email':            'L\'adresse email n\'est pas valide.',
  'auth/invalid-credential':       'Email ou mot de passe incorrect.',
  'auth/user-not-found':           'Aucun compte associé à cet email.',
  'auth/wrong-password':           'Mot de passe incorrect.',
  'auth/user-disabled':            'Ce compte a été désactivé.',
  'auth/email-already-in-use':     'Un compte existe déjà avec cet email.',
  'auth/weak-password':            'Le mot de passe doit contenir au moins 6 caractères.',
  'auth/too-many-requests':        'Trop de tentatives. Réessayez dans quelques minutes.',
  'auth/network-request-failed':   'Problème de connexion. Vérifiez votre réseau.',
  'auth/popup-closed-by-user':     'Connexion Google annulée.',
  'auth/popup-blocked':            'La fenêtre Google a été bloquée. Autorisez les popups.',
  'auth/cancelled-popup-request':  'Connexion Google annulée.',
  'auth/account-exists-with-different-credential': 'Un compte existe déjà avec cet email via une autre méthode.',
  'auth/operation-not-allowed':    'Cette méthode de connexion n\'est pas activée.',
};

export function getFirebaseAuthError(error) {
  return ERROR_MESSAGES[error?.code] ?? 'Une erreur est survenue. Réessayez.';
}
