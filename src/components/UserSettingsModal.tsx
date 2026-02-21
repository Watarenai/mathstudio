import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogOut, ExternalLink, Settings, Sparkles, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { useGameStore } from '../stores/useGameStore';
import { supabase } from '../lib/supabase';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserSettingsModal: React.FC<UserSettingsModalProps> = ({ isOpen, onClose }) => {
  const { user, signOut, isPro, isFamily } = useAuthStore();
  const { setView } = useGameStore();
  const [loadingPortal, setLoadingPortal] = useState(false);

  if (!isOpen) return null;

  const handleSignOut = async () => {
    const confirmSignOut = window.confirm('ログアウトしますか？\n（未保存のゲストデータがある場合、アカウントを作成していないと消去される可能性があります）');
    if (!confirmSignOut) return;

    await signOut();
    onClose();
    setView('landing');
  };

  const handleOpenPortal = async () => {
    if (!user || !supabase) return;
    setLoadingPortal(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: { returnUrl: window.location.href },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      const e = err as Error;
      console.error('Portal Error:', e);
      alert(`Stripe画面の読み込みに失敗しました: ${e.message}`);
    } finally {
      setLoadingPortal(false);
    }
  };

  const getPlanBadge = () => {
    if (isFamily) {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-xs font-bold shadow-sm">
          <Sparkles size={12} />
          ファミリープラン
        </div>
      );
    }
    if (isPro) {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-full text-xs font-bold shadow-sm">
          <Sparkles size={12} />
          Pro プラン
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
        フリープラン
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%", opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: "100%", opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-5 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Settings size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">アカウント設定</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 hover:text-slate-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {user ? (
              <>
                {/* Profile Info */}
                <div className="space-y-4">
                  <div className="flex flex-col items-center p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                    <div className="w-16 h-16 rounded-full bg-slate-200 border-4 border-white shadow-sm flex items-center justify-center overflow-hidden mb-3 text-slate-400">
                      {user.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon size={32} />
                      )}
                    </div>
                    <div className="text-slate-900 font-bold max-w-full truncate px-2">
                      {user.user_metadata?.full_name || 'ユーザー'}
                    </div>
                    <div className="text-sm text-slate-500 mb-3 max-w-full truncate px-2">
                      {user.email}
                    </div>
                    {getPlanBadge()}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  {(isPro || isFamily) && (
                    <div className="space-y-2">
                      <button
                        onClick={handleOpenPortal}
                        disabled={loadingPortal}
                        className="w-full flex items-center justify-between p-4 bg-white border-2 border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 transition-all font-bold text-slate-700 group disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center gap-3">
                          <ExternalLink size={18} className="text-slate-400 group-hover:text-blue-500" />
                          <span>契約情報の確認・キャンセル</span>
                        </div>
                        {loadingPortal && (
                          <span className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                        )}
                      </button>
                      <p className="text-xs text-slate-400 font-medium px-2 text-center">
                        Stripeの管理画面へ移動して設定を変更します
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 p-4 mt-4 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>ログアウト</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-slate-500 font-medium">
                ログインしていません。
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
