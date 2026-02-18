import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useGameStore } from '../stores/useGameStore';

const ChallengeOverlay: React.FC = () => {
    const { challengeComplete, challengeProblems, exitChallenge } = useGameStore();

    return (
        <AnimatePresence>
            {challengeComplete && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-8"
                >
                    <motion.div
                        initial={{ scale: 0.5, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl shadow-orange-200 mb-8"
                    >
                        <Trophy size={64} className="text-white" />
                    </motion.div>
                    <h2 className="text-4xl font-black text-slate-800 mb-2">Challenge Complete!</h2>
                    <p className="text-xl text-slate-500 mb-8">{challengeProblems.length}問クリア</p>
                    <button
                        onClick={exitChallenge}
                        className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 active:scale-95 transition-all shadow-lg"
                    >
                        終了する
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ChallengeOverlay;
