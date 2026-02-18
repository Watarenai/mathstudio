import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, Shapes, Sprout, Sword, Flame, Crown, RotateCcw, Play } from 'lucide-react';
import { useGameStore, Difficulty } from '../stores/useGameStore';

const DIFFICULTY_CONFIG: Record<Difficulty, { color: string; bgColor: string; activeBg: string; textColor: string; icon: any; shadowConfig: string }> = {
    Easy: { color: 'emerald', bgColor: 'bg-emerald-50', activeBg: 'bg-emerald-500', textColor: 'text-emerald-600', icon: Sprout, shadowConfig: 'shadow-emerald-200' },
    Normal: { color: 'sky', bgColor: 'bg-sky-50', activeBg: 'bg-sky-500', textColor: 'text-sky-600', icon: Sword, shadowConfig: 'shadow-sky-200' },
    Hard: { color: 'orange', bgColor: 'bg-orange-50', activeBg: 'bg-orange-500', textColor: 'text-orange-600', icon: Flame, shadowConfig: 'shadow-orange-200' },
    Expert: { color: 'violet', bgColor: 'bg-violet-50', activeBg: 'bg-violet-500', textColor: 'text-violet-600', icon: Crown, shadowConfig: 'shadow-violet-200' },
};

export { DIFFICULTY_CONFIG };

const LeftSidebar: React.FC = () => {
    const {
        difficulty, genre, challengeMode, problemCountInput,
        challengeIndex, challengeProblems,
        setDifficulty, setGenre, generateProblem,
        setProblemCountInput, startChallenge, exitChallenge,
    } = useGameStore();

    return (
        <aside className="w-72 flex-shrink-0 bg-white border-r border-slate-200 p-8 flex flex-col gap-6 shadow-[4px_0_24px_rgba(0,0,0,0,0.02)] z-10 overflow-y-auto custom-scrollbar">
            {/* Genre tabs */}
            <div>
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Genre</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => { if (challengeMode) return; setGenre('proportional'); generateProblem(difficulty, 'proportional'); }}
                        disabled={challengeMode}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${genre === 'proportional' ? 'bg-indigo-500 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'} ${challengeMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Calculator size={16} /> 比例
                    </button>
                    <button
                        onClick={() => { if (challengeMode) return; setGenre('geometry'); generateProblem(difficulty, 'geometry'); }}
                        disabled={challengeMode}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${genre === 'geometry' ? 'bg-teal-500 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'} ${challengeMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Shapes size={16} /> 図形
                    </button>
                </div>
            </div>

            {/* Quest Level */}
            <div>
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Quest Level</h2>
                <div className="space-y-3">
                    {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((lvl) => {
                        const theme = DIFFICULTY_CONFIG[lvl];
                        const Icon = theme.icon;
                        const isActive = !challengeMode && difficulty === lvl;
                        return (
                            <button
                                key={lvl}
                                onClick={() => { if (challengeMode) return; setDifficulty(lvl); generateProblem(lvl); }}
                                disabled={challengeMode}
                                className={`w-full py-4 px-6 rounded-2xl font-bold text-left transition-all relative overflow-hidden group flex items-center gap-3 ${isActive ? `${theme.activeBg} text-white shadow-lg ${theme.shadowConfig}` : `${theme.bgColor} ${theme.textColor} hover:brightness-95`} ${challengeMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <Icon size={20} className={isActive ? 'text-white' : theme.textColor} />
                                <span>{lvl}</span>
                                {isActive && <motion.div layoutId="active" className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Challenge Mode */}
            <div className="border-t border-slate-100 pt-6">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Challenge Mode</h2>
                {!challengeMode ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <input
                                type="number" min={1} max={50}
                                value={problemCountInput}
                                onChange={(e) => setProblemCountInput(parseInt(e.target.value) || 1)}
                                className="w-20 px-3 py-2 text-center font-bold text-lg rounded-xl border-2 border-slate-200 focus:border-sky-400 outline-none transition-colors"
                            />
                            <span className="text-sm text-slate-400 font-medium">問</span>
                        </div>
                        <p className="text-[10px] text-slate-300">Easy 50% / Normal 30% / Hard 20%</p>
                        <button onClick={startChallenge} className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-200 hover:shadow-xl active:scale-95 transition-all">
                            <Play size={18} /> チャレンジ開始
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                            <p className="text-xs font-bold text-amber-600 mb-1">進捗</p>
                            <p className="text-2xl font-black text-amber-700">{challengeIndex + 1} / {challengeProblems.length}</p>
                            <div className="mt-2 h-2 bg-amber-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500" style={{ width: `${((challengeIndex + 1) / challengeProblems.length) * 100}%` }} />
                            </div>
                        </div>
                        <button onClick={exitChallenge} className="w-full py-3 border-2 border-slate-200 text-slate-400 rounded-2xl font-bold hover:border-rose-300 hover:text-rose-400 transition-all">
                            チャレンジ終了
                        </button>
                    </div>
                )}
            </div>

            <button
                onClick={() => !challengeMode && generateProblem()}
                disabled={challengeMode}
                className="mt-auto flex items-center justify-center gap-2 py-4 border-2 border-slate-200 rounded-2xl font-bold text-slate-400 hover:border-sky-400 hover:text-sky-400 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <RotateCcw size={18} /> 問題をかえる
            </button>
        </aside>
    );
};

export default LeftSidebar;
