"use server";
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/admin';
import { insertLead, getLeads, deleteLead } from '@/lib/db/leads';
import type { Lead } from '@/lib/types/lead';
import { isFirebaseConfigured } from '@/lib/firebase';
import { sendLeadNotificationEmail, sendLeadConfirmationEmail } from '@/lib/email';

// POST - Save a new lead (public)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { nom, email, telephone, domaine, note, source } = body;

        if (!nom?.trim() || !email?.trim() || !telephone?.trim() || !domaine?.trim()) {
            return NextResponse.json({ error: 'Nom, email, téléphone et domaine requis' }, { status: 400 });
        }

        // Sanitize inputs
        const sanitizedNom = nom.trim().substring(0, 100);
        const sanitizedEmail = email.trim().substring(0, 100);
        const sanitizedTelephone = telephone.trim().substring(0, 30);
        const sanitizedDomaine = domaine.trim().substring(0, 50);
        const sanitizedNote = note ? note.trim().substring(0, 1000) : undefined;
        const sanitizedSource = source?.trim().substring(0, 50) || 'formulaire';

        const lead: Lead = {
            nom: sanitizedNom,
            email: sanitizedEmail,
            telephone: sanitizedTelephone,
            domaine: sanitizedDomaine,
            note: sanitizedNote,
            createdAt: new Date().toISOString(),
            source: sanitizedSource,
        };

        // Enregistrement dans Vercel Postgres
        await insertLead(lead);

        // Optionally send notification emails
        try {
            const emailOptions = {
                to: process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@example.com',
                name: lead.nom,
                language: 'fr' as 'fr', // ou détecter dynamiquement si besoin
                contactInfo: `${lead.email} / ${lead.telephone}`,
            };
            await sendLeadNotificationEmail(emailOptions);
            await sendLeadConfirmationEmail({
                to: lead.email,
                name: lead.nom,
                language: 'fr' as 'fr', // ou détecter dynamiquement si besoin
            });
        } catch (emailErr) {
            console.error('Email error:', emailErr);
            // Ignore email errors
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('API /api/leads error:', err);
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

        const dbLeads = await getLeads();
        // Adapter la structure pour le front
        const leads = dbLeads.map((l: any) => ({
            id: l.id?.toString(),
            nom: l.nom,
            email: l.email,
            domaine: l.domaine,
            telephone: l.telephone,
            source: l.source || '',
            createdAt: l.createdat || l.createdAt || '',
        }));
        return new NextResponse(
            JSON.stringify({ leads }),
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

        await deleteLead(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete lead error:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
