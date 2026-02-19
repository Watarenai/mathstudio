import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, X, HeartHandshake } from 'lucide-react';

interface RetentionModalProps {
    onClose: () => void;
    onConfirm: () => void;
}

const REASONS = [
    { id: 'expensive', label: '料金が高い' },
    { id: 'not_using', label: 'あまり使っていない' },
    { id: 'features', label: '必要な機能がない' },
    { id: 'bugs', label: '不具合が多い' },
    { id: 'other', label: 'その他' },
];

export const RetentionModal: React.FC<RetentionModalProps> = ({ onClose, onConfirm }) => {
    const [step, setStep] = useState<'reason' | 'confirm'>('reason');
    const [selectedReason, setSelectedReason] = useState<string | null>(null);

    const handleReasonSelect = (reasonId: string) => {
        setSelectedReason(reasonId);
        // ここで将来的に理由をログ送信する処理を入れる
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden p-6 relative"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-500">
                        <HeartHandshake size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        {step === 'reason' ? '解約の理由をお聞かせください' : '本当に解約しますか？'}
                    </h2>
                    <p className="text-slate-500 text-sm mt-2">
                        {step === 'reason'
                            ? 'サービスの改善に役立てるため、ご協力をお願いします。'
                            : '解約すると、Proプランの限定機能（応用問題、広告非表示など）が利用できなくなります。'}
                    </p>
                </div>

                {step === 'reason' ? (
                    <div className="space-y-3">
                        {REASONS.map(reason => (
                            <button
                                key={reason.id}
                                onClick={() => handleReasonSelect(reason.id)}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selectedReason === reason.id
                                        ? 'border-violet-500 bg-violet-50 text-violet-700 font-bold'
                                        : 'border-slate-100 hover:border-slate-200 text-slate-600'
                                    }`}
                            >
                                {reason.label}
                            </button>
                        ))}
                        <div className="pt-4 flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200"
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={() => setStep('confirm')}
                                disabled={!selectedReason}
                                className="flex-1 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 disabled:opacity-50"
                            >
                                次へ
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 flex gap-3 text-rose-700 text-sm text-left">
                            <AlertTriangle className="shrink-0" size={20} />
                            <div>
                                <p className="font-bold mb-1">ご注意ください</p>
                                <p>解約手続きが完了しても、次回の更新日まではPro機能を引き続きご利用いただけます。</p>
                            </div>
                        </div>

                        <div className="pt-2 flex flex-col gap-3">
                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                            >
                                考え直す（Proを継続）
                            </button>
                            <button
                                onClick={onConfirm}
                                className="w-full py-3 text-slate-400 font-medium hover:text-rose-500 transition-colors text-sm"
                            >
                                解約手続きへ進む
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};
