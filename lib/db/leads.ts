import { sql } from '@vercel/postgres';

export interface Lead {
    id?: string;
    nom: string;
    email: string;
    telephone: string;
    createdAt: string;
    source: string;
}

export async function saveLead(lead: Lead) {
    const result = await sql`
    INSERT INTO leads (nom, email, telephone, createdAt, source)
    VALUES (${lead.nom}, ${lead.email}, ${lead.telephone}, ${lead.createdAt}, ${lead.source})
    RETURNING id;
  `;
    return result.rows[0];
}

export async function getLeads() {
    const result = await sql`SELECT * FROM leads ORDER BY createdAt DESC;`;
    return result.rows;
}
