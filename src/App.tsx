import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, RotateCcw, Award, Hash, Delete, Sprout, Sword, Flame, PenTool, Keyboard, Play, Trophy } from 'lucide-react';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import { GeneratedProblem, getRandomProblemByDifficulty, checkAnswer } from './data/mockProblems';

// 履歴データの型
interface HistoryItem {
  id: string;
  points: number;
  label: string;
}

// 難易度テーマ設定
const DIFFICULTY_CONFIG = {
  Easy: {
    color: 'emerald',
    bgColor: 'bg-emerald-50',
    activeBg: 'bg-emerald-500',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-600',
    icon: Sprout,
    shadowConfig: 'shadow-emerald-200'
  },
  Normal: {
    color: 'sky',
    bgColor: 'bg-sky-50',
    activeBg: 'bg-sky-500',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-600',
    icon: Sword,
    shadowConfig: 'shadow-sky-200'
  },
  Hard: {
    color: 'rose',
    bgColor: 'bg-rose-50',
    activeBg: 'bg-rose-500',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-600',
    icon: Flame,
    shadowConfig: 'shadow-rose-200'
  }
};

// チャレンジ用問題リスト生成 (50% Easy, 30% Normal, 20% Hard)
// グラデーション: Easy → Normal → Hard の順で出題
const generateChallengeProblems = (count: number): GeneratedProblem[] => {
  const easyCount = Math.round(count * 0.5);
  const normalCount = Math.round(count * 0.3);
  const hardCount = count - easyCount - normalCount;

  const problems: GeneratedProblem[] = [];
  for (let i = 0; i < easyCount; i++) problems.push(getRandomProblemByDifficulty('Easy'));
  for (let i = 0; i < normalCount; i++) problems.push(getRandomProblemByDifficulty('Normal'));
  for (let i = 0; i < hardCount; i++) problems.push(getRandomProblemByDifficulty('Hard'));

  // シャッフルなし: Easy → Normal → Hard のグラデーション順
  return problems;
};

