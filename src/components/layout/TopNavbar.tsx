"use client";

import React, { useEffect, useState } from 'react';
import { Bell, LogOut, Menu, Search, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getCurrentProfile, roleLabels, type ProfileRow } from '@/lib/data';
import { supabase } from '@/lib/supabase';

export function TopNavbar({ setSidebarOpen }: { setSidebarOpen: (val: boolean) => void }) {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const router = useRouter();

  useEffect(() => {
    getCurrentProfile()
      .then(setProfile)
      .catch(() => setProfile(null));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0 dark:bg-slate-900 dark:border-slate-800">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 text-gray-500 rounded-md lg:hidden hover:bg-gray-100 dark:hover:bg-slate-800"
        >
          <Menu size={24} />
        </button>

        <div className="hidden sm:flex items-center bg-gray-100 rounded-md px-3 py-1.5 dark:bg-slate-800">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search assets..."
            className="bg-transparent border-none outline-none ml-2 text-sm w-64 dark:text-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full dark:hover:bg-slate-800">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border border-white dark:border-slate-900"></span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User size={18} />
          </div>
          <div className="hidden md:block text-sm">
            <div className="font-medium text-foreground">{profile?.full_name || profile?.email || 'Signed in'}</div>
            <div className="text-xs text-secondary-foreground/70">
              {profile ? roleLabels[profile.role] : 'Loading'}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full dark:hover:bg-slate-800"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
