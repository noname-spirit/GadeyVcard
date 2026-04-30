'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/supabase/AuthProvider';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const devBypass = process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true';

  useEffect(() => {
    if (devBypass) return;
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router, devBypass]);

  if (!devBypass && loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!devBypass && !user) return null;

  return <>{children}</>;
}
