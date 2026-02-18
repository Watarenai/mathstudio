import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, PenTool, Delete, Flame, Type } from 'lucide-react';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import { useGameStore } from '../stores/useGameStore';

const AnswerInput: React.FC = () => {
    const {
        userAnswer, status, workspaceMode, streak, encouragement, fontSize,
        setUserAnswer, setWorkspaceMode, setFontSize, handleCheck, insertChar, backspace,
    } = useGameStore();

    const inputTextSize = fontSize === 1 ? 'text-lg md:text-xl' : fontSize === 3 ? 'text-3xl md:text-4xl' : 'text-xl md:text-3xl';

    return (
        <>
            {/* Top Bar: Mode Toggle + Streak + Font Size */}
            <div className="flex items-center gap-2 flex-wrap">
                {/* Mode Toggle */}
                <div className="flex items-center p-1 bg-slate-200/50 rounded-xl shadow-inner">
                    <button
                        onClick={() => setWorkspaceMode('input')}
                        className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-lg text-sm font-bold transition-all ${workspaceMode === 'input' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Keyboard size={16} /> 入力
                    </button>
                    <button
                        onClick={() => setWorkspaceMode('drawing')}
                        className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-lg text-sm font-bold transition-all ${workspaceMode === 'drawing' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <PenTool size={16} /> 考える
                    </button>
                </div>

                {/* Streak */}
                <AnimatePresence>
                    {streak >= 2 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-xl text-orange-500 font-bold text-sm border border-orange-100"
                        >
                            <Flame size={16} /> {streak} 連続正解！
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Font Size */}
                <div className="flex items-center gap-1 ml-auto">
                    <Type size={14} className="text-slate-300" />
                    {[1, 2, 3].map(s => (
                        <button
                            key={s}
                            onClick={() => setFontSize(s)}
                            className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${fontSize === s ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                        >
                            {s === 1 ? '小' : s === 2 ? '中' : '大'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Workspace */}
            <div className="flex-1 relative min-h-0 bg-white rounded-[24px] md:rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                {workspaceMode === 'input' ? (
                    <div className="h-full flex flex-col p-4 md:p-6 overflow-y-auto">
                        {/* Input field */}
                        <div className="mb-3 md:mb-4 relative group shrink-0">
                            <input
                                type="text"
                                value={userAnswer}
                                onChange={(e) => { if (status === 'correct') return; setUserAnswer(e.target.value); }}
                                onKeyDown={(e) => { if (e.key === 'Enter' && userAnswer && status !== 'correct') handleCheck(); }}
                                placeholder="y = "
                                className={`w-full p-4 md:p-6 ${inputTextSize} font-mono rounded-[16px] md:rounded-[24px] border-4 outline-none transition-all shadow-sm pr-20 md:pr-24 ${status === 'correct' ? 'border-emerald-400 bg-emerald-50 text-emerald-700' :
                                    status === 'incorrect' ? 'border-amber-300 bg-amber-50 text-amber-700' : 'border-slate-100 bg-white focus:border-sky-400'}`}
                            />
                            {status === 'correct' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                    className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-[16px] md:rounded-[24px] z-10"
                                >
                                    <div className="text-center">
                                        <span className="text-xl md:text-2xl font-black text-emerald-500 block mb-1">
                                            {streak >= 3 ? '🔥 すごい！' : streak >= 2 ? '✨ いいね！' : '⭐ 正解！'}
                                        </span>
                                        <span className="text-xs md:text-sm text-emerald-400 font-bold">次の問題にいくよ...</span>
                                    </div>
                                </motion.div>
                            )}
                            <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2">
                                <button
                                    onClick={handleCheck}
                                    disabled={status === 'correct' || !userAnswer}
                                    className="px-4 md:px-6 py-2.5 md:py-3 bg-slate-800 text-white rounded-xl font-bold text-sm md:text-base hover:bg-slate-700 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    OK
                                </button>
                            </div>
                        </div>

                        {/* Encouragement on incorrect */}
                        <AnimatePresence>
                            {status === 'incorrect' && encouragement && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="mb-3 p-3 bg-amber-50 rounded-2xl border border-amber-100 text-amber-700 text-sm font-bold text-center"
                                >
                                    💪 {encouragement}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Virtual Keyboard */}
                        <div className="bg-slate-50 p-2 md:p-3 rounded-[16px] md:rounded-[24px] grid grid-cols-7 gap-1.5 md:gap-2 shadow-inner select-none flex-1 content-start">
                            {['y', '=', 'x', '1', '2', '3', '+'].map(k => (
                                <button key={k} onClick={() => insertChar(k)} className="h-10 md:h-12 bg-white rounded-lg md:rounded-xl font-bold text-base md:text-lg text-slate-600 shadow-sm hover:translate-y-[-2px] active:translate-y-0 transition-all hover:shadow-md hover:text-sky-600">{k}</button>
                            ))}
                            {['/', '(', ')', '4', '5', '6', '−'].map(k => (
                                <button key={k} onClick={() => insertChar(k)} className="h-10 md:h-12 bg-white rounded-lg md:rounded-xl font-bold text-base md:text-lg text-slate-600 shadow-sm hover:translate-y-[-2px] active:translate-y-0 transition-all hover:shadow-md hover:text-sky-600">{k}</button>
                            ))}
                            {['a', '≦', '≧', '7', '8', '9', '0'].map(k => (
                                <button key={k} onClick={() => insertChar(k)} className="h-10 md:h-12 bg-white rounded-lg md:rounded-xl font-bold text-base md:text-lg text-slate-600 shadow-sm hover:translate-y-[-2px] active:translate-y-0 transition-all hover:shadow-md hover:text-sky-600">{k}</button>
                            ))}
                            <div className="col-span-3 md:col-span-5 hidden sm:block" />
                            <button onClick={() => setUserAnswer('')} className="col-span-2 sm:col-span-1 h-10 md:h-12 bg-rose-50 text-rose-400 rounded-lg md:rounded-xl font-bold shadow-sm flex items-center justify-center italic text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-colors">Clear</button>
                            <button onClick={backspace} className="col-span-2 sm:col-span-1 h-10 md:h-12 bg-white text-slate-400 rounded-lg md:rounded-xl font-bold shadow-sm flex items-center justify-center hover:text-slate-600 transition-colors"><Delete size={18} /></button>
                        </div>
                    </div>
                ) : (
                    <div className="h-full w-full relative bg-white">
                        <Tldraw persistenceKey="mathbudy-scratchpad" hideUi={false} />
                    </div>
                )}
            </div>
        </>
    );
};

export default AnswerInput;
