"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    const finishSignIn = async () => {
      const next = searchParams.get('next') || '/dashboard';
      const code = searchParams.get('code');

      if (!code) {
        setErrorMessage('Missing authentication code from provider.');
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!mounted) {
        return;
      }

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      router.replace(next);
    };

    finishSignIn();

    return () => {
      mounted = false;
    };
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/90 to-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl dark:bg-slate-900">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Shield size={32} />
        </div>
        <h1 className="text-xl font-bold text-foreground">Completing sign in</h1>
        {errorMessage ? (
          <div className="mt-5 rounded-lg border border-danger/20 bg-danger/10 px-3 py-2 text-sm text-danger">
            {errorMessage}
          </div>
        ) : (
          <div className="mt-5 flex flex-col items-center gap-3 text-sm text-gray-500">
            <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            <p>Please wait while Supabase verifies your Google account.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-primary/90 to-primary flex items-center justify-center p-4">
          <div className="h-8 w-8 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
