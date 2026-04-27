import { NextResponse, type NextRequest } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { FieldValue } from 'firebase-admin/firestore';
import { db } from '@/lib/firebase/config';
import { adminDb } from '@/lib/firebase/admin';

/** Raccourci pour écrire dans Firestore via Admin SDK (bypass règles de sécurité) */
const adminSet = (slug: string, data: object) =>
  adminDb.collection('cards').doc(slug).set({ ...data, vcfUpdatedAt: FieldValue.serverTimestamp() }, { merge: true });

/**
 * Échappe les caractères spéciaux réservés par le format vCard 3.0.
 * Les caractères `\`, `,`, `;` et les retours à la ligne doivent être échappés.
 *
 * @param value - Chaîne brute à échapper
 * @returns Chaîne safe pour insertion dans un fichier .vcf
 */
function escapeVcf(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');
}

/**
 * Construit le contenu texte d'un fichier vCard 3.0 depuis les données de la carte.
 * Seuls les champs renseignés sont inclus (pas de lignes vides).
 *
 * @param data - Données de la carte récupérées depuis Firestore
 * @returns Contenu complet du fichier .vcf (lignes séparées par \r\n)
 */
function buildVcf(data: {
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  website?: string;
  slug: string;
}): string {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${escapeVcf(data.name)}`,
  ];

  if (data.title)   lines.push(`TITLE:${escapeVcf(data.title)}`);
  if (data.email)   lines.push(`EMAIL;TYPE=INTERNET:${data.email}`);
  if (data.phone)   lines.push(`TEL;TYPE=CELL:${data.phone}`);
  if (data.website) lines.push(`URL:${data.website}`);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://smartvcard.app';
  lines.push(`NOTE:Carte créée sur Smart vCard — ${appUrl}/${data.slug}`);
  lines.push('END:VCARD');

  return lines.join('\r\n');
}

/**
 * Corps attendu pour POST /api/cards/[slug]/vcf
 */
interface VCardPayload {
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  website?: string;
}

/**
 * POST /api/cards/[slug]/vcf
 *
 * Reçoit un objet VCard, génère le contenu .vcf correspondant
 * et le sauvegarde dans le document Firestore `cards/{slug}`.
 *
 * Body JSON attendu : { name, title?, email?, phone?, website? }
 *
 * @param request - Requête contenant le corps JSON VCardPayload
 * @param slug    - Identifiant de la carte à mettre à jour
 * @returns JSON { slug, vcf } avec le contenu généré, ou erreur
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await params;

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'Slug invalide' }, { status: 400 });
  }

  let body: VCardPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Corps JSON invalide' }, { status: 400 });
  }

  if (!body.name?.trim()) {
    return NextResponse.json({ error: 'Le champ "name" est requis' }, { status: 422 });
  }

  const vcfContent = buildVcf({
    name:    body.name,
    title:   body.title,
    email:   body.email,
    phone:   body.phone,
    website: body.website,
    slug,
  });

  await adminSet(slug, { vcf: vcfContent });

  return NextResponse.json({ slug, vcf: vcfContent }, { status: 200 });
}

/**
 * GET /api/cards/[slug]/vcf
 *
 * Fetche la carte depuis Firestore et retourne un fichier .vcf téléchargeable.
 * Le navigateur déclenche automatiquement le téléchargement grâce au header
 * `Content-Disposition: attachment`.
 *
 * @param slug - Identifiant unique de la carte (ex: "kevin-durand")
 * @returns Fichier .vcf ou erreur JSON (400 slug invalide / 404 carte introuvable)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await params;

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'Slug invalide' }, { status: 400 });
  }

  const cardSnap = await getDoc(doc(db, 'cards', slug));

  if (!cardSnap.exists()) {
    return NextResponse.json({ error: 'Carte introuvable' }, { status: 404 });
  }

  const card = cardSnap.data();

  const vcfContent = buildVcf({
    name:    card.name ?? 'Smart vCard User',
    title:   card.title ?? undefined,
    email:   card.contact?.email ?? undefined,
    phone:   card.contact?.phone ?? undefined,
    website: card.socials?.website ?? undefined,
    slug,
  });

  await adminSet(slug, { vcf: vcfContent });

  const safeName = slug.replace(/[^a-z0-9-]/gi, '_');

  return new NextResponse(vcfContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${safeName}.vcf"`,
      'Cache-Control': 'no-store',
    },
  });
}
