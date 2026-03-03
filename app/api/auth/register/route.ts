import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/admin';

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Nom d\'utilisateur et mot de passe requis' },
                { status: 400 }
            );
        }

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

        const token = generateToken({ userId: docRef.id, username });

        return NextResponse.json({
            success: true,
            token,
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
