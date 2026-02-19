import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export type PlanType = 'free' | 'pro' | 'family' | 'school';

interface AuthState {
    user: User | null;
    session: Session | null;
    isPro: boolean;
    isAdmin: boolean;
    isFamily: boolean;
    planType: PlanType;
    loading: boolean;
    error: string | null;
    isConfigured: boolean;
    children: any[]; // UserProfile型を本来定義すべき

    // Actions
    initialize: () => Promise<void>;

    signUp: (email: string, password: string) => Promise<boolean>;
    signIn: (email: string, password: string) => Promise<boolean>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    clearError: () => void;
    checkSubscription: () => Promise<void>; // サブスク状態確認用
    fetchChildren: () => Promise<void>;
    createChildAccount: (name: string, password: string, grade: string) => Promise<any>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    session: null,
    isPro: false,
    isAdmin: false,
    isFamily: false,
    planType: 'free',
    loading: true,
    error: null,
    isConfigured: isSupabaseConfigured,
    children: [],


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
            .select('is_pro, plan_type, is_admin')
            .eq('id', user.id)
            .single();

        if (data) {
            const plan = (data.plan_type ?? 'free') as PlanType;
            set({
                isPro: data.is_pro || plan === 'pro' || plan === 'family' || plan === 'school',
                isAdmin: data.is_admin || false,
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
        set({ user: null, session: null, isPro: false, isAdmin: false, isFamily: false, planType: 'free', loading: false, children: [] });
    },

    clearError: () => set({ error: null }),

    // Family Plan Actions

    fetchChildren: async () => {
        if (!supabase) return;
        const { user } = get();
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('parent_id', user.id);

            if (error) throw error;
            set({ children: data || [] });
        } catch (e: any) {
            console.error('Failed to fetch children:', e);
            if (e.message?.includes('Invalid token') || e.code === '401' || e.status === 401) {
                await get().signOut();
            }
        }
    },

    createChildAccount: async (name, _ignoredPassword, grade) => {
        if (!supabase) return false;
        set({ loading: true });
        try {
            const { data, error } = await supabase.functions.invoke('create-child-account', {
                body: { childName: name, childGrade: grade }
            });

            if (error) throw new Error(error.message || 'Function Invoke Error');
            if (data.error) throw new Error(data.error);

            await get().fetchChildren();
            set({ loading: false });
            return data; // { user, credentials: { email, password } }
        } catch (e: any) {
            console.error(e);
            let message = e.message || 'Unknown error';

            // セッション切れ対策
            if (message.includes('Invalid token') || message.includes('Unauthorized') || (e?.status === 401)) {
                await get().signOut();
                message = 'セッションの有効期限が切れました。再度ログインしてください。';
            }

            set({ loading: false, error: message });
            return false;
        }
    },
}));
