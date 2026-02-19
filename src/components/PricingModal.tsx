import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Crown, Sparkles, Users } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { useGameStore } from '../stores/useGameStore';
import { supabase } from '../lib/supabase';
import { RetentionModal } from './RetentionModal';

interface PricingModalProps {
    onClose: () => void;
}

const PLANS = [
    {
        id: 'pro' as const,
        label: 'Pro プラン',
        price: '¥980',
        priceId: 'price_1T2D2pHsEQGHlcT0Vtk4yfEI',
        badge: 'おすすめ',
        badgeColor: 'from-amber-400 to-orange-500',
        color: 'from-violet-600 to-indigo-600',
        borderColor: 'border-violet-100',
        features: [
            '基本問題（比例・反比例・方程式・図形）',
            '広告なし',
            'Expert難易度（応用問題）',
            '連立方程式・一次関数',
            '学習履歴・分析レポート',
            '優先サポート',
        ],
    },
    {
        id: 'family' as const,
        label: 'ファミリープラン',
        price: '¥1,480',
        priceId: 'price_1T2QDlHsEQGHlcT0YLzNMkSh',
        badge: '保護者向け',
        badgeColor: 'from-emerald-400 to-teal-500',
        color: 'from-emerald-500 to-teal-600',
        borderColor: 'border-emerald-100',
        features: [
            'Pro プランの全機能',
            '保護者ダッシュボード',
            '子の学習進捗・グラフ確認',
            'ジャンル別正答率レポート',
            '苦手問題リスト',
            '複数アカウント管理',
        ],
    },
];

