import { NextResponse } from 'next/server';
import { generateVCF } from '@/lib/admin';
import { isFirebaseConfigured } from '@/lib/firebase';
import fs from 'fs';
import path from 'path';

// Default contact data (fallback for production)
const DEFAULT_CONTACT = {
    fn: 'Nonames-spirit',
    title: 'Graphiste Logo & Web | Branding',
    org: 'Noname-spirit',
    tel_cell: '+33761234327',
    whatsapp: '+33761234327',
    email_work: 'bonjour@noname-spirit.com',
    instagram: 'https://www.instagram.com/nonamespirit/',
    url: 'https://noname-spirit.vercel.app/',
    note: 'Travaillons ensemble : https://linktr.ee/nonamespirit',
};

// Get photo as base64 for VCF embedding
function getPhotoBase64(): string | null {
    try {
        const photoPath = path.join(process.cwd(), 'public', 'noname-spirit.jpg');
        if (fs.existsSync(photoPath)) {
            const photoBuffer = fs.readFileSync(photoPath);
            return photoBuffer.toString('base64');
        }
    } catch (error) {
        console.log('Could not load photo for VCF:', error);
    }
    return null;
}

// Récupère le contact depuis la base Postgres, fallback sur DEFAULT_CONTACT
async function getContactData(): Promise<Record<string, string> | null> {
    try {
        const { getContact } = await import('@/lib/db/contact');
        const contact = await getContact();
        if (contact) return contact;
    } catch (error) {
        console.log('Postgres error for VCF:', error);
    }
    return DEFAULT_CONTACT;
}

// GET - Generate and download VCF file dynamically
export async function GET() {
    try {
        const data = await getContactData();

        if (!data) {
            return new NextResponse('Contact not found', { status: 404 });
        }

        // Get photo base64 for embedding
        const photoBase64 = getPhotoBase64();

        const vcfContent = generateVCF(data, photoBase64);
        const fileName = data.fn
            ? `${data.fn.replace(/\s+/g, '_')}_Contact.vcf`
            : 'Contact.vcf';

        return new NextResponse(vcfContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/x-vcard; charset=utf-8',
                'Content-Disposition': `attachment; filename="${fileName}"`,
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Pragma': 'no-cache',
                'Content-Length': String(new TextEncoder().encode(vcfContent).length),
            },
        });
    } catch (error) {
        console.error('VCF generation error:', error);
        return new NextResponse('Erreur serveur', { status: 500 });
    }
}
