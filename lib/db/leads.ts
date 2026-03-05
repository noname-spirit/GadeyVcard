export async function deleteLead(id: string) {
    await pool.query('DELETE FROM leads WHERE id = $1', [id]);
}

import { Pool } from '@neondatabase/serverless';

export interface Lead {
    id?: string;
    nom: string;
    email: string;
    telephone: string;
    domaine: string;
    createdAt: string;
    source: string;
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function insertLead(lead: Lead) {
    const result = await pool.query(
        'INSERT INTO leads (nom, email, telephone, domaine, createdAt, source) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;',
        [lead.nom, lead.email, lead.telephone, lead.domaine, lead.createdAt, lead.source]
    );
    return result.rows[0];
}

export async function getLeads() {
    const result = await pool.query('SELECT * FROM leads ORDER BY createdAt DESC;');
    return result.rows;
}
