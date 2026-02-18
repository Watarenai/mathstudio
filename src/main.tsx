import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import LandingPage from './components/LandingPage.tsx'
import AuthPage from './components/AuthPage.tsx'
import { useAuthStore } from './stores/useAuthStore.ts'
import './index.css'

type Screen = 'landing' | 'auth' | 'app';

const Root = () => {
    const [screen, setScreen] = useState<Screen>('landing');
    const { user, loading, isConfigured, initialize } = useAuthStore();

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
            if (isConfigured) {
                // Supabase設定済み → 認証画面
                if (user) {
                    setScreen('app');
                } else {
                    setScreen('auth');
                }
            } else {
                // 未設定 → ゲストモードで直接アプリへ
                setScreen('app');
            }
        }} />;
    }

    // 認証画面
    if (screen === 'auth' && !user) {
        return <AuthPage onSkip={() => setScreen('app')} />;
    }

    // メインアプリ
    return <App />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>,
)
