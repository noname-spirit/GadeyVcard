import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/admin';
import { isFirebaseConfigured } from '@/lib/firebase';
import { insertContact, getContact, updateContact } from '@/lib/db/contact';

// GET - Retrieve contact data (public)
export async function GET() {
    try {
        // Utilise uniquement la base Postgres
        const data = await getContact();
        return new NextResponse(
            JSON.stringify({ data }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                    'Pragma': 'no-cache',
                    'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none';",
                    'X-Frame-Options': 'DENY',
                    'X-Content-Type-Options': 'nosniff',
                    'Referrer-Policy': 'no-referrer',
                }
            }
        );
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

        // Enregistrement uniquement dans la base Postgres
        if (fields.id) {
            await updateContact(fields);
        } else {
            await insertContact(fields);
        }
        return NextResponse.json({ success: true, storage: 'postgres' });
    } catch (error) {
        console.error('Update contact error:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}
