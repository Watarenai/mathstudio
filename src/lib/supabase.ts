import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        '[MathStudio] Supabase未設定: .envにVITE_SUPABASE_URLとVITE_SUPABASE_ANON_KEYを設定してください。ゲスト（ローカル）モードで動作します。'
    );
}

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = !!supabase;
