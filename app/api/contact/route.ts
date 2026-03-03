import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/admin';
import { isFirebaseConfigured } from '@/lib/firebase';
import { readLocalContact, writeLocalContact } from '@/lib/local-storage';

// GET - Retrieve contact data (public)
export async function GET() {
    try {
        // Try Firebase first (only if configured)
        if (isFirebaseConfigured()) {
            try {
                const { db } = await import('@/lib/firebase');
                const { doc, getDoc } = await import('firebase/firestore');
                const docRef = doc(db, 'contact_info', 'main_contact');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    return NextResponse.json({ data: docSnap.data() });
                }
            } catch {
                // Firebase error, use local
            }
        }

        // Fallback to local JSON
        const data = readLocalContact();
        return NextResponse.json({ data });
    } catch (error) {
        console.error('Get contact error:', error);
        return NextResponse.json({ data: {} });
    }
}

// PUT - Update contact data (auth required)
export async function PUT(req: NextRequest) {
    try {
        // Verify auth — read from httpOnly cookie (primary) or Authorization header (fallback)
        let token = req.cookies.get('admin_token')?.value;
        if (!token) {
            const authHeader = req.headers.get('authorization');
            if (authHeader?.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
        }
        if (!token) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
        }

        const body = await req.json();
        const { fields } = body;

        if (!fields || typeof fields !== 'object') {
            return NextResponse.json(
                { error: 'Données invalides' },
                { status: 400 }
            );
        }

        // Try Firebase first (only if configured)
        let savedToFirebase = false;
        if (isFirebaseConfigured()) {
            try {
                const { db } = await import('@/lib/firebase');
                const { doc, setDoc } = await import('firebase/firestore');
                const docRef = doc(db, 'contact_info', 'main_contact');
                await setDoc(docRef, {
                    ...fields,
                    updatedAt: new Date().toISOString(),
                    updatedBy: payload.username,
                }, { merge: true });
                savedToFirebase = true;
            } catch {
                // Firebase error
            }
        }

        // Always save locally as backup
        const existing = readLocalContact();
        writeLocalContact({
            ...existing,
            ...fields,
            updatedAt: new Date().toISOString(),
            updatedBy: payload.username,
        });

        return NextResponse.json({ success: true, storage: savedToFirebase ? 'firebase+local' : 'local' });
    } catch (error) {
        console.error('Update contact error:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}
