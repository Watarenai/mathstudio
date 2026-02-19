import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import App from './App.tsx'
import LandingPage from './components/LandingPage.tsx'
import AuthPage from './components/AuthPage.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { useAuthStore } from './stores/useAuthStore.ts'
import { useGameStore } from './stores/useGameStore.ts'
import { isSupabaseConfigured } from './lib/supabase.ts'
import AdminDashboard from './pages/AdminDashboard.tsx'
import './index.css'

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,   // 'development' or 'production'
    enabled: import.meta.env.PROD,       // 本番環境のみ送信
    tracesSampleRate: 0.1,               // 10% のトランザクションをトレース
})


// ... (keep imports)

const Root = () => {
    const { view, setView } = useGameStore();
    const { user, loading, initialize } = useAuthStore();

    // URL Check for Admin
    useEffect(() => {
        if (window.location.pathname === '/admin') {
            useGameStore.setState({ view: 'admin' });
        }
    }, []);

    // Supabase セッション復元
    useEffect(() => {
        initialize();
    }, []);

    // ログイン済みならアプリへ直行 (ただし、現在が landing/auth の場合のみ)
    useEffect(() => {
        if (!loading && user && (view === 'landing' || view === 'auth')) {
            setView('app');
        }
    }, [loading, user, view, setView]);

    // ランディングページ
    if (view === 'landing') {
        return <LandingPage
            onStart={() => {
                if (isSupabaseConfigured && !user) {
                    setView('auth');
                } else {
                    setView('app');
                }
            }}
            onLogin={() => setView('auth')}
        />;
    }

    // 認証画面（Supabase設定済み かつ 未ログイン）
    if (view === 'auth' && isSupabaseConfigured && !user) {
        return <AuthPage onSkip={() => setView('app')} />;
    }



    if (view === 'admin') {
        return <AdminDashboard />;
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
