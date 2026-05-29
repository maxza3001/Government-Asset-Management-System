import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://autnwgskdabbcpedsgpz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1dG53Z3NrZGFiYmNwZWRzZ3B6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNTczNzgsImV4cCI6MjA5NTYzMzM3OH0.Lp1FDEj2timgar1eSUKvvkJELdTFOeAlxeygLxMwLks';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
