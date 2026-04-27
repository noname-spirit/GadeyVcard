export interface Lead {
  id?: string;
  card_slug: string;      // vCard propriétaire du formulaire
  nom: string;
  contact: string;        // WhatsApp, LINE ou Email — champ libre
  telephone?: string;
  domaine?: string;       // secteur d'activité
  message?: string;
  source: 'formulaire' | 'qr_code' | 'direct';
  language?: 'fr' | 'en' | 'th';
  created_at?: string;
}

export interface LeadFormData {
  nom: string;
  contact: string;
  telephone: string;
  domaine: string;
  domaineCustom: string;
  message: string;
}
