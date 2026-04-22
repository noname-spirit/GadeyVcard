import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firestore";

/**
 * Génère un slug URL-safe à partir d'un nom complet.
 * Exemple : "Kevin Durand" → "kevin-durand"
 *
 * @param {string} name - Nom brut saisi par l'utilisateur
 * @returns {string} Slug en minuscules, sans caractères spéciaux
 */
function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")                      // décompose les accents
    .replace(/[̀-ͯ]/g, "")       // supprime les diacritiques
    .replace(/[^a-z0-9]+/g, "-")           // remplace tout ce qui n'est pas alphanum par "-"
    .replace(/^-+|-+$/g, "");             // supprime les tirets en début/fin
}

/**
 * Envoie les données d'onboarding dans la collection "cards" de Firestore.
 * Le document est identifié par le slug (unique par carte).
 * Si l'utilisateur n'a pas saisi de slug, il est auto-généré depuis le nom.
 *
 * @param {string} uid - UID Firebase Auth du propriétaire de la carte
 * @param {Object} data - Données complètes du wizard OnboardingData
 * @param {string} data.name          - Nom complet (étape 1)
 * @param {string} data.title         - Titre / métier (étape 1)
 * @param {string} data.phone         - Téléphone (étape 2)
 * @param {string} data.email         - Email (étape 2)
 * @param {string} data.whatsapp      - Numéro WhatsApp (étape 2)
 * @param {string} data.line          - Lien LINE (étape 2)
 * @param {string} data.instagram     - URL Instagram (étape 3)
 * @param {string} data.youtube       - URL YouTube (étape 3)
 * @param {string} data.linkedin      - URL LinkedIn (étape 3)
 * @param {string} data.website       - URL site web (étape 3)
 * @param {string} data.photo         - URL photo de profil (étape 4)
 * @param {'dark'|'light'|'color'} data.template    - Template visuel choisi (étape 4)
 * @param {string} data.accentColor   - Couleur d'accent hex (étape 4)
 * @param {string} data.slug          - Slug URL personnalisé (étape 5)
 *
 * @returns {Promise<string>} Le slug final utilisé comme ID du document
 * @throws {Error} Si l'écriture Firestore échoue
 */
export async function addOnboarding(uid, data) {
  // Utilise le slug saisi ou génère un fallback depuis le nom
  const finalSlug = data.slug?.trim() || slugify(data.name) || uid;

  const cardRef = doc(db, "cards", finalSlug);

  try {
    await setDoc(cardRef, {
      // Propriétaire
      uid,
      slug: finalSlug,

      // Identité (étape 1)
      name: data.name ?? "",
      title: data.title ?? "",

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
      template: data.template ?? "dark",
      accentColor: data.accentColor ?? "#f97316",

      // Métadonnées
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return finalSlug;
  } catch (error) {
    console.error("Erreur lors de la création de la carte :", error);
    throw error;
  }
}
