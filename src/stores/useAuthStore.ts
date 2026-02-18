import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    session: Session | null;
    loading: boolean;
    error: string | null;
    isConfigured: boolean;

    // Actions
    initialize: () => Promise<void>;
    signUp: (email: string, password: string) => Promise<boolean>;
    signIn: (email: string, password: string) => Promise<boolean>;
    signOut: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    loading: true,
    error: null,
    isConfigured: isSupabaseConfigured,

    initialize: async () => {
        if (!supabase) {
            set({ loading: false, isConfigured: false });
            return;
        }

        try {
            const { data: { session } } = await supabase.auth.getSession();
            set({
                user: session?.user ?? null,
                session,
                loading: false,
            });

            // セッション変更をリッスン
            supabase.auth.onAuthStateChange((_event, session) => {
                set({
                    user: session?.user ?? null,
                    session,
                });
            });
        } catch {
            set({ loading: false, error: '認証の初期化に失敗しました' });
        }
    },

    signUp: async (email, password) => {
        if (!supabase) return false;
        set({ loading: true, error: null });

        try {
            const { data, error } = await supabase.auth.signUp({ email, password });
            if (error) {
                set({ loading: false, error: error.message });
                return false;
            }
            set({ user: data.user, session: data.session, loading: false });
            return true;
        } catch {
            set({ loading: false, error: 'ネットワークエラーが発生しました' });
            return false;
        }
    },

    signIn: async (email, password) => {
        if (!supabase) return false;
        set({ loading: true, error: null });

        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                const msg = error.message === 'Invalid login credentials'
                    ? 'メールアドレスまたはパスワードが正しくありません'
                    : error.message;
                set({ loading: false, error: msg });
                return false;
            }
            set({ user: data.user, session: data.session, loading: false });
            return true;
        } catch {
            set({ loading: false, error: 'ネットワークエラーが発生しました' });
            return false;
        }
    },

    signOut: async () => {
        if (!supabase) return;
        set({ loading: true });
        await supabase.auth.signOut();
        set({ user: null, session: null, loading: false });
    },

    clearError: () => set({ error: null }),
}));
