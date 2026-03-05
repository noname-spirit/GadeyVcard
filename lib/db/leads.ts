import { Pool } from '@neondatabase/serverless';

export interface Lead {
    id?: string;
    nom: string;
    email: string;
    telephone: string;
    createdAt: string;
    source: string;
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const result = await pool.query(
    'INSERT INTO leads (nom, email, telephone, createdAt, source) VALUES ($1, $2, $3, $4, $5) RETURNING id;',
    [lead.nom, lead.email, lead.telephone, lead.createdAt, lead.source]
);
return result.rows[0];
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const result = await pool.query('SELECT * FROM leads ORDER BY createdAt DESC;');
return result.rows;
}
