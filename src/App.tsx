import { useEffect } from 'react';
import { useGameStore } from './stores/useGameStore';
import LeftSidebar from './components/LeftSidebar';
import ProblemCard from './components/ProblemCard';
import AnswerInput from './components/AnswerInput';
import RightSidebar from './components/RightSidebar';
import ChallengeOverlay from './components/ChallengeOverlay';

const MathStudioV2 = () => {
  const { currentProblem, status, challengeMode, generateProblem, advanceChallenge } = useGameStore();

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
    <div className="flex h-screen w-full bg-[#F8FAFC] text-slate-700 overflow-hidden font-sans">
      <LeftSidebar />

      <main className="flex-1 relative flex flex-col items-center p-8 overflow-hidden">
        {/* Dot background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <ChallengeOverlay />

        <div className="w-full max-w-2xl z-10 space-y-6 flex flex-col h-full">
          <ProblemCard />
          <AnswerInput />
        </div>
      </main>

      <RightSidebar />
    </div>
  );
};

export default MathStudioV2;
