
import { Pool } from '@neondatabase/serverless';

export interface Contact {
    id?: string;
    fn: string;
    title?: string;
    org?: string;
    bday?: string;
    tel_mobile?: string;
    tel_work?: string;
    whatsapp?: string;
    email_personal?: string;
    email_work?: string;
    url?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    tiktok?: string;
    facebook?: string;
    line_id?: string;
    lineLink?: string;
    adr_street?: string;
    adr_city?: string;
    adr_region?: string;
    adr_postal?: string;
    adr_country?: string;
    note?: string;
    photo_url?: string;
    createdAt?: string;
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function insertContact(contact: Contact) {
    const result = await pool.query(
        `INSERT INTO contacts (
            fn, title, org, bday, tel_mobile, tel_work, whatsapp, email_personal, email_work, url,
            instagram, youtube, linkedin, tiktok, facebook, line_id, lineLink, adr_street, adr_city, adr_region,
            adr_postal, adr_country, note, photo_url
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15, $16, $17, $18, $19,
            $20, $21, $22, $23, $24
        ) RETURNING id;`,
        [
            contact.fn,
            contact.title,
            contact.org,
            contact.bday,
            contact.tel_mobile,
            contact.tel_work,
            contact.whatsapp,
            contact.email_personal,
            contact.email_work,
            contact.url,
            contact.instagram,
            contact.youtube,
            contact.linkedin,
            contact.tiktok,
            contact.facebook,
            contact.line_id,
            contact.lineLink,
            contact.adr_street,
            contact.adr_city,
            contact.adr_region,
            contact.adr_postal,
            contact.adr_country,
            contact.note,
            contact.photo_url
        ]
    );
    return result.rows[0];
}

export async function getContact() {
    const result = await pool.query('SELECT * FROM contacts ORDER BY createdAt DESC LIMIT 1;');
    return result.rows[0];
}

export async function updateContact(contact: Contact) {
    await pool.query(
        `UPDATE contacts SET
            fn = $1,
            title = $2,
            org = $3,
            bday = $4,
            tel_mobile = $5,
            tel_work = $6,
            whatsapp = $7,
            email_personal = $8,
            email_work = $9,
            url = $10,
            instagram = $11,
            youtube = $12,
            linkedin = $13,
            tiktok = $14,
            facebook = $15,
            line_id = $16,
            lineLink = $17,
            adr_street = $18,
            adr_city = $19,
            adr_region = $20,
            adr_postal = $21,
            adr_country = $22,
            note = $23,
            photo_url = $24
        WHERE id = $25;`,
        [
            contact.fn,
            contact.title,
            contact.org,
            contact.bday,
            contact.tel_mobile,
            contact.tel_work,
            contact.whatsapp,
            contact.email_personal,
            contact.email_work,
            contact.url,
            contact.instagram,
            contact.youtube,
            contact.linkedin,
            contact.tiktok,
            contact.facebook,
            contact.line_id,
            contact.lineLink,
            contact.adr_street,
            contact.adr_city,
            contact.adr_region,
            contact.adr_postal,
            contact.adr_country,
            contact.note,
            contact.photo_url,
            contact.id
        ]
    );
}
