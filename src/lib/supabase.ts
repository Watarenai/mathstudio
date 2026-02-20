import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// [DIAGNOSTIC] 環境変数の読み込み状態を確認（問題解決後に削除）
console.info('[ENV CHECK] VITE_SUPABASE_URL:', supabaseUrl ? `✅ 設定済み (${supabaseUrl.slice(0, 30)}...)` : '❌ 未設定');
console.info('[ENV CHECK] VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ 設定済み' : '❌ 未設定');

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        '[MathStudio] Supabase未設定: .envにVITE_SUPABASE_URLとVITE_SUPABASE_ANON_KEYを設定してください。ゲスト（ローカル）モードで動作します。'
    );
}

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = !!supabase;
