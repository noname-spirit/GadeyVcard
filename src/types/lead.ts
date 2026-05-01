export interface Lead {
  id?: string;
  card_id: string;
  name: string;
  email?: string;
  phone?: string;
  domain?: string;
  message?: string;
  statut?: string;
  notes?: string;
  source?: string;
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
