// 問題データ型定義 + ユーティリティ関数
// データ本体は proportionalProblems.json から読み込み

import proportionalData from './proportionalProblems.json';

export interface ProblemMeta {
    difficulty: 'Easy' | 'Normal' | 'Hard' | 'Expert';
    points: number;
    unit: '比例' | '反比例';
}

export interface Problem {
    text: string;
    correct_answer: string;
    answer_variants?: string[];
}

export interface GeneratedProblem {
    id: string;
    meta: ProblemMeta;
    problem: Problem;
    hints: string[];
    chips: string[];
}

// JSONからデータ読み込み
export const allProblemsWithExpert: GeneratedProblem[] = proportionalData as GeneratedProblem[];

// 難易度別フィルタリング
export const getProblemsByDifficulty = (difficulty: 'Easy' | 'Normal' | 'Hard' | 'Expert') =>
    allProblemsWithExpert.filter(p => p.meta.difficulty === difficulty);

// ランダムに1問取得
export function getRandomProblem(): GeneratedProblem {
    return allProblemsWithExpert[Math.floor(Math.random() * allProblemsWithExpert.length)];
}

// 難易度を指定してランダムに1問取得
export function getRandomProblemByDifficulty(difficulty: 'Easy' | 'Normal' | 'Hard' | 'Expert'): GeneratedProblem {
    const filtered = getProblemsByDifficulty(difficulty);
    return filtered[Math.floor(Math.random() * filtered.length)];
}

// 正解判定関数（両方の問題タイプに対応）
export function checkAnswer(problem: { problem: Problem }, userAnswer: string): boolean {
    const normalize = (str: string) => {
        return str
            .replace(/\s/g, '')
            .toLowerCase()
            .replace(/−/g, '-')
            .replace(/×/g, '*')
            .replace(/÷/g, '/');
    };

    const normalizedUserAnswer = normalize(userAnswer);
    const normalizedCorrect = normalize(problem.problem.correct_answer);

    if (normalizedUserAnswer === normalizedCorrect) return true;

    if (problem.problem.answer_variants) {
        return problem.problem.answer_variants.some(
            variant => normalize(variant) === normalizedUserAnswer
        );
    }

    return false;
}
