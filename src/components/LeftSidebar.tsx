import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, Shapes, Sprout, Sword, Flame, Crown, RotateCcw, Play, ArrowDownUp, Variable, Circle, X, PlusCircle, Lock, Users, LogOut } from 'lucide-react';
import { useGameStore, Difficulty, Genre } from '../stores/useGameStore';
import { useAuthStore } from '../stores/useAuthStore';

const DIFFICULTY_CONFIG: Record<Difficulty, { color: string; bgColor: string; activeBg: string; textColor: string; icon: any; shadowConfig: string }> = {
    Easy: { color: 'emerald', bgColor: 'bg-emerald-50', activeBg: 'bg-emerald-500', textColor: 'text-emerald-600', icon: Sprout, shadowConfig: 'shadow-emerald-200' },
    Normal: { color: 'sky', bgColor: 'bg-sky-50', activeBg: 'bg-sky-500', textColor: 'text-sky-600', icon: Sword, shadowConfig: 'shadow-sky-200' },
    Hard: { color: 'orange', bgColor: 'bg-orange-50', activeBg: 'bg-orange-500', textColor: 'text-orange-600', icon: Flame, shadowConfig: 'shadow-orange-200' },
    Expert: { color: 'violet', bgColor: 'bg-violet-50', activeBg: 'bg-violet-500', textColor: 'text-violet-600', icon: Crown, shadowConfig: 'shadow-violet-200' },
};

export { DIFFICULTY_CONFIG };

interface GenreConfig {
    key: Genre;
    label: string;
    icon: any;
    activeClass: string;
    isPro?: boolean;
}

const GENRE_TABS: GenreConfig[] = [
    { key: 'proportional', label: '比例', icon: Calculator, activeClass: 'bg-indigo-500 text-white shadow-lg shadow-indigo-200' },
    { key: 'inverse', label: '反比例', icon: ArrowDownUp, activeClass: 'bg-purple-500 text-white shadow-lg shadow-purple-200' },
    { key: 'equation', label: '方程式', icon: Variable, activeClass: 'bg-rose-500 text-white shadow-lg shadow-rose-200' },
    { key: 'linear', label: '一次関数', icon: ArrowDownUp, activeClass: 'bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-200', isPro: true },
    { key: 'geometry', label: '図形', icon: Shapes, activeClass: 'bg-teal-500 text-white shadow-lg shadow-teal-200' },
    { key: 'sector', label: 'おうぎ形', icon: Circle, activeClass: 'bg-cyan-500 text-white shadow-lg shadow-cyan-200' },
];

