import React, { useEffect, lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import App from './App.tsx'
import LandingPage from './components/LandingPage.tsx'
import AuthPage from './components/AuthPage.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { useAuthStore } from './stores/useAuthStore.ts'
import { useGameStore } from './stores/useGameStore.ts'
import './index.css'

const AdminDashboard = lazy(() => import('./pages/AdminDashboard.tsx'))
const TokushohoPage = lazy(() => import('./components/TokushohoPage.tsx'))

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,   // 'development' or 'production'
    enabled: import.meta.env.PROD,       // 本番環境のみ送信
    tracesSampleRate: 0.1,               // 10% のトランザクションをトレース
})


// eslint-disable-next-line react-refresh/only-export-components
const Root = () => {
    const { view, setView } = useGameStore();
    const { user, loading, initialize } = useAuthStore();

    // URL Check for Admin and specific pages
    useEffect(() => {
        if (window.location.pathname === '/admin') {
            useGameStore.setState({ view: 'admin' });
        } else if (window.location.pathname === '/legal-notice-x8k9m2p45q') {
            useGameStore.setState({ view: 'tokushoho' as const });
        }
    }, []);

    // Supabase セッション復元
    useEffect(() => {
        initialize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                if (user) {
                    setView('app');
                } else {
                    setView('auth');
                }
            }}
            onLogin={() => setView('auth')}
        />;
    }

    // 認証画面（未ログインの場合は常に表示。Supabase未設定時はスキップ可能）
    if (view === 'auth' && !user) {
        return <AuthPage onSkip={() => setView('app')} />;
    }



    if (view === 'admin') {
        return <Suspense fallback={null}><AdminDashboard /></Suspense>;
    }

    if (view === ('tokushoho' as const)) {
        return <Suspense fallback={null}><TokushohoPage /></Suspense>;
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
