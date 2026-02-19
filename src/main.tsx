import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import App from './App.tsx'
import LandingPage from './components/LandingPage.tsx'
import AuthPage from './components/AuthPage.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { useAuthStore } from './stores/useAuthStore.ts'
import { isSupabaseConfigured } from './lib/supabase.ts'
import './index.css'

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,   // 'development' or 'production'
    enabled: import.meta.env.PROD,       // 本番環境のみ送信
    tracesSampleRate: 0.1,               // 10% のトランザクションをトレース
})

type Screen = 'landing' | 'auth' | 'app';

const Root = () => {
    const [screen, setScreen] = useState<Screen>('landing');
    const { user, loading, initialize } = useAuthStore();

    // Supabase セッション復元
    useEffect(() => {
        initialize();
    }, []);

    // ログイン済みならアプリへ直行
    useEffect(() => {
        if (!loading && user) {
            setScreen('app');
        }
    }, [loading, user]);

    // ランディングページ
    if (screen === 'landing') {
        return <LandingPage onStart={() => {
            if (isSupabaseConfigured && !user) {
                setScreen('auth');
            } else {
                setScreen('app');
            }
        }} />;
    }

    // 認証画面（Supabase設定済み かつ 未ログイン）
    if (screen === 'auth' && isSupabaseConfigured && !user) {
        return <AuthPage onSkip={() => setScreen('app')} />;
    }

    // メインアプリ
    return <App />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ErrorBoundary>
            <Root />
        </ErrorBoundary>
    </React.StrictMode>,
)
