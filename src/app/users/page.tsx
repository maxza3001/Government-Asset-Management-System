"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Edit, Save, Search, Users, X } from 'lucide-react';
import {
  getProfiles,
  roleLabels,
  updateProfile,
  writeAuditLog,
  type ProfileRow,
} from '@/lib/data';
import type { ProfileRole } from '@/lib/database.types';

const roles = Object.keys(roleLabels) as ProfileRole[];

export default function UsersPage() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [editing, setEditing] = useState<ProfileRow | null>(null);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getProfiles()
      .then(setProfiles)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredProfiles = useMemo(() => {
    const query = search.toLowerCase();
    return profiles.filter((profile) => {
      const matchesRole = role === 'all' || profile.role === role;
      const matchesSearch =
        profile.email.toLowerCase().includes(query) ||
        (profile.full_name ?? '').toLowerCase().includes(query) ||
        (profile.department ?? '').toLowerCase().includes(query);
      return matchesRole && matchesSearch;
    });
  }, [profiles, role, search]);

  const saveProfile = async () => {
    if (!editing) {
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const updated = await updateProfile(editing.id, {
        full_name: editing.full_name,
        role: editing.role,
        department: editing.department,
      });

      setProfiles((items) => items.map((item) => (item.id === updated.id ? updated : item)));
      await writeAuditLog('profile.updated', 'profiles', updated.id, {
        email: updated.email,
        role: updated.role,
      });
      setEditing(null);
      setMessage('Profile updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <Users className="text-primary" /> User Management
        </h1>
        <p className="text-sm text-gray-500">Manage existing Supabase profiles only.</p>
      </div>

      {error && <div className="rounded-lg border border-danger/20 bg-danger/10 p-3 text-danger">{error}</div>}
      {message && <div className="rounded-lg border border-success/20 bg-success/10 p-3 text-success">{message}</div>}

      <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, or department..."
              className="w-full rounded-md border py-2 pl-10 pr-3 dark:bg-slate-900 dark:border-slate-700"
            />
          </div>
          <select value={role} onChange={(event) => setRole(event.target.value)} className="rounded-md border px-3 py-2 dark:bg-slate-900 dark:border-slate-700">
            <option value="all">All roles</option>
            {roles.map((item) => (
              <option key={item} value={item}>{roleLabels[item]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-slate-900/50">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfiles.map((profile) => (
                <tr key={profile.id} className="border-t dark:border-slate-700">
                  <td className="px-4 py-3">
                    <div className="font-medium">{profile.full_name || '-'}</div>
                    <div className="text-xs text-gray-500">{profile.email}</div>
                  </td>
                  <td className="px-4 py-3">{profile.department || '-'}</td>
                  <td className="px-4 py-3">{roleLabels[profile.role]}</td>
                  <td className="px-4 py-3">{new Date(profile.created_at).toLocaleDateString('th-TH')}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setEditing(profile)} className="inline-flex rounded-md p-2 text-primary hover:bg-primary/10" title="Edit profile">
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProfiles.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No profiles found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Edit Profile</h2>
              <button onClick={() => setEditing(null)} className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-slate-800">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <label className="block text-sm">
                Full name
                <input value={editing.full_name ?? ''} onChange={(event) => setEditing({ ...editing, full_name: event.target.value })} className="mt-1 w-full rounded-md border px-3 py-2 dark:bg-slate-800 dark:border-slate-700" />
              </label>
              <label className="block text-sm">
                Department
                <input value={editing.department ?? ''} onChange={(event) => setEditing({ ...editing, department: event.target.value })} className="mt-1 w-full rounded-md border px-3 py-2 dark:bg-slate-800 dark:border-slate-700" />
              </label>
              <label className="block text-sm">
                Role
                <select value={editing.role} onChange={(event) => setEditing({ ...editing, role: event.target.value as ProfileRole })} className="mt-1 w-full rounded-md border px-3 py-2 dark:bg-slate-800 dark:border-slate-700">
                  {roles.map((item) => (
                    <option key={item} value={item}>{roleLabels[item]}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="rounded-md border px-4 py-2 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800">Cancel</button>
              <button onClick={saveProfile} disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
                <Save size={16} />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
