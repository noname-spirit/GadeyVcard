import { NextResponse, type NextRequest } from 'next/server';

// TODO : remplacer par un fetch Firestore quand la table cards est créée
interface VcfData {
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  website?: string;
  photo?: string;
  slug: string;
}

function buildVcf(data: VcfData): string {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${escapeVcf(data.name)}`,
  ];

  if (data.title) {
    lines.push(`TITLE:${escapeVcf(data.title)}`);
  }
  if (data.email) {
    lines.push(`EMAIL;TYPE=INTERNET:${data.email}`);
  }
  if (data.phone) {
    lines.push(`TEL;TYPE=CELL:${data.phone}`);
  }
  if (data.website) {
    lines.push(`URL:${data.website}`);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://smartvcard.app';
  lines.push(`NOTE:Carte créée sur Smart vCard — ${appUrl}/${data.slug}`);
  lines.push('END:VCARD');

  return lines.join('\r\n');
}

function escapeVcf(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await params;

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'Slug invalide' }, { status: 400 });
  }

  // TODO : remplacer par un fetch Firestore une fois les cartes en base
  const mockCard: VcfData = {
    name: 'Smart vCard User',
    title: '',
    email: '',
    phone: '',
    website: '',
    slug,
  };

  const vcfContent = buildVcf(mockCard);
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
