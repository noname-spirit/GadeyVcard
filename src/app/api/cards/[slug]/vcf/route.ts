import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

function escapeVcf(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');
}

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

interface VCardPayload {
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  website?: string;
}

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

  const vcfContent = buildVcf({ name: body.name, title: body.title, email: body.email, phone: body.phone, website: body.website, slug });

  const supabase = createClient();
  await supabase.from('cards').update({ vcf: vcfContent }).eq('slug', slug);

  return NextResponse.json({ slug, vcf: vcfContent }, { status: 200 });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await params;

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'Slug invalide' }, { status: 400 });
  }

  const supabase = createClient();
  const { data: card } = await supabase.from('cards').select('*').eq('slug', slug).single();

  if (!card) {
    return NextResponse.json({ error: 'Carte introuvable' }, { status: 404 });
  }

  const vcfContent = buildVcf({
    name:    card.name ?? 'Smart vCard User',
    title:   card.title ?? undefined,
    email:   card.email ?? undefined,
    phone:   card.phone ?? undefined,
    website: card.website ?? undefined,
    slug,
  });

  await supabase.from('cards').update({ vcf: vcfContent }).eq('slug', slug);

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
