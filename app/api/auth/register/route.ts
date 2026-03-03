import { NextRequest, NextResponse } from 'next/server';
import { isFirebaseConfigured } from '@/lib/firebase';
import bcrypt from 'bcryptjs';
import { generateToken, verifyToken } from '@/lib/admin';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
    try {
        // Rate limiting: 3 attempts per 15 minutes per IP
        const ip = getClientIp(req);
        const limit = checkRateLimit(`register:${ip}`, 3, 15 * 60 * 1000);
        if (!limit.allowed) {
            const retryMinutes = Math.ceil(limit.retryAfterMs / 60000);
            return NextResponse.json(
                { error: `Trop de tentatives. Réessayez dans ${retryMinutes} min.` },
                { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.retryAfterMs / 1000)) } }
            );
        }

        // Require admin authentication — httpOnly cookie (primary) or Bearer header (fallback)
        let authToken = req.cookies.get('admin_token')?.value;
        if (!authToken) {
            const authHeader = req.headers.get('authorization');
            if (authHeader?.startsWith('Bearer ')) {
                authToken = authHeader.split(' ')[1];
            }
        }
        if (!authToken) {
            return NextResponse.json(
                { error: 'Authentification requise pour créer un utilisateur' },
                { status: 401 }
            );
        }
        const payload = verifyToken(authToken);
        if (!payload) {
            return NextResponse.json(
                { error: 'Token invalide ou expiré' },
                { status: 401 }
            );
        }

        // Firebase required for registration
        if (!isFirebaseConfigured()) {
            return NextResponse.json(
                { error: 'Firebase requis pour l\'inscription. Gérez les comptes via .env.local' },
                { status: 503 }
            );
        }

        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Nom d\'utilisateur et mot de passe requis' },
                { status: 400 }
            );
        }

        // Password complexity: min 8 chars, 1 uppercase, 1 lowercase, 1 digit
        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Le mot de passe doit contenir au moins 8 caractères' },
                { status: 400 }
            );
        }
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
            return NextResponse.json(
                { error: 'Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule et 1 chiffre' },
                { status: 400 }
            );
        }

        const { db } = await import('@/lib/firebase');
        const { collection, getDocs, addDoc, query, where } = await import('firebase/firestore');

        // Check max 2 users
        const usersSnap = await getDocs(collection(db, 'admin_users'));
        if (usersSnap.size >= 2) {
            return NextResponse.json(
                { error: 'Maximum 2 utilisateurs atteint' },
                { status: 403 }
            );
        }

        // Check if username already exists
        const existingQuery = query(
            collection(db, 'admin_users'),
            where('username', '==', username)
        );
        const existingSnap = await getDocs(existingQuery);
        if (!existingSnap.empty) {
            return NextResponse.json(
                { error: 'Ce nom d\'utilisateur existe déjà' },
                { status: 409 }
            );
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 12);
        const docRef = await addDoc(collection(db, 'admin_users'), {
            username,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
        });

        const newToken = generateToken({ userId: docRef.id, username });

        return NextResponse.json({
            success: true,
            token: newToken,
            user: { id: docRef.id, username },
        });
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}
