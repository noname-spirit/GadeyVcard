export interface Lead {
    nom: string;
    email: string;
    telephone: string;
    domaine: string;
    note?: string;
    createdAt: string; // ISO date string
    source: string;
}

// Exemple d'utilisation :
// const newLead: Lead = {
//   nom: "Jean Dupont",
//   email: "jean.dupont@email.com",
//   telephone: "+33612345678",
//   createdAt: new Date().toISOString(),
//   source: "formulaire"
// };
