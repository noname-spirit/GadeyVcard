import { doc, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import type { OnboardingData } from '@/components/onboarding/OnboardingWizard';

/**
 * Génère un slug URL-safe à partir d'un nom complet.
 * Exemple : "Kevin Durand" → "kevin-durand"
 *
 * @param name - Nom brut saisi par l'utilisateur
 * @returns Slug en minuscules, sans caractères spéciaux ni accents
 */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Envoie les données d'onboarding dans la collection "cards" de Firestore.
 * Le document est identifié par le slug (unique par carte).
 * Si l'utilisateur n'a pas saisi de slug, il est auto-généré depuis le nom.
 *
 * @param uid  - UID Firebase Auth du propriétaire de la carte
 * @param data - Données complètes du wizard OnboardingData
 * @returns Le slug final utilisé comme ID du document
 * @throws Si l'écriture Firestore échoue
 */
export async function addOnboarding(uid: string, data: OnboardingData): Promise<string> {
  const finalSlug = data.slug?.trim() || slugify(data.name) || uid;

  const cardRef = doc(db, 'cards', finalSlug);

  try {
    await setDoc(cardRef, {
      uid,
      slug: finalSlug,

      // Identité (étape 1)
      name: data.name ?? '',
      title: data.title ?? '',

      // Contact (étape 2)
      contact: {
        phone: data.phone || null,
        email: data.email || null,
        whatsapp: data.whatsapp || null,
        line: data.line || null,
      },

      // Réseaux sociaux (étape 3)
      socials: {
        instagram: data.instagram || null,
        youtube: data.youtube || null,
        linkedin: data.linkedin || null,
        website: data.website || null,
      },

      // Visuel (étape 4)
      photo: data.photo || null,
      template: data.template ?? 'dark',
      accentColor: data.accentColor ?? '#f97316',

      // Métadonnées
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Ajoute le slug dans le tableau "cards" du profil utilisateur
    // arrayUnion évite les doublons si la carte existe déjà
    await updateDoc(doc(db, 'users', uid), {
      cards: arrayUnion(finalSlug),
    });

    return finalSlug;
  } catch (error) {
    console.error('Erreur lors de la création de la carte :', error);
    throw error;
  }
}
