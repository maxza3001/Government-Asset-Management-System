"use client";

import React, { useEffect, useState } from 'react';
import { Save, Settings } from 'lucide-react';
import { getSystemSettings, upsertSystemSettings, writeAuditLog } from '@/lib/data';

type SettingsForm = {
  organizationName: string;
  fiscalYear: string;
  assetCodePrefix: string;
  notifyBeforeReturnDays: string;
};

const defaultForm: SettingsForm = {
  organizationName: '',
  fiscalYear: '2569',
  assetCodePrefix: 'AST',
  notifyBeforeReturnDays: '3',
};

function readString(value: unknown, fallback: string) {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : fallback;
}

export default function SettingsPage() {
  const [form, setForm] = useState<SettingsForm>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getSystemSettings()
      .then((rows) => {
        const settings = Object.fromEntries(rows.map((row) => [row.key, row.value]));
        setForm({
          organizationName: readString(settings.organization_name, defaultForm.organizationName),
          fiscalYear: readString(settings.fiscal_year, defaultForm.fiscalYear),
          assetCodePrefix: readString(settings.asset_code_prefix, defaultForm.assetCodePrefix),
          notifyBeforeReturnDays: readString(settings.notify_before_return_days, defaultForm.notifyBeforeReturnDays),
        });
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    setError('');
    setMessage('');

    try {
      await upsertSystemSettings({
        organization_name: form.organizationName,
        fiscal_year: form.fiscalYear,
        asset_code_prefix: form.assetCodePrefix,
        notify_before_return_days: Number(form.notifyBeforeReturnDays || 0),
      });
      await writeAuditLog('settings.updated', 'system_settings', undefined, form);
      setMessage('Settings saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <Settings className="text-primary" /> System Settings
        </h1>
        <p className="text-sm text-gray-500">Values are stored in Supabase system_settings.</p>
      </div>

      {error && <div className="rounded-lg border border-danger/20 bg-danger/10 p-3 text-danger">{error}</div>}
      {message && <div className="rounded-lg border border-success/20 bg-success/10 p-3 text-success">{message}</div>}

      <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium">
            Organization name
            <input
              value={form.organizationName}
              onChange={(event) => setForm({ ...form, organizationName: event.target.value })}
              className="mt-1 w-full rounded-md border px-3 py-2 font-normal dark:bg-slate-900 dark:border-slate-700"
            />
          </label>
          <label className="block text-sm font-medium">
            Fiscal year
            <input
              value={form.fiscalYear}
              onChange={(event) => setForm({ ...form, fiscalYear: event.target.value })}
              className="mt-1 w-full rounded-md border px-3 py-2 font-normal dark:bg-slate-900 dark:border-slate-700"
            />
          </label>
          <label className="block text-sm font-medium">
            Asset code prefix
            <input
              value={form.assetCodePrefix}
              onChange={(event) => setForm({ ...form, assetCodePrefix: event.target.value })}
              className="mt-1 w-full rounded-md border px-3 py-2 font-normal uppercase dark:bg-slate-900 dark:border-slate-700"
            />
          </label>
          <label className="block text-sm font-medium">
            Return reminder days
            <input
              type="number"
              min="0"
              value={form.notifyBeforeReturnDays}
              onChange={(event) => setForm({ ...form, notifyBeforeReturnDays: event.target.value })}
              className="mt-1 w-full rounded-md border px-3 py-2 font-normal dark:bg-slate-900 dark:border-slate-700"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
