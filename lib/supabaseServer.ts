import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseServiceRoleKey);

if (!hasSupabaseConfig) {
  console.warn('Faltan variables de entorno de Supabase (URL o SERVICE_ROLE_KEY)');
}

export const supabaseServer = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

export const isSupabaseConfigured = (): boolean => hasSupabaseConfig;
