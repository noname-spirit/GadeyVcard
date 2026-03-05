"use server";
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/admin';
import { saveLead } from '@/lib/db/leads';
import type { Lead } from '@/lib/types/lead';
import { isFirebaseConfigured } from '@/lib/firebase';
import { sendLeadNotificationEmail, sendLeadConfirmationEmail } from '@/lib/email';

// POST - Save a new lead (public)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { nom, email, telephone, source } = body;

        if (!nom?.trim() || !email?.trim() || !telephone?.trim()) {
            return NextResponse.json({ error: 'Nom, email et téléphone requis' }, { status: 400 });
        }

        // Sanitize inputs
        const sanitizedNom = nom.trim().substring(0, 100);
        const sanitizedEmail = email.trim().substring(0, 100);
        const sanitizedTelephone = telephone.trim().substring(0, 30);
        const sanitizedSource = source?.trim().substring(0, 50) || 'formulaire';

        const lead: Lead = {
            nom: sanitizedNom,
            email: sanitizedEmail,
            telephone: sanitizedTelephone,
            createdAt: new Date().toISOString(),
            source: sanitizedSource,
        };

        // Enregistrement dans Vercel Postgres
        await saveLead(lead);

        // Optionally send notification emails
        try {
            await sendLeadNotificationEmail(lead);
            await sendLeadConfirmationEmail(lead);
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
