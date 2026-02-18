import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, AlertCircle, RefreshCw } from 'lucide-react';
import { useGameStore } from '../stores/useGameStore';

const RightSidebar: React.FC = () => {
    const { score, history, wrongAnswers, challengeMode, retryProblem } = useGameStore();

    return (
        <aside className="w-80 flex-shrink-0 bg-white border-l border-slate-200 p-8 flex flex-col gap-10">
            {/* Score Card */}
            <div className="p-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-[32px] text-white shadow-xl shadow-sky-200/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                <Award className="mb-4 text-white/80" size={32} />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-white/60">Current Score</p>
                <p className="text-5xl font-black">{score.toLocaleString()}</p>
            </div>

            {/* Mastery History */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6">Mastery History</h3>
                <div className="space-y-3 overflow-y-auto flex-1 custom-scrollbar pr-2 max-h-40">
                    <AnimatePresence>
                        {history.slice(0, 5).map((h) => (
                            <motion.div
                                key={h.id}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-700 text-xs font-bold flex justify-between items-center"
                            >
                                <span>{h.label}</span>
                                <span>+{h.points}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {history.length === 0 && (
                        <p className="text-center text-[10px] text-slate-300 font-bold uppercase py-10">Ready for next mission</p>
                    )}
                </div>
            </div>

            {/* Review Queue */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <AlertCircle size={12} className="text-rose-400" />
                    Review Queue ({wrongAnswers.length})
                </h3>
                <div className="space-y-2 overflow-y-auto flex-1 custom-scrollbar pr-2">
                    <AnimatePresence>
                        {wrongAnswers.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                                className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-rose-700"
                            >
                                <p className="text-xs font-medium line-clamp-2 mb-2">{item.problem.problem.text}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-rose-400">あなたの解答: {item.userAnswer || '(空欄)'}</span>
                                    <button
                                        onClick={() => retryProblem(item)}
                                        disabled={challengeMode}
                                        className="flex items-center gap-1 px-2 py-1 bg-rose-500 text-white rounded-lg text-[10px] font-bold hover:bg-rose-600 transition-all disabled:opacity-50"
                                    >
                                        <RefreshCw size={10} /> 再挑戦
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {wrongAnswers.length === 0 && (
                        <p className="text-center text-[10px] text-slate-300 font-bold uppercase py-6">All clear! 🎉</p>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default RightSidebar;
