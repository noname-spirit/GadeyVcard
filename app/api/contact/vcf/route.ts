import { NextResponse } from 'next/server';
import { generateVCF } from '@/lib/admin';
import { isFirebaseConfigured } from '@/lib/firebase';
import { readLocalContact } from '@/lib/local-storage';

// Try Firebase, fall back to local JSON
async function getContactData(): Promise<Record<string, string> | null> {
    // Try Firebase first (only if configured)
    if (isFirebaseConfigured()) {
        try {
            const { db } = await import('@/lib/firebase');
            const { doc, getDoc } = await import('firebase/firestore');
            const docRef = doc(db, 'contact_info', 'main_contact');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) return docSnap.data() as Record<string, string>;
        } catch {
            console.log('Firebase error for VCF, using local storage');
        }
    }

    // Fall back to local JSON
    const local = readLocalContact();
    if (local && Object.keys(local).length > 0) return local;

    return null;
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
                'Content-Type': 'text/vcard; charset=utf-8',
                'Content-Disposition': `inline; filename="${fileName}"`,
            },
        });
    } catch (error) {
        console.error('VCF generation error:', error);
        return new NextResponse('Erreur serveur', { status: 500 });
    }
}
