import { useEffect, useState } from 'react';
import { useGameStore } from './stores/useGameStore';
import LeftSidebar from './components/LeftSidebar';
import ProblemCard from './components/ProblemCard';
import AnswerInput from './components/AnswerInput';
import RightSidebar from './components/RightSidebar';
import ChallengeOverlay from './components/ChallengeOverlay';
import ProblemEditor from './components/ProblemEditor';
import { useAuthStore } from './stores/useAuthStore';
import { isSupabaseConfigured } from './lib/supabase';
import { Menu, BarChart3 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const MathStudioV2 = () => {
  const { currentProblem, status, challengeMode, generateProblem, advanceChallenge } = useGameStore();
  const { user } = useAuthStore();
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const canAddProblems = isSupabaseConfigured && !!user;

  // 初回ロード
  useEffect(() => { generateProblem(); }, []);

  // 正解後の自動進行
  useEffect(() => {
    if (status === 'correct') {
      const timer = window.setTimeout(() => {
        if (challengeMode) {
          advanceChallenge();
        } else {
          generateProblem();
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, challengeMode]);

  if (!currentProblem) return null;

  return (
    <div className="flex h-screen h-[100dvh] w-full bg-[#F8FAFC] text-slate-700 overflow-hidden font-sans">
      {/* Mobile overlay backdrop */}
      {(leftOpen || rightOpen) && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => { setLeftOpen(false); setRightOpen(false); }}
        />
      )}

      {/* Left Sidebar - drawer on mobile */}
      <div className={`
        fixed top-0 left-0 h-full z-40 transition-transform duration-300 ease-out
        lg:relative lg:translate-x-0 lg:z-10
        ${leftOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <LeftSidebar onClose={() => setLeftOpen(false)} onAddProblem={canAddProblems ? () => setEditorOpen(true) : undefined} />
      </div>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col items-center p-4 md:p-8 overflow-hidden">
        {/* Dot background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        {/* Mobile top bar */}
        <div className="flex items-center justify-between w-full max-w-2xl z-20 mb-4 lg:hidden">
          <button
            onClick={() => setLeftOpen(true)}
            className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500 hover:text-slate-700 active:scale-95 transition-all"
          >
            <Menu size={20} />
          </button>
          <span className="text-xs font-black text-slate-300 uppercase tracking-widest">MathStudio</span>
          <button
            onClick={() => setRightOpen(true)}
            className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500 hover:text-slate-700 active:scale-95 transition-all"
          >
            <BarChart3 size={20} />
          </button>
        </div>

        <ChallengeOverlay />

        <div className="w-full max-w-2xl z-10 space-y-4 md:space-y-6 flex flex-col flex-1 min-h-0">
          <ProblemCard />
          <AnswerInput />
        </div>
      </main>

      {/* Right Sidebar - drawer on mobile */}
      <div className={`
        fixed top-0 right-0 h-full z-40 transition-transform duration-300 ease-out
        lg:relative lg:translate-x-0 lg:z-10
        ${rightOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <RightSidebar onClose={() => setRightOpen(false)} />
      </div>

      {/* Problem Editor Modal */}
      <AnimatePresence>
        {editorOpen && <ProblemEditor onClose={() => setEditorOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default MathStudioV2;
