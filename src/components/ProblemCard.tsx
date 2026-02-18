import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Hash } from 'lucide-react';
import { useGameStore } from '../stores/useGameStore';
import { DIFFICULTY_CONFIG } from './LeftSidebar';

const ProblemCard: React.FC = () => {
    const { currentProblem, currentProblemPoints, hintIndex, difficulty, challengeMode, requestHint } = useGameStore();

    if (!currentProblem) return null;

    const currentTheme = challengeMode
        ? DIFFICULTY_CONFIG[currentProblem.meta.difficulty]
        : DIFFICULTY_CONFIG[difficulty];

    return (
        <section className="bg-white p-5 md:p-8 rounded-[24px] md:rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden flex-shrink-0">
            <div className={`absolute top-0 left-0 w-2 h-full bg-${currentTheme.color}-400`} />
            <div className="flex justify-between items-start mb-3 md:mb-4">
                <span className={`text-[10px] font-black text-${currentTheme.color}-500 uppercase tracking-widest bg-${currentTheme.color}-50 px-3 py-1 rounded-lg`}>
                    Mission
                </span>
                <div className={`flex items-center gap-2 font-bold text-sm ${currentProblemPoints < 100 ? 'text-rose-400' : 'text-slate-300'}`}>
                    <Hash size={14} /> {currentProblemPoints} pts
                    {currentProblemPoints < 100 && <span className="text-xs">(-{100 - currentProblemPoints})</span>}
                </div>
            </div>
            <p className="text-base md:text-xl font-bold leading-relaxed text-slate-800 mb-4 md:mb-6">
                {currentProblem.problem.text}
            </p>

            {/* Hints */}
            <div className="space-y-2 md:space-y-3">
                <AnimatePresence>
                    {hintIndex >= 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-3 bg-amber-50 rounded-xl md:rounded-2xl border border-amber-100 text-amber-800 text-sm font-medium flex gap-3 shadow-sm"
                        >
                            <Lightbulb className="shrink-0 text-amber-400" size={18} />
                            <div>{currentProblem.hints[hintIndex]}</div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {hintIndex < currentProblem.hints.length - 1 && (
                    <button
                        onClick={requestHint}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-400 text-xs font-bold hover:bg-amber-50 hover:text-amber-600 transition-all"
                    >
                        <Lightbulb size={14} /> {hintIndex === -1 ? 'ヒント' : '次のヒント'} <span className="text-rose-400">(-15pt)</span>
                    </button>
                )}
            </div>
        </section>
    );
};

export default ProblemCard;
