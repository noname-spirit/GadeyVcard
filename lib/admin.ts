import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required. Set it in .env.local');
}

export interface TokenPayload {
  userId: string;
  username: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

// All vCard fields supported by mobile devices (iOS & Android)
export const VCARD_FIELDS = [
  { key: 'fn', label: 'Nom complet', type: 'text', required: true },
  { key: 'title', label: 'Titre / Poste', type: 'text', required: false },
  { key: 'org', label: 'Entreprise', type: 'text', required: false },
  { key: 'tel_mobile', label: 'Téléphone mobile', type: 'tel', required: false },
  { key: 'tel_work', label: 'Téléphone bureau', type: 'tel', required: false },
  { key: 'email_personal', label: 'Email personnel', type: 'email', required: false },
  { key: 'email_work', label: 'Email professionnel', type: 'email', required: false },
  { key: 'url', label: 'Site web', type: 'url', required: false },
  { key: 'adr_street', label: 'Rue', type: 'text', required: false },
  { key: 'adr_city', label: 'Ville', type: 'text', required: false },
  { key: 'adr_region', label: 'Région / Province', type: 'text', required: false },
  { key: 'adr_postal', label: 'Code postal', type: 'text', required: false },
  { key: 'adr_country', label: 'Pays', type: 'text', required: false },
  { key: 'instagram', label: 'Instagram URL', type: 'url', required: false },
  { key: 'youtube', label: 'YouTube URL', type: 'url', required: false },
  { key: 'linkedin', label: 'LinkedIn URL', type: 'url', required: false },
  { key: 'tiktok', label: 'TikTok URL', type: 'url', required: false },
  { key: 'facebook', label: 'Facebook URL', type: 'url', required: false },
  { key: 'line_id', label: 'Line ID', type: 'text', required: false },
  { key: 'whatsapp', label: 'WhatsApp', type: 'tel', required: false },
  { key: 'note', label: 'Note / Bio', type: 'textarea', required: false },
  { key: 'photo_url', label: 'Photo URL', type: 'url', required: false },
  { key: 'bday', label: 'Date de naissance', type: 'date', required: false },
] as const;

export type ContactData = Record<string, string>;

// Generate VCF string from contact data
export function generateVCF(data: ContactData, photoBase64?: string | null): string {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
  ];

  if (data.fn) lines.push(`FN:${data.fn}`);
  if (data.title) lines.push(`TITLE:${data.title}`);
  if (data.org) lines.push(`ORG:${data.org}`);

  // Support both field name variants
  const cellPhone = data.tel_mobile || data.tel_cell;
  if (cellPhone) lines.push(`TEL;TYPE=CELL:${cellPhone}`);
  if (data.tel_work) lines.push(`TEL;TYPE=WORK:${data.tel_work}`);

  const personalEmail = data.email_personal || data.email_home;
  if (personalEmail) lines.push(`EMAIL;TYPE=HOME:${personalEmail}`);
  if (data.email_work) lines.push(`EMAIL;TYPE=WORK:${data.email_work}`);
  if (data.url) lines.push(`URL:${data.url}`);

  // Address
  const street = data.adr_street || '';
  const city = data.adr_city || '';
  const region = data.adr_region || '';
  const postal = data.adr_postal || '';
  const country = data.adr_country || '';
  if (street || city || region || postal || country) {
    lines.push(`ADR;TYPE=HOME:;;${street};${city};${region};${postal};${country}`);
  }

  // Social profiles (compatible with iOS/Android)
  if (data.instagram) lines.push(`X-SOCIALPROFILE;TYPE=instagram:${data.instagram}`);
  if (data.youtube) lines.push(`X-SOCIALPROFILE;TYPE=youtube:${data.youtube}`);
  if (data.linkedin) lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${data.linkedin}`);
  if (data.tiktok) lines.push(`X-SOCIALPROFILE;TYPE=tiktok:${data.tiktok}`);
  if (data.facebook) lines.push(`X-SOCIALPROFILE;TYPE=facebook:${data.facebook}`);
  if (data.line_id) lines.push(`X-LINE-ID:${data.line_id}`);
  if (data.whatsapp) lines.push(`TEL;TYPE=WHATSAPP:${data.whatsapp}`);

  if (data.note) lines.push(`NOTE:${data.note}`);

  // Photo embedded as base64 (iOS/Android compatible)
  if (photoBase64) {
    // VCard 3.0 format with base64 encoding - fold lines at 75 chars
    const photoLine = `PHOTO;ENCODING=b;TYPE=JPEG:${photoBase64}`;
    // Split into 75-char chunks for VCF compliance
    const chunks: string[] = [];
    for (let i = 0; i < photoLine.length; i += 75) {
      if (i === 0) {
        chunks.push(photoLine.substring(i, i + 75));
      } else {
        chunks.push(' ' + photoLine.substring(i, i + 75));
      }
    }
    lines.push(chunks.join('\r\n'));
  } else if (data.photo_url) {
    lines.push(`PHOTO;VALUE=uri:${data.photo_url}`);
  }

  if (data.bday) lines.push(`BDAY:${data.bday}`);

  lines.push('END:VCARD');
  return lines.join('\r\n');
}
