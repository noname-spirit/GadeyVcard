import { Pool } from '@neondatabase/serverless';

export interface Contact {
    id?: string;
    nom: string;
    email: string;
    message: string;
    createdAt?: string;
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function insertContact(contact: Contact) {
    const result = await pool.query(
        'INSERT INTO contacts (nom, email, message, createdAt) VALUES ($1, $2, $3, NOW()) RETURNING id;',
        [contact.nom, contact.email, contact.message]
    );
    return result.rows[0];
}

export async function getContact() {
    const result = await pool.query('SELECT * FROM contacts ORDER BY createdAt DESC LIMIT 1;');
    return result.rows[0];
}

export async function updateContact(contact: Contact) {
    await pool.query(
        'UPDATE contacts SET nom = $1, email = $2, message = $3 WHERE id = $4;',
        [contact.nom, contact.email, contact.message, contact.id]
    );
}
