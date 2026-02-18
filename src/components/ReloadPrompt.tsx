import React from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, X } from 'lucide-react'

const ReloadPrompt: React.FC = () => {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered: ' + r)
        },
        onRegisterError(error) {
            console.log('SW registration error', error)
        },
    })

    const close = () => {
        setOfflineReady(false)
        setNeedRefresh(false)
    }

    return (
        <AnimatePresence>
            {(offlineReady || needRefresh) && (
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className="fixed bottom-4 right-4 z-50 p-4 bg-slate-800 text-white rounded-2xl shadow-2xl max-w-sm border border-slate-700"
                >
                    <div className="flex items-start gap-3">
                        <div className="flex-1">
                            <h3 className="font-bold text-sm mb-1">
                                {offlineReady ? '準備完了' : 'アップデート利用可能'}
                            </h3>
                            <p className="text-xs text-slate-300 mb-3">
                                {offlineReady
                                    ? 'アプリはオフラインで利用可能です。'
                                    : '新しいコンテンツが利用可能です。更新して最新版をご利用ください。'}
                            </p>
                            <div className="flex gap-2">
                                {needRefresh && (
                                    <button
                                        onClick={() => updateServiceWorker(true)}
                                        className="px-3 py-1.5 bg-sky-500 text-white text-xs font-bold rounded-lg hover:bg-sky-400 transition-colors flex items-center gap-1.5"
                                    >
                                        <RefreshCw size={12} /> 更新する
                                    </button>
                                )}
                                <button
                                    onClick={close}
                                    className="px-3 py-1.5 bg-slate-700 text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-600 transition-colors"
                                >
                                    閉じる
                                </button>
                            </div>
                        </div>
                        <button onClick={close} className="text-slate-400 hover:text-white">
                            <X size={16} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default ReloadPrompt
