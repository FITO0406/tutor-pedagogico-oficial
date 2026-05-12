import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('Faltan variables de entorno de Supabase (URL o SERVICE_ROLE_KEY)');
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey);