const MathStudioV2 = () => {
  const [difficulty, setDifficulty] = useState<'Easy' | 'Normal' | 'Hard'>('Easy');
  const [currentProblem, setCurrentProblem] = useState<GeneratedProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [hintIndex, setHintIndex] = useState(-1);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // モード (入力 vs 手書き)
  const [workspaceMode, setWorkspaceMode] = useState<'input' | 'drawing'>('input');

  // チャレンジモード
  const [challengeMode, setChallengeMode] = useState(false);
  const [problemCountInput, setProblemCountInput] = useState(10);
  const [challengeProblems, setChallengeProblems] = useState<GeneratedProblem[]>([]);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [challengeComplete, setChallengeComplete] = useState(false);

  // 初回ロード
  useEffect(() => { generateProblem(); }, []);

  // 自動進行ロジック
  useEffect(() => {
    if (status === 'correct') {
      const timer = window.setTimeout(() => {
        if (challengeMode) {
          // チャレンジモード: 次の問題へ
          if (challengeIndex < challengeProblems.length - 1) {
            setChallengeIndex(prev => prev + 1);
            setCurrentProblem(challengeProblems[challengeIndex + 1]);
            setUserAnswer('');
            setHintIndex(-1);
            setStatus('idle');
            setWorkspaceMode('input');
          } else {
            // チャレンジ完了
            setChallengeComplete(true);
          }
        } else {
          generateProblem();
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, challengeMode, challengeIndex, challengeProblems]);

  const generateProblem = (level: 'Easy' | 'Normal' | 'Hard' = difficulty) => {
    const randomProblem = getRandomProblemByDifficulty(level);
    setCurrentProblem(randomProblem);
    setUserAnswer('');
    setHintIndex(-1);
    setStatus('idle');
    setWorkspaceMode('input');
  };

  const startChallenge = () => {
    const problems = generateChallengeProblems(problemCountInput);
    setChallengeProblems(problems);
    setChallengeIndex(0);
    setCurrentProblem(problems[0]);
    setChallengeMode(true);
    setChallengeComplete(false);
    setUserAnswer('');
    setHintIndex(-1);
    setStatus('idle');
    setWorkspaceMode('input');
  };

  const exitChallenge = () => {
    setChallengeMode(false);
    setChallengeComplete(false);
    setChallengeProblems([]);
    setChallengeIndex(0);
    // スコアと履歴をリセット
    setScore(0);
    setHistory([]);
    generateProblem();
  };

  const insertChar = (char: string) => {
    if (status === 'correct') return;
    setUserAnswer(prev => prev + char);
    setStatus('idle');
  };

  const backspace = () => {
    if (status === 'correct') return;
    setUserAnswer(prev => prev.slice(0, -1));
    setStatus('idle');
  };

  const handleCheck = () => {
    if (!currentProblem) return;

    const isCorrect = checkAnswer(currentProblem, userAnswer);
    if (isCorrect) {
      setStatus('correct');
      const deduction = hintIndex === -1 ? 0 : Math.min(hintIndex + 1, 2) * 50;
      const finalPoints = Math.max(currentProblem.meta.points - deduction, currentProblem.meta.points / 2);

      setScore(prev => prev + finalPoints);
      setHistory(prev => [{ id: Date.now().toString(), points: finalPoints, label: challengeMode ? `${challengeIndex + 1}/${challengeProblems.length}` : 'QUEST COMPLETE!' }, ...prev]);
    } else {
      setStatus('incorrect');
    }
  };

  if (!currentProblem) return null;

  const currentTheme = challengeMode
    ? DIFFICULTY_CONFIG[currentProblem.meta.difficulty]
    : DIFFICULTY_CONFIG[difficulty];

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] text-slate-700 overflow-hidden font-sans">

      {/* 左：クエスト選択 */}
      <aside className="w-72 flex-shrink-0 bg-white border-r border-slate-200 p-8 flex flex-col gap-6 shadow-[4px_0_24px_rgba(0,0,0,0,0.02)] z-10 overflow-y-auto custom-scrollbar">
        <div>
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Quest Level</h2>
          <div className="space-y-3">
            {(Object.keys(DIFFICULTY_CONFIG) as Array<'Easy' | 'Normal' | 'Hard'>).map((lvl) => {
              const theme = DIFFICULTY_CONFIG[lvl];
              const Icon = theme.icon;
              const isActive = !challengeMode && difficulty === lvl;

              return (
                <button
                  key={lvl}
                  onClick={() => {
                    if (challengeMode) return; // チャレンジ中は変更不可
                    setDifficulty(lvl);
                    generateProblem(lvl);
                  }}
                  disabled={challengeMode}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-left transition-all relative overflow-hidden group flex items-center gap-3 ${isActive
                    ? `${theme.activeBg} text-white shadow-lg ${theme.shadowConfig}`
                    : `${theme.bgColor} ${theme.textColor} hover:brightness-95`
                    } ${challengeMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Icon size={20} className={isActive ? 'text-white' : theme.textColor} />
                  <span>{lvl}</span>
                  {isActive && <motion.div layoutId="active" className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* チャレンジモード */}
        <div className="border-t border-slate-100 pt-6">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Challenge Mode</h2>

          {!challengeMode ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={problemCountInput}
                  onChange={(e) => setProblemCountInput(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                  className="w-20 px-3 py-2 text-center font-bold text-lg rounded-xl border-2 border-slate-200 focus:border-sky-400 outline-none transition-colors"
                />
                <span className="text-sm text-slate-400 font-medium">問</span>
              </div>
              <p className="text-[10px] text-slate-300">Easy 50% / Normal 30% / Hard 20%</p>
              <button
                onClick={startChallenge}
                className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-200 hover:shadow-xl active:scale-95 transition-all"
              >
                <Play size={18} /> チャレンジ開始
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                <p className="text-xs font-bold text-amber-600 mb-1">進捗</p>
                <p className="text-2xl font-black text-amber-700">
                  {challengeIndex + 1} / {challengeProblems.length}
                </p>
                <div className="mt-2 h-2 bg-amber-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                    style={{ width: `${((challengeIndex + 1) / challengeProblems.length) * 100}%` }}
                  />
                </div>
              </div>
              <button
                onClick={exitChallenge}
                className="w-full py-3 border-2 border-slate-200 text-slate-400 rounded-2xl font-bold hover:border-rose-300 hover:text-rose-400 transition-all"
              >
                チャレンジ終了
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => challengeMode ? null : generateProblem()}
          disabled={challengeMode}
          className="mt-auto flex items-center justify-center gap-2 py-4 border-2 border-slate-200 rounded-2xl font-bold text-slate-400 hover:border-sky-400 hover:text-sky-400 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw size={18} /> 問題をかえる
        </button>
      </aside>

      {/* 中央：メインワークスペース */}
      <main className="flex-1 relative flex flex-col items-center p-8 overflow-hidden">
        {/* ドット背景 */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        {/* チャレンジ完了オーバーレイ */}
        <AnimatePresence>
          {challengeComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-8"
            >
              <motion.div
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
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

        <div className="w-full max-w-2xl z-10 space-y-6 flex flex-col h-full">
          {/* 問題カード */}
          <section className="bg-white p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden flex-shrink-0">
            <div className={`absolute top-0 left-0 w-2 h-full bg-${currentTheme.color}-400`} />
            <div className="flex justify-between items-start mb-4">
              <span className={`text-xs font-black text-${currentTheme.color}-500 uppercase tracking-widest bg-${currentTheme.color}-50 px-3 py-1 rounded-lg`}>
                Mission
              </span>
              <div className="flex items-center gap-2 text-slate-300 font-bold">
                <Hash size={14} /> {currentProblem.meta.points} pts
              </div>
            </div>
            <p className="text-xl font-bold leading-relaxed text-slate-800 mb-6">
              {currentProblem.problem.text}
            </p>

            {/* ヒントボタンと表示 */}
            <div className="space-y-3">
              <AnimatePresence>
                {hintIndex >= 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 text-sm font-medium flex gap-3 shadow-sm"
                  >
                    <Lightbulb className="shrink-0 text-amber-400" size={18} />
                    <div>{currentProblem.hints[hintIndex]}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              {hintIndex < currentProblem.hints.length - 1 && (
                <button
                  onClick={() => setHintIndex(prev => Math.min(prev + 1, currentProblem.hints.length - 1))}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-400 text-xs font-bold hover:bg-amber-50 hover:text-amber-600 transition-all"
                >
                  <Lightbulb size={14} /> {hintIndex === -1 ? 'ヒント' : '次のヒント'}
                </button>
              )}
            </div>
          </section>

          {/* モード切替タブ */}
          <div className="flex items-center justify-center p-1 bg-slate-200/50 rounded-xl self-center shadow-inner">
            <button
              onClick={() => setWorkspaceMode('input')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${workspaceMode === 'input' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              <Keyboard size={16} /> 入力
            </button>
            <button
              onClick={() => setWorkspaceMode('drawing')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${workspaceMode === 'drawing' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              <PenTool size={16} /> 考える
            </button>
          </div>

          {/* ワークエリア (入力 or 手書き) */}
          <div className="flex-1 relative min-h-0 bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
            {workspaceMode === 'input' ? (
              <div className="h-full flex flex-col p-6 overflow-y-auto">
                {/* 仮想キーボードエリア */}
                <div className="mb-4 relative group shrink-0">
                  <input
                    type="text"
                    readOnly
                    value={userAnswer}
                    placeholder="y = "
                    className={`w-full p-6 text-3xl font-mono rounded-[24px] border-4 outline-none transition-all shadow-sm ${status === 'correct' ? 'border-emerald-400 bg-emerald-50 text-emerald-700' :
                      status === 'incorrect' ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-slate-100 bg-white focus:border-sky-400'
                      }`}
                  />
                  {status === 'correct' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-[24px] z-10"
                    >
                      <div className="text-center">
                        <span className="text-2xl font-black text-emerald-500 block mb-1">Excellent!</span>
                        <span className="text-sm text-emerald-400 font-bold">Next problem coming...</span>
                      </div>
                    </motion.div>
                  )}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <button
                      onClick={handleCheck}
                      disabled={status === 'correct' || !userAnswer}
                      className="px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      OK
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-[24px] grid grid-cols-7 gap-2 shadow-inner select-none flex-1 content-start">
                  {['y', '=', 'x', '1', '2', '3', '+'].map(k => (
                    <button key={k} onClick={() => insertChar(k)} className="h-12 bg-white rounded-xl font-bold text-lg text-slate-600 shadow-sm hover:translate-y-[-2px] active:translate-y-0 transition-all hover:shadow-md hover:text-sky-600">{k}</button>
                  ))}
                  {['/', '(', ')', '4', '5', '6', '−'].map(k => (
                    <button key={k} onClick={() => insertChar(k)} className="h-12 bg-white rounded-xl font-bold text-lg text-slate-600 shadow-sm hover:translate-y-[-2px] active:translate-y-0 transition-all hover:shadow-md hover:text-sky-600">{k}</button>
                  ))}
                  {['a', '≦', '≧', '7', '8', '9', '0'].map(k => (
                    <button key={k} onClick={() => insertChar(k)} className="h-12 bg-white rounded-xl font-bold text-lg text-slate-600 shadow-sm hover:translate-y-[-2px] active:translate-y-0 transition-all hover:shadow-md hover:text-sky-600">{k}</button>
                  ))}
                  <div className="col-span-5 hidden sm:block" />
                  <button onClick={() => setUserAnswer('')} className="col-span-1 h-12 bg-rose-50 text-rose-400 rounded-xl font-bold shadow-sm flex items-center justify-center italic text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-colors">Clear</button>
                  <button onClick={backspace} className="col-span-1 h-12 bg-white text-slate-400 rounded-xl font-bold shadow-sm flex items-center justify-center hover:text-slate-600 transition-colors"><Delete size={18} /></button>
                </div>
              </div>
            ) : (
              <div className="h-full w-full relative bg-white">
                <Tldraw persistenceKey="mathbudy-scratchpad" hideUi={false} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 右：進捗 */}
      <aside className="w-80 flex-shrink-0 bg-white border-l border-slate-200 p-8 flex flex-col gap-10">
        <div className="p-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-[32px] text-white shadow-xl shadow-sky-200/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <Award className="mb-4 text-white/80" size={32} />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-white/60">Current Score</p>
          <p className="text-5xl font-black">{score.toLocaleString()}</p>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6">Mastery History</h3>
          <div className="space-y-3 overflow-y-auto flex-1 custom-scrollbar pr-2">
            <AnimatePresence>
              {history.map((h) => (
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
      </aside>

    </div>
  );
};

export default MathStudioV2;