const PricingModal: React.FC<PricingModalProps> = ({ onClose }) => {
    const { user } = useAuthStore();
    const { setView } = useGameStore();
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [showRetentionModal, setShowRetentionModal] = useState(false);

    const handleUpgrade = async (plan: typeof PLANS[number]) => {
        if (!user) {
            if (confirm('アップグレードするにはログインが必要です。ログイン画面に移動しますか？')) {
                onClose();
                setView('auth');
            }
            return;
        }
        if (!supabase) {
            alert('Supabaseが設定されていません。');
            return;
        }
        setLoadingPlan(plan.id);
        try {
            const { data, error } = await supabase.functions.invoke('create-checkout-session', {
                body: {
                    priceId: plan.priceId,
                    planType: plan.id,
                    cancelUrl: window.location.href,
                    successUrl: `${window.location.origin}?success=true`,
                },
            });

            if (error) {
                // Edge Function の詳細エラーを取得
                let detail = error.message;
                try {
                    const body = await (error as any).context?.json?.();
                    if (body?.error) detail = body.error;
                } catch { /* ignore */ }
                throw new Error(detail);
            }
            if (data?.url) {
                window.location.href = data.url;
            } else {
                throw new Error('決済URLの取得に失敗しました');
            }
        } catch (e: any) {
            console.error(e);
            alert(`エラーが発生しました: ${e.message}`);
        } finally {
            setLoadingPlan(null);
        }
    };

    const handlePortal = async () => {
        if (!user || !supabase) return;
        setLoadingPlan('portal');
        try {
            const { data, error } = await supabase.functions.invoke('create-portal-session', {
                body: { returnUrl: window.location.href },
            });
            if (error) throw error;
            if (data?.url) {
                window.location.href = data.url;
            }
        } catch (e: any) {
            console.error(e);
            alert(`エラーが発生しました: ${e.message}`);
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <>
            {showRetentionModal && (
                <RetentionModal
                    onClose={() => setShowRetentionModal(false)}
                    onConfirm={() => {
                        setShowRetentionModal(false);
                        handlePortal();
                    }}
                />
            )}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden max-h-[90vh] overflow-y-auto"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="relative">
                        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-violet-600 to-indigo-600" />

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <div className="relative z-10 pt-10 px-8 pb-6 text-center text-white">
                            <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl text-violet-600">
                                <Crown size={32} fill="currentColor" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tight mb-2">プランを選択</h2>
                            <p className="text-violet-100 font-medium">数学の力を、最大限に引き出そう。</p>
                        </div>

                        <div className="px-6 pb-8 md:px-10">
                            {/* Manage Subscription Button for existing subscribers */}
                            {(user && (useAuthStore.getState().isPro || useAuthStore.getState().isFamily)) && (
                                <div className="mb-8">
                                    <button
                                        onClick={() => setShowRetentionModal(true)}
                                        disabled={loadingPlan !== null}
                                        className="w-full py-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {loadingPlan === 'portal' ? (
                                            <span className="w-5 h-5 border-2 border-slate-400 border-t-slate-700 rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Sparkles size={18} className="text-slate-500" />
                                                サブスクリプションを管理（プラン変更・確認）
                                            </>
                                        )}
                                    </button>
                                    <p className="text-center text-xs text-slate-400 mt-2">
                                        ※ プランの変更やキャンセルは、Stripeの管理画面から行えます。
                                    </p>
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-6">

                                {PLANS.map(plan => (
                                    <div key={plan.id} className={`bg-white rounded-2xl border-2 ${plan.borderColor} shadow-xl overflow-hidden relative`}>
                                        <div className={`absolute top-0 right-0 bg-gradient-to-l ${plan.badgeColor} text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl`}>
                                            {plan.badge}
                                        </div>
                                        <div className={`p-6 text-center border-b bg-gradient-to-br ${plan.id === 'pro' ? 'from-violet-50/50 to-indigo-50/30 border-violet-50' : 'from-emerald-50/50 to-teal-50/30 border-emerald-50'}`}>
                                            <div className="flex items-center justify-center gap-2 mb-1">
                                                {plan.id === 'family' && <Users size={16} className="text-emerald-600" />}
                                                <h3 className={`font-bold ${plan.id === 'pro' ? 'text-violet-900' : 'text-emerald-900'}`}>{plan.label}</h3>
                                            </div>
                                            <div className="text-4xl font-black text-slate-800 mb-1">
                                                {plan.price}<span className="text-sm font-medium text-slate-400">/月</span>
                                            </div>
                                            <p className="text-xs text-slate-500">いつでもキャンセル可能</p>
                                        </div>
                                        <div className="p-6">
                                            <ul className="space-y-3 mb-6">
                                                {plan.features.map((f, i) => (
                                                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.id === 'pro' ? 'bg-emerald-100 text-emerald-600' : 'bg-teal-100 text-teal-600'}`}>
                                                            <Check size={12} strokeWidth={3} />
                                                        </div>
                                                        {f}
                                                    </li>
                                                ))}
                                            </ul>
                                            <button
                                                onClick={() => {
                                                    if (useAuthStore.getState().isPro || useAuthStore.getState().isFamily) {
                                                        setShowRetentionModal(true);
                                                    } else {
                                                        handleUpgrade(plan);
                                                    }
                                                }}
                                                disabled={loadingPlan !== null}
                                                className={`w-full py-4 bg-gradient-to-r ${plan.color} text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed`}
                                            >
                                                {loadingPlan === plan.id ? (
                                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : useAuthStore.getState().planType === plan.id ? (
                                                    <>
                                                        <Check size={18} />
                                                        現在のプラン（管理）
                                                    </>
                                                ) : (useAuthStore.getState().isPro || useAuthStore.getState().isFamily) ? (
                                                    <>
                                                        <Sparkles size={18} />
                                                        プランを変更
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles size={18} />
                                                        {plan.id === 'pro' ? 'Proにアップグレード' : 'ファミリーにアップグレード'}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {!user && (
                                <div className="mt-6 p-4 bg-blue-50 rounded-xl text-blue-700 text-xs font-bold text-center">
                                    ※ アカウントを作成すると学習履歴を保存できます
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
};

export default PricingModal;
