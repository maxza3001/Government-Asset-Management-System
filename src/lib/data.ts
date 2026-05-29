import { supabase } from './supabase';
import type { Json, ProfileRole, Tables } from './database.types';

export type AssetRow = Tables<'assets'>;
export type BorrowRow = Tables<'borrows'>;
export type MaintenanceRow = Tables<'maintenance'>;
export type ProfileRow = Tables<'profiles'>;
export type AuditLogRow = Tables<'audit_logs'>;
export type SystemSettingRow = Tables<'system_settings'>;

export const roleLabels: Record<ProfileRole, string> = {
  super_admin: 'Super Admin',
  asset_admin: 'Asset Admin',
  staff: 'Staff',
  user: 'User',
  auditor: 'Auditor',
};

function requireData<T>(data: T | null, error: { message: string } | null): T {
  if (error) {
    throw new Error(error.message);
  }
  if (data === null) {
    throw new Error('No data returned from Supabase.');
  }
  return data;
}

export async function getCurrentProfile() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error(userError.message);
  }
  const user = userData.user;
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getAssets() {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .order('created_at', { ascending: false });
  return requireData(data as AssetRow[] | null, error);
}

export async function getBorrows() {
  const { data, error } = await supabase
    .from('borrows')
    .select('*')
    .order('created_at', { ascending: false });
  return requireData(data as BorrowRow[] | null, error);
}

export async function getMaintenanceItems() {
  const { data, error } = await supabase
    .from('maintenance')
    .select('*')
    .order('created_at', { ascending: false });
  return requireData(data as MaintenanceRow[] | null, error);
}

export async function getProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  return requireData(data as ProfileRow[] | null, error);
}

export async function updateProfile(
  id: string,
  values: Pick<ProfileRow, 'full_name' | 'role' | 'department'>,
) {
  const { data, error } = await supabase
    .from('profiles')
    .update(values)
    .eq('id', id)
    .select('*')
    .single();
  return requireData(data as ProfileRow | null, error);
}

export async function getAuditLogs() {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(250);
  return requireData(data as AuditLogRow[] | null, error);
}

export async function writeAuditLog(action: string, tableName?: string, recordId?: string, details?: Json) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return;
  }

  await supabase.from('audit_logs').insert({
    user_id: userData.user.id,
    action,
    table_name: tableName ?? null,
    record_id: recordId ?? null,
    details: details ?? null,
  });
}

export async function getSystemSettings() {
  const { data, error } = await supabase
    .from('system_settings')
    .select('*')
    .order('key', { ascending: true });
  return requireData(data as SystemSettingRow[] | null, error);
}

export async function upsertSystemSettings(settings: Record<string, Json>) {
  const { data: userData } = await supabase.auth.getUser();
  const rows = Object.entries(settings).map(([key, value]) => ({
    key,
    value,
    updated_by: userData.user?.id ?? null,
  }));

  const { data, error } = await supabase
    .from('system_settings')
    .upsert(rows, { onConflict: 'key' })
    .select('*');

  return requireData(data as SystemSettingRow[] | null, error);
}

export function jsonToText(value: Json | null) {
  if (value === null) {
    return '-';
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return JSON.stringify(value);
}
