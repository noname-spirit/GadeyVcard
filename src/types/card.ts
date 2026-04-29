export interface CardSocials {
  instagram?: string;
  youtube?: string;
  website?: string;
  linkedin?: string;
  tiktok?: string;
  twitter?: string;
}

export interface CardContact {
  phone?: string;
  email?: string;
  whatsapp?: string;
  line?: string;
}

export interface CardCaptureForm {
  title?: string;       // ex: "Audit de Marque Gratuit"
  subtitle?: string;    // ex: "3 conseils offerts sous 24h"
  ctaLabel?: string;    // ex: "Recevoir mon audit" | "Envoyer mes infos"
}

export interface CardData {
  id: string;
  slug: string;           // URL : domain.com/slug
  name: string;
  title: string;
  photo: string;          // URL de la photo de profil
  socials: CardSocials;
  contact: CardContact;
  accentColor?: string;   // couleur brand personnalisée (hex)
  template?: 'dark' | 'light' | 'color' | 'influencer';
  updatedAt?: string;
  plan?: 'business' | 'pro' | "free"; // détermine l'accès au formulaire de capture
  captureForm?: CardCaptureForm;
}

export type CardTheme = 'dark' | 'light';
export type CardLanguage = 'fr' | 'en' | 'th';
