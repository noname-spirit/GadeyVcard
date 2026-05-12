'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

// Catches errors thrown inside the root layout (rare but catastrophic without this)
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="fr">
      <body style={{ margin: 0, background: '#09090b', fontFamily: 'sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', textAlign: 'center', maxWidth: '22rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={24} color="#fb7185" />
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 8px' }}>
                Erreur critique
              </p>
              <p style={{ color: '#71717a', fontSize: '0.875rem', margin: 0 }}>
                L&apos;application a rencontré un problème inattendu.
              </p>
              {error.digest && (
                <p style={{ color: '#3f3f46', fontSize: '0.75rem', fontFamily: 'monospace', marginTop: 8 }}>
                  #{error.digest}
                </p>
              )}
            </div>
            <button
              onClick={reset}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 12, background: '#f97316', color: '#fff', fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}
            >
              <RotateCcw size={14} />
              Réessayer
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
