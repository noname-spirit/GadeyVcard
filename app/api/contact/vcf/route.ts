import { NextResponse } from 'next/server';
import { generateVCF } from '@/lib/admin';
import { isFirebaseConfigured } from '@/lib/firebase';
import { readLocalContact } from '@/lib/local-storage';

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

// Try Firebase, fall back to local JSON, then default
async function getContactData(): Promise<Record<string, string> | null> {
    // Try Firebase first (only if configured)
    if (isFirebaseConfigured()) {
        try {
            const { db } = await import('@/lib/firebase');
            const { doc, getDoc } = await import('firebase/firestore');
            const docRef = doc(db, 'contact_info', 'main_contact');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) return docSnap.data() as Record<string, string>;
        } catch (error) {
            console.log('Firebase error for VCF:', error);
        }
    }

    // Fall back to local JSON
    try {
        const local = readLocalContact();
        if (local && Object.keys(local).length > 0) return local;
    } catch (error) {
        console.log('Local storage error for VCF:', error);
    }

    // Fallback to default contact
    return DEFAULT_CONTACT;
}

// GET - Generate and download VCF file dynamically
export async function GET() {
    try {
        const data = await getContactData();

        if (!data) {
            return new NextResponse('Contact not found', { status: 404 });
        }

        const vcfContent = generateVCF(data);
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
