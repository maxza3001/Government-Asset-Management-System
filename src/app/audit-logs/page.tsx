"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Search, ShieldAlert } from 'lucide-react';
import { getAuditLogs, getProfiles, jsonToText, type AuditLogRow, type ProfileRow } from '@/lib/data';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [search, setSearch] = useState('');
  const [tableName, setTableName] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getAuditLogs(), getProfiles()])
      .then(([logRows, profileRows]) => {
        setLogs(logRows);
        setProfiles(profileRows);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const profileById = useMemo(() => new Map(profiles.map((profile) => [profile.id, profile])), [profiles]);
  const tables = useMemo(
    () => Array.from(new Set(logs.map((log) => log.table_name).filter(Boolean) as string[])).sort(),
    [logs],
  );

  const filteredLogs = useMemo(() => {
    const query = search.toLowerCase();
    return logs.filter((log) => {
      const actor = log.user_id ? profileById.get(log.user_id) : null;
      const haystack = [
        log.action,
        log.table_name ?? '',
        log.record_id ?? '',
        actor?.email ?? '',
        actor?.full_name ?? '',
        jsonToText(log.details),
      ].join(' ').toLowerCase();

      return (tableName === 'all' || log.table_name === tableName) && haystack.includes(query);
    });
  }, [logs, profileById, search, tableName]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading audit logs...</div>;
  }

  if (error) {
    return <div className="rounded-lg border border-danger/20 bg-danger/10 p-4 text-danger">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <ShieldAlert className="text-primary" /> Audit Logs
        </h1>
        <p className="text-sm text-gray-500">Recent Supabase audit log activity.</p>
      </div>

      <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search action, actor, record, or details..."
              className="w-full rounded-md border py-2 pl-10 pr-3 dark:bg-slate-900 dark:border-slate-700"
            />
          </div>
          <select value={tableName} onChange={(event) => setTableName(event.target.value)} className="rounded-md border px-3 py-2 dark:bg-slate-900 dark:border-slate-700">
            <option value="all">All tables</option>
            {tables.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-slate-900/50">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Table</th>
                <th className="px-4 py-3">Record</th>
                <th className="px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                const actor = log.user_id ? profileById.get(log.user_id) : null;
                return (
                  <tr key={log.id} className="border-t align-top dark:border-slate-700">
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(log.created_at).toLocaleString('th-TH')}</td>
                    <td className="px-4 py-3">
                      <div>{actor?.full_name || actor?.email || '-'}</div>
                      <div className="text-xs text-gray-500">{log.user_id || '-'}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-primary">{log.action}</td>
                    <td className="px-4 py-3">{log.table_name || '-'}</td>
                    <td className="px-4 py-3 text-xs">{log.record_id || '-'}</td>
                    <td className="px-4 py-3 max-w-sm truncate" title={jsonToText(log.details)}>{jsonToText(log.details)}</td>
                  </tr>
                );
              })}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No audit logs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
