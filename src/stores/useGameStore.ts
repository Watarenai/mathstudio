import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GeneratedProblem, getRandomProblemByDifficulty, checkAnswer, generateInverseProportion, generateLinearEquation } from '../data/mockProblems';
import { GeometryProblem, getRandomGeometryProblemByDifficulty, generateSectorProblem } from '../data/geometryProblems';

// 履歴データの型
export interface HistoryItem {
    id: string;
    points: number;
    label: string;
}

// 間違えた問題の型
export interface WrongAnswerItem {
    id: string;
    problem: GeneratedProblem | GeometryProblem;
    userAnswer: string;
    timestamp: number;
}

export type Difficulty = 'Easy' | 'Normal' | 'Hard' | 'Expert';
export type Genre = 'proportional' | 'geometry' | 'inverse' | 'equation' | 'sector';
export type WorkspaceMode = 'input' | 'drawing';
export type AnswerStatus = 'idle' | 'correct' | 'incorrect';

// ジャンル別の問題取得
function getProblemByGenre(genre: Genre, difficulty: Difficulty): GeneratedProblem | GeometryProblem {
    switch (genre) {
        case 'proportional':
            return getRandomProblemByDifficulty(difficulty);
        case 'geometry':
            return getRandomGeometryProblemByDifficulty(difficulty);
        case 'inverse':
            return generateInverseProportion(difficulty);
        case 'equation':
            return generateLinearEquation(difficulty);
        case 'sector':
            return generateSectorProblem(difficulty);
        default:
            return getRandomProblemByDifficulty(difficulty);
    }
}

// チャレンジ用問題リスト生成
function generateChallengeProblems(count: number, genre: Genre): (GeneratedProblem | GeometryProblem)[] {
    const problems: (GeneratedProblem | GeometryProblem)[] = [];
    const distribution = [
        { level: 'Easy' as Difficulty, ratio: 0.4 },
        { level: 'Normal' as Difficulty, ratio: 0.3 },
        { level: 'Hard' as Difficulty, ratio: 0.2 },
        { level: 'Expert' as Difficulty, ratio: 0.1 },
    ];

    for (const { level, ratio } of distribution) {
        const num = Math.max(1, Math.round(count * ratio));
        for (let i = 0; i < num && problems.length < count; i++) {
            problems.push(getProblemByGenre(genre, level));
        }
    }
    return problems.slice(0, count);
}

interface GameState {
    // Problem state
    difficulty: Difficulty;
    genre: Genre;
    currentProblem: GeneratedProblem | GeometryProblem | null;
    userAnswer: string;
    hintIndex: number;
    status: AnswerStatus;

    // Score state
    score: number;
    history: HistoryItem[];
    currentProblemPoints: number;
    wrongAnswers: WrongAnswerItem[];

    // Challenge state
    challengeMode: boolean;
    problemCountInput: number;
    challengeProblems: (GeneratedProblem | GeometryProblem)[];
    challengeIndex: number;
    challengeComplete: boolean;

    // Workspace state
    workspaceMode: WorkspaceMode;

