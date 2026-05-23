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

export interface CardStats {
  followers?: string;   // Ex : "128K"
  engagement?: string;  // Ex : "4.2%"
  collab?: string;      // Ex : "50+"
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
  template?: 'dark' | 'light' | 'color' | 'influencer' | 'restaurant' | 'artist' | 'immobilier' | 'photo';
  updatedAt?: string;
  plan?: 'free' | 'starter' | 'pro' | 'business';
  captureForm?: CardCaptureForm;
  calendlyUrl?: string;
  availabilityStatus?: string;
  availabilityText?: string;
  stats?: CardStats;
}

export type CardTheme = 'dark' | 'light';
export type CardLanguage = 'fr' | 'en' | 'th';
