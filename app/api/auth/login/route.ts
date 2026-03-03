import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/admin';

// Fallback login using environment variables (when Firebase is not configured)
function checkEnvCredentials(username: string, password: string): { userId: string; username: string } | null {
    const user1 = process.env.ADMIN_USER_1;
    const pass1 = process.env.ADMIN_PASS_1;
    const user2 = process.env.ADMIN_USER_2;
    const pass2 = process.env.ADMIN_PASS_2;

    if (user1 && pass1 && username === user1 && password === pass1) {
        return { userId: 'env-user-1', username: user1 };
    }
    if (user2 && pass2 && username === user2 && password === pass2) {
        return { userId: 'env-user-2', username: user2 };
    }
    return null;
}

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Nom d\'utilisateur et mot de passe requis' },
                { status: 400 }
            );
        }

        // Try env credentials first (always works, no Firebase needed)
        const envUser = checkEnvCredentials(username, password);
        if (envUser) {
            const token = generateToken(envUser);
            return NextResponse.json({
                success: true,
                token,
                user: envUser,
            });
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
                        const token = generateToken({ userId: userDoc.id, username });
                        return NextResponse.json({
                            success: true,
                            token,
                            user: { id: userDoc.id, username },
                        });
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
