declare namespace NodeJS {
    interface ProcessEnv {
        NOTIFICATION_EMAIL?: string;
        RESEND_API_KEY?: string;
        DATABASE_URL?: string;
        NEXT_PUBLIC_META_PIXEL_ID?: string;
        JWT_SECRET?: string;
        NEXT_PUBLIC_FIREBASE_API_KEY?: string;
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?: string;
        NEXT_PUBLIC_FIREBASE_PROJECT_ID?: string;
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?: string;
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?: string;
        NEXT_PUBLIC_FIREBASE_APP_ID?: string;
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?: string;
        // Ajoute ici d'autres variables d'environnement si besoin
    }
}
