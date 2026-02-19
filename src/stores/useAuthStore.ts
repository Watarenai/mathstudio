import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export type PlanType = 'free' | 'pro' | 'family' | 'school';

interface AuthState {
    user: User | null;
    session: Session | null;
    isPro: boolean;
    isFamily: boolean;
    planType: PlanType;
    loading: boolean;
    error: string | null;
    isConfigured: boolean;

    // Actions
    initialize: () => Promise<void>;
    signUp: (email: string, password: string) => Promise<boolean>;
    signIn: (email: string, password: string) => Promise<boolean>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    clearError: () => void;
    checkSubscription: () => Promise<void>; // サブスク状態確認用
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    session: null,
    isPro: false,
    isFamily: false,
    planType: 'free',
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
            if (session?.user) {
                await get().checkSubscription();
            }

            // セッション変更をリッスン
            supabase.auth.onAuthStateChange(async (_event, session) => {
                set({
                    user: session?.user ?? null,
                    session,
                });
                if (session?.user) {
                    await get().checkSubscription();
                } else {
                    set({ isPro: false, isFamily: false, planType: 'free' });
                }
            });
        } catch {
            set({ loading: false, error: '認証の初期化に失敗しました' });
        }
    },

    checkSubscription: async () => {
        if (!supabase) return;
        const { user } = get();
        if (!user) return;

        const { data } = await supabase
            .from('user_profiles')
            .select('is_pro, plan_type')
            .eq('id', user.id)
            .single();

        if (data) {
            const plan = (data.plan_type ?? 'free') as PlanType;
            set({
                isPro: data.is_pro || plan === 'pro' || plan === 'family' || plan === 'school',
                isFamily: plan === 'family',
                planType: plan,
            });
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

    signInWithGoogle: async () => {
        if (!supabase) return;
        set({ loading: true, error: null });
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                }
            });
            if (error) throw error;
        } catch (e: any) {
            set({ loading: false, error: e.message || 'Google認証に失敗しました' });
        }
    },

    signOut: async () => {
        if (!supabase) return;
        set({ loading: true });
        await supabase.auth.signOut();
        set({ user: null, session: null, isPro: false, isFamily: false, planType: 'free', loading: false });
    },

    clearError: () => set({ error: null }),
}));
