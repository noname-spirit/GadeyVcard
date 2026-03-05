declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ADMIN_USER_1?: string;
            ADMIN_PASS_HASH_1?: string;
            ADMIN_USER_2?: string;
            ADMIN_PASS_HASH_2?: string;
        }
    }
}
import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/admin';
import bcrypt from 'bcryptjs';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

// Fallback login using environment variables (when Firebase is not configured)
// Passwords are stored as bcrypt hashes encoded in base64 (avoids $ issues in .env)
async function checkEnvCredentials(username: string, password: string): Promise<{ userId: string; username: string } | null> {
    const user1 = process.env.ADMIN_USER_1;
    const hash1b64 = process.env.ADMIN_PASS_HASH_1;
    const user2 = process.env.ADMIN_USER_2;
    const hash2b64 = process.env.ADMIN_PASS_HASH_2;

    if (user1 && hash1b64 && username === user1) {
        const hash1 = Buffer.from(hash1b64, 'base64').toString('utf-8');
        if (await bcrypt.compare(password, hash1)) {
            return { userId: 'env-user-1', username: user1 };
        }
    }
    if (user2 && hash2b64 && username === user2) {
        const hash2 = Buffer.from(hash2b64, 'base64').toString('utf-8');
        if (await bcrypt.compare(password, hash2)) {
            return { userId: 'env-user-2', username: user2 };
        }
    }
    return null;
}

export async function POST(req: NextRequest) {
    try {
        // Rate limiting: 5 attempts per 15 minutes per IP
        const ip = getClientIp(req);
        const limit = checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
        if (!limit.allowed) {
            const retryMinutes = Math.ceil(limit.retryAfterMs / 60000);
            return NextResponse.json(
                { error: `Trop de tentatives. Réessayez dans ${retryMinutes} min.` },
                { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.retryAfterMs / 1000)) } }
            );
        }

        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Nom d\'utilisateur et mot de passe requis' },
                { status: 400 }
            );
        }

        // Try env credentials first (always works, no Firebase needed)
        const envUser = await checkEnvCredentials(username, password);
        if (envUser) {
            const jwtToken = generateToken(envUser);
            const response = NextResponse.json({
                success: true,
                user: envUser,
            });
            response.cookies.set('admin_token', jwtToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 2 * 60 * 60, // 2 hours
            });
            return response;
        }

        // Try Firebase if configured
        try {
            const { isFirebaseConfigured } = await import('@/lib/firebase');
            if (isFirebaseConfigured()) {
                const { db } = await import('@/lib/firebase');
                const { collection, getDocs, query, where } = await import('firebase/firestore');
                const bcrypt = (await import('bcryptjs')).default;

                const userQuery = query(
                    collection(db, 'admin_users'),
                    where('username', '==', username)
                );
                const userSnap = await getDocs(userQuery);

                if (!userSnap.empty) {
                    const userDoc = userSnap.docs[0];
                    const userData = userDoc.data();
                    const isValid = await bcrypt.compare(password, userData.password);

                    if (isValid) {
                        const jwtToken = generateToken({ userId: userDoc.id, username });
                        const response = NextResponse.json({
                            success: true,
                            user: { id: userDoc.id, username },
                        });
                        response.cookies.set('admin_token', jwtToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            path: '/',
                            maxAge: 2 * 60 * 60,
                        });
                        return response;
                    }
                }
            }
        } catch {
            // Firebase not configured, skip
        }

        return NextResponse.json(
            { error: 'Identifiants incorrects' },
            { status: 401 }
        );
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}