interface LeftSidebarProps {
    onClose?: () => void;
    onAddProblem?: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ onClose, onAddProblem }) => {
    const {
        difficulty, genre, challengeMode, problemCountInput,
        challengeIndex, challengeProblems,
        setDifficulty, setGenre, generateProblem,
        setProblemCountInput, startChallenge, exitChallenge,
        setPricingModalOpen
    } = useGameStore();

    const { isPro, signOut } = useAuthStore();

    const handleGenreClick = (key: Genre, requiredPro?: boolean) => {
        if (challengeMode) return;
        if (requiredPro && !isPro) {
            setPricingModalOpen(true);
            return;
        }
        setGenre(key);
        generateProblem(difficulty, key);
        onClose?.();
    };

    const handleDifficultyClick = (lvl: Difficulty) => {
        if (challengeMode) return;
        if (lvl === 'Expert' && !isPro) {
            setPricingModalOpen(true);
            return;
        }
        setDifficulty(lvl);
        generateProblem(lvl);
        onClose?.();
    };

    return (
        <aside className="w-72 h-full flex-shrink-0 bg-white border-r border-slate-200 p-6 md:p-8 flex flex-col gap-5 md:gap-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)] overflow-y-auto custom-scrollbar">
            {/* Mobile close button */}
            {onClose && (
                <div className="flex justify-end lg:hidden -mb-2">
                    <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                        <X size={20} />
                    </button>
                </div>
            )}

            {/* Pro/Family Badge or Upgrade Button */}
            {!isPro ? (
                <button
                    onClick={() => setPricingModalOpen(true)}
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-violet-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
                >
                    <Crown size={18} fill="currentColor" className="text-yellow-300" />
                    Proにアップグレード
                </button>
            ) : (
                <button
                    onClick={() => setPricingModalOpen(true)}
                    className={`w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm border-2 transition-all hover:brightness-95 active:scale-[0.98] ${useAuthStore.getState().isFamily ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-violet-50 border-violet-100 text-violet-700'}`}
                >
                    {useAuthStore.getState().isFamily ? (
                        <>
                            <div className="p-1 bg-emerald-100 rounded-full"><Users size={14} /></div>
                            Family Plan
                        </>
                    ) : (
                        <>
                            <Crown size={18} fill="currentColor" className="text-yellow-400" />
                            Pro Member
                        </>
                    )}
                </button>
            )}

            {/* Genre tabs */}
            <div>
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Genre</h2>
                <div className="grid grid-cols-2 gap-2">
                    {GENRE_TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = genre === tab.key;
                        const isLocked = tab.isPro && !isPro;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => handleGenreClick(tab.key, tab.isPro)}
                                disabled={challengeMode}
                                className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${isActive ? tab.activeClass : 'bg-slate-100 text-slate-500 hover:bg-slate-200'} ${challengeMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isLocked ? <Lock size={14} /> : <Icon size={14} />}
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Quest Level */}
            <div>
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 md:mb-6">Quest Level</h2>
                <div className="space-y-2 md:space-y-3">
                    {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((lvl) => {
                        const theme = DIFFICULTY_CONFIG[lvl];
                        const Icon = theme.icon;
                        const isActive = !challengeMode && difficulty === lvl;
                        const isLocked = lvl === 'Expert' && !isPro;

                        return (
                            <button
                                key={lvl}
                                onClick={() => handleDifficultyClick(lvl)}
                                disabled={challengeMode}
                                className={`w-full py-3 md:py-4 px-5 md:px-6 rounded-2xl font-bold text-left transition-all relative overflow-hidden group flex items-center gap-3 ${isActive ? `${theme.activeBg} text-white shadow-lg ${theme.shadowConfig}` : `${theme.bgColor} ${theme.textColor} hover:brightness-95`} ${challengeMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-white/20' : theme.bgColor} ${isLocked ? 'grayscale opacity-70' : ''}`}>
                                    <Icon size={20} className={isActive ? 'text-white' : theme.textColor} />
                                </div>
                                <span className={isLocked ? 'text-slate-400' : ''}>{lvl}</span>
                                {isActive && <motion.div layoutId="active" className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />}
                                {isLocked && !isActive && <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Challenge Mode */}
            <div className="border-t border-slate-100 pt-5 md:pt-6">
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
                        <button onClick={() => { startChallenge(); onClose?.(); }} className="w-full py-3 md:py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-200 hover:shadow-xl active:scale-95 transition-all">
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

            {onAddProblem && (
                <button
                    onClick={() => { onAddProblem(); onClose?.(); }}
                    className="flex items-center justify-center gap-2 py-3 md:py-4 bg-gradient-to-r from-sky-400 to-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-sky-200 hover:shadow-xl active:scale-95 transition-all"
                >
                    <PlusCircle size={18} /> 問題を追加
                </button>
            )}
            <div className="mt-auto flex flex-col gap-3">
                <button
                    onClick={() => { if (!challengeMode) { generateProblem(); onClose?.(); } }}
                    disabled={challengeMode}
                    className="flex items-center justify-center gap-2 py-3 md:py-4 border-2 border-slate-200 rounded-2xl font-bold text-slate-400 hover:border-sky-400 hover:text-sky-400 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <RotateCcw size={18} /> 問題をかえる
                </button>
                <button
                    onClick={() => { signOut(); onClose?.(); }}
                    className="flex items-center justify-center gap-2 py-3 md:py-4 border-2 border-rose-100 bg-rose-50 text-rose-400 rounded-2xl font-bold hover:bg-rose-100 hover:border-rose-200 transition-all active:scale-95"
                >
                    <LogOut size={18} /> ログアウト
                </button>
            </div>
        </aside>
    );
};

export default LeftSidebar;
