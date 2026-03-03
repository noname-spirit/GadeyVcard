import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/admin';
import { readLocalLeads, writeLocalLeads, Lead } from '@/lib/local-storage';
import { isFirebaseConfigured } from '@/lib/firebase';

// POST - Save a new lead (public)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, contact, language } = body;

        if (!name?.trim() || !contact?.trim()) {
            return NextResponse.json({ error: 'Nom et contact requis' }, { status: 400 });
        }

        // Sanitize inputs
        const sanitizedName = name.trim().substring(0, 100);
        const sanitizedContact = contact.trim().substring(0, 200);

        const lead: Lead = {
            id: crypto.randomUUID(),
            name: sanitizedName,
            contact: sanitizedContact,
            language: language || 'fr',
            timestamp: new Date().toISOString(),
        };

        // Try Firebase first
        if (isFirebaseConfigured()) {
            try {
                const { db } = await import('@/lib/firebase');
                const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
                await addDoc(collection(db, 'leads'), {
                    ...lead,
                    timestamp: serverTimestamp(),
                });
            } catch {
                // Firebase error, save locally
            }
        }

        // Always save locally as well
        const leads = readLocalLeads();
        leads.unshift(lead);
        writeLocalLeads(leads);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Save lead error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// GET - Retrieve leads (auth required)
export async function GET(req: NextRequest) {
    try {
        // Verify auth
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

        const leads = readLocalLeads();
        return NextResponse.json({ leads });
    } catch (error) {
        console.error('Get leads error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// DELETE - Delete a lead (auth required)
export async function DELETE(req: NextRequest) {
    try {
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

        const { id } = await req.json();
        if (!id) {
            return NextResponse.json({ error: 'ID requis' }, { status: 400 });
        }

        const leads = readLocalLeads();
        const filtered = leads.filter(l => l.id !== id);
        writeLocalLeads(filtered);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete lead error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
