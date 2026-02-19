import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';

interface AuthPageProps {
    onSkip: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onSkip }) => {
    const { signIn, signUp, signInWithGoogle, loading, error, clearError } = useAuthStore();
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signUpSuccess, setSignUpSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        if (mode === 'signin') {
            await signIn(email, password);
        } else {
            const success = await signUp(email, password);
            if (success) {
                setSignUpSuccess(true);
            }
        }
    };

    const switchMode = () => {
        setMode(m => m === 'signin' ? 'signup' : 'signin');
        clearError();
        setSignUpSuccess(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30 flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm relative z-10"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-black text-2xl mx-auto mb-4 shadow-xl shadow-blue-500/20">
                        M
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">MathStudio</h1>
                    <p className="text-sm text-slate-400 mt-1">
                        {mode === 'signin' ? 'おかえりなさい' : 'アカウントを作成'}
                    </p>
                </div>

                {/* Sign Up Success */}
                {signUpSuccess ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center"
                    >
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail size={28} className="text-emerald-500" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800 mb-2">確認メールを送信しました</h2>
                        <p className="text-sm text-slate-500 mb-6">
                            {email} に届いたリンクをクリックして、アカウントを有効にしてください。
                        </p>
                        <button
                            onClick={() => { setMode('signin'); setSignUpSuccess(false); }}
                            className="w-full py-3 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 transition-colors"
                        >
                            ログインに戻る
                        </button>
                    </motion.div>
                ) : (
                    /* Auth Form */
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                        {/* Google Login */}
                        <div className="mb-6">
                            <button
                                onClick={() => signInWithGoogle()}
                                className="w-full py-3 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-[0.98]"
                            >
                                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                                Googleで{mode === 'signin' ? 'ログイン' : '登録'}
                            </button>
                            <div className="relative mt-6">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-300 font-bold tracking-widest">or</span></div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Email</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-100 focus:border-blue-400 outline-none transition-colors text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder={mode === 'signup' ? '6文字以上' : '••••••'}
                                        minLength={6}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-100 focus:border-blue-400 outline-none transition-colors text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Error */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex items-center gap-2 p-3 bg-rose-50 rounded-xl text-rose-600 text-xs font-medium border border-rose-100"
                                    >
                                        <AlertCircle size={14} />
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading || !email || !password}
                                className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : mode === 'signin' ? (
                                    <><LogIn size={18} /> ログイン</>
                                ) : (
                                    <><UserPlus size={18} /> アカウント作成</>
                                )}
                            </button>
                        </form>

                        {/* Toggle mode */}
                        <div className="mt-4 text-center">
                            <button
                                onClick={switchMode}
                                className="text-sm text-slate-400 hover:text-blue-500 transition-colors"
                            >
                                {mode === 'signin'
                                    ? 'アカウントを持っていない → 新規登録'
                                    : 'すでにアカウントがある → ログイン'
                                }
                            </button>
                        </div>
                    </div>
                )}

                {/* Guest & Dev Login */}
                <div className="mt-6 flex flex-col gap-3">
                    <button
                        onClick={async () => {
                            const guestId = Math.random().toString(36).substring(7);
                            const email = `guest_${guestId}@mathbudy.com`;
                            const password = `guest_${guestId}`;
                            await signUp(email, password);
                        }}
                        className="text-sm text-slate-400 hover:text-slate-600 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        <UserPlus size={16} /> ゲストアカウントで始める（メアド不要）
                    </button>

                    {/* DEV ONLY: Quick Login */}
                    {import.meta.env.DEV && (
                        <button
                            onClick={() => signIn('w@gmail.com', 'nana9999')}
                            className="text-xs bg-amber-100 text-amber-700 py-2 rounded-lg font-bold hover:bg-amber-200 transition-colors"
                        >
                            ⚡ 開発用クイックログイン (w@gmail.com)
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