    // Actions
    setDifficulty: (d: Difficulty) => void;
    setGenre: (g: Genre) => void;
    setUserAnswer: (a: string) => void;
    setProblemCountInput: (n: number) => void;
    setWorkspaceMode: (m: WorkspaceMode) => void;
    generateProblem: (level?: Difficulty, selectedGenre?: Genre) => void;
    startChallenge: () => void;
    exitChallenge: () => void;
    insertChar: (char: string) => void;
    backspace: () => void;
    handleCheck: () => void;
    requestHint: () => void;
    retryProblem: (item: WrongAnswerItem) => void;
    advanceChallenge: () => void;
}

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            // Initial state
            difficulty: 'Easy',
            genre: 'proportional',
            currentProblem: null,
            userAnswer: '',
            hintIndex: -1,
            status: 'idle',
            score: 0,
            history: [],
            currentProblemPoints: 100,
            wrongAnswers: [],
            challengeMode: false,
            problemCountInput: 10,
            challengeProblems: [],
            challengeIndex: 0,
            challengeComplete: false,
            workspaceMode: 'input',

            // Simple setters
            setDifficulty: (d) => set({ difficulty: d }),
            setGenre: (g) => set({ genre: g }),
            setUserAnswer: (a) => set({ userAnswer: a, status: 'idle' }),
            setProblemCountInput: (n) => set({ problemCountInput: Math.max(1, Math.min(50, n)) }),
            setWorkspaceMode: (m) => set({ workspaceMode: m }),

            // Generate a new problem
            generateProblem: (level, selectedGenre) => {
                const { difficulty, genre } = get();
                const lvl = level ?? difficulty;
                const g = selectedGenre ?? genre;
                const problem = getProblemByGenre(g, lvl);
                set({
                    currentProblem: problem,
                    userAnswer: '',
                    hintIndex: -1,
                    status: 'idle',
                    workspaceMode: 'input',
                    currentProblemPoints: 100,
                });
            },

            // Challenge mode
            startChallenge: () => {
                const { problemCountInput, genre } = get();
                const problems = generateChallengeProblems(problemCountInput, genre);
                set({
                    challengeProblems: problems,
                    challengeIndex: 0,
                    currentProblem: problems[0],
                    challengeMode: true,
                    challengeComplete: false,
                    userAnswer: '',
                    hintIndex: -1,
                    status: 'idle',
                    workspaceMode: 'input',
                    currentProblemPoints: 100,
                });
            },

            exitChallenge: () => {
                set({
                    challengeMode: false,
                    challengeComplete: false,
                    challengeProblems: [],
                    challengeIndex: 0,
                    score: 0,
                    history: [],
                });
                get().generateProblem();
            },

            advanceChallenge: () => {
                const { challengeIndex, challengeProblems } = get();
                if (challengeIndex < challengeProblems.length - 1) {
                    const nextIndex = challengeIndex + 1;
                    set({
                        challengeIndex: nextIndex,
                        currentProblem: challengeProblems[nextIndex],
                        userAnswer: '',
                        hintIndex: -1,
                        status: 'idle',
                        workspaceMode: 'input',
                        currentProblemPoints: 100,
                    });
                } else {
                    set({ challengeComplete: true });
                }
            },

            // Input helpers
            insertChar: (char) => {
                if (get().status === 'correct') return;
                set((s) => ({ userAnswer: s.userAnswer + char, status: 'idle' }));
            },

            backspace: () => {
                if (get().status === 'correct') return;
                set((s) => ({ userAnswer: s.userAnswer.slice(0, -1), status: 'idle' }));
            },

            // Hint
            requestHint: () => {
                const { currentProblem, hintIndex } = get();
                if (!currentProblem) return;
                if (hintIndex < currentProblem.hints.length - 1) {
                    set((s) => ({
                        hintIndex: s.hintIndex + 1,
                        currentProblemPoints: Math.max(s.currentProblemPoints - 15, 10),
                    }));
                }
            },

            // Check answer
            handleCheck: () => {
                const { currentProblem, userAnswer, currentProblemPoints, challengeMode, challengeIndex, challengeProblems } = get();
                if (!currentProblem) return;

                const isCorrect = checkAnswer(currentProblem, userAnswer);
                if (isCorrect) {
                    const finalPoints = Math.max(currentProblemPoints, 10);
                    set((s) => ({
                        status: 'correct',
                        score: s.score + finalPoints,
                        history: [{
                            id: Date.now().toString(),
                            points: finalPoints,
                            label: challengeMode ? `${challengeIndex + 1}/${challengeProblems.length}` : 'QUEST COMPLETE!',
                        }, ...s.history],
                    }));
                } else {
                    set((s) => ({
                        status: 'incorrect',
                        currentProblemPoints: Math.max(s.currentProblemPoints - 20, 10),
                        wrongAnswers: currentProblem && !s.wrongAnswers.some(w => w.problem.id === currentProblem.id)
                            ? [...s.wrongAnswers, { id: Date.now().toString(), problem: currentProblem, userAnswer, timestamp: Date.now() }]
                            : s.wrongAnswers,
                    }));
                }
            },

            // Retry from review queue
            retryProblem: (item) => {
                if (get().challengeMode) return;
                set((s) => ({
                    currentProblem: item.problem,
                    userAnswer: '',
                    hintIndex: -1,
                    status: 'idle',
                    currentProblemPoints: 100,
                    wrongAnswers: s.wrongAnswers.filter(w => w.id !== item.id),
                }));
            },
        }),
        {
            name: 'mathstudio-progress',
            partialize: (state) => ({
                score: state.score,
                history: state.history,
                wrongAnswers: state.wrongAnswers,
                difficulty: state.difficulty,
                genre: state.genre,
            }),
        }
    )
);
