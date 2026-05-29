"use client";

import React, { useState } from 'react';
import { Shield, Mail, Lock, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push('/dashboard');
  };

  const handleGoogleLogin = async () => {
    setOauthLoading(true);
    setErrorMessage('');

    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback?next=/dashboard`
        : undefined;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setOauthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/90 to-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background Design */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10 dark:bg-slate-900 border border-white/20 dark:border-slate-800">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <Shield size={32} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">ระบบบริหารครุภัณฑ์ราชการ</h1>
            <p className="text-gray-500 text-sm mt-2 dark:text-gray-400">เข้าสู่ระบบ (Smart Asset Management)</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">อีเมล หรือ ชื่อผู้ใช้งาน</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all"
                  placeholder="admin@gov.th"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-foreground">รหัสผ่าน</label>
                <a href="#" className="text-xs text-primary hover:underline">ลืมรหัสผ่าน?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-lg border border-danger/20 bg-danger/10 px-3 py-2 text-sm text-danger">
                {errorMessage}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  <span>เข้าสู่ระบบ</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 dark:bg-slate-900 dark:text-gray-400">หรือเข้าสู่ระบบด้วย</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={oauthLoading}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium dark:border-slate-700 dark:hover:bg-slate-800 dark:text-white disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {oauthLoading ? 'Opening...' : 'Google'}
              </button>
              <button type="button" className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium dark:border-slate-700 dark:hover:bg-slate-800 dark:text-white">
                <Shield className="w-4 h-4 text-primary" />
                Thai Digital ID
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-8 py-4 text-center text-xs text-gray-500 border-t border-gray-100 dark:bg-slate-900/50 dark:border-slate-800 dark:text-gray-400">
          <p>&copy; 2026 Government Smart Asset Management</p>
          <p className="mt-1">For authorized personnel only.</p>
        </div>
      </div>
    </div>
  );
}
