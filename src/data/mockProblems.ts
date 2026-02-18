// 問題データ型定義 + ユーティリティ関数 + 動的生成
// 静的データは proportionalProblems.json から読み込み
// 反比例・一次方程式は動的生成

import proportionalData from './proportionalProblems.json';

// ============================================
// 型定義
// ============================================

export interface ProblemMeta {
    difficulty: 'Easy' | 'Normal' | 'Hard' | 'Expert';
    points: number;
    unit: '比例' | '反比例' | '一次方程式';
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

// ============================================
// ヘルパー
// ============================================

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const POINTS_MAP: Record<string, number> = { Easy: 100, Normal: 200, Hard: 300, Expert: 400 };

// 約数を返す
function getDivisors(n: number): number[] {
    const abs = Math.abs(n);
    const divs: number[] = [];
    for (let i = 1; i <= abs; i++) {
        if (abs % i === 0) divs.push(i);
    }
    return divs;
}

// ============================================
// 静的データ（JSON）
// ============================================

export const allProblemsWithExpert: GeneratedProblem[] = proportionalData as GeneratedProblem[];

export const getProblemsByDifficulty = (difficulty: 'Easy' | 'Normal' | 'Hard' | 'Expert') =>
    allProblemsWithExpert.filter(p => p.meta.difficulty === difficulty);

export function getRandomProblem(): GeneratedProblem {
    return allProblemsWithExpert[Math.floor(Math.random() * allProblemsWithExpert.length)];
}

export function getRandomProblemByDifficulty(difficulty: 'Easy' | 'Normal' | 'Hard' | 'Expert'): GeneratedProblem {
    const filtered = getProblemsByDifficulty(difficulty);
    return filtered[Math.floor(Math.random() * filtered.length)];
}

// ============================================
// 動的生成: 反比例 (Inverse Proportions)
// y = a / x
// ============================================

export function generateInverseProportion(difficulty: 'Easy' | 'Normal' | 'Hard' | 'Expert'): GeneratedProblem {
    const isHard = difficulty === 'Hard' || difficulty === 'Expert';
    const constants = [6, 8, 12, 16, 18, 24, 36];
    let a = constants[rand(0, constants.length - 1)];
    if (isHard && Math.random() > 0.5) a = -a;

    const divisors = getDivisors(a);
    const x1 = divisors[rand(0, divisors.length - 1)];
    const y1 = a / x1;

    // x2 は x1 と異なる約数を選ぶ
    const otherDivisors = divisors.filter(d => d !== x1);
    const x2 = otherDivisors.length > 0 ? otherDivisors[rand(0, otherDivisors.length - 1)] : x1;
    const y2 = a / x2;

    // 難易度別の問題パターン
    const problemTypes = difficulty === 'Easy' || difficulty === 'Normal'
        ? ['value', 'formula'] : ['value', 'formula', 'domain'];

    const type = problemTypes[rand(0, problemTypes.length - 1)];

    let text: string, answer: string, variants: string[];

    if (type === 'value') {
        text = `yはxに反比例し、x = ${x1} のとき y = ${y1} です。x = ${x2} のときの y の値を求めなさい。`;
        answer = y2.toString();
        variants = [`y=${y2}`, `y = ${y2}`];
    } else if (type === 'formula') {
        text = `yはxに反比例し、x = ${x1} のとき y = ${y1} です。yをxの式で表しなさい。`;
        answer = `y=${a}/x`;
        variants = [`y = ${a}/x`, `y=${a}÷x`];
    } else {
        // domain (変域)
        const d1 = divisors[rand(0, Math.min(2, divisors.length - 1))];
        const d2 = divisors[rand(Math.max(0, divisors.length - 3), divisors.length - 1)];
        const minX = Math.min(d1, d2) || 1;
        const maxX = Math.max(d1, d2) || 2;
        const minY = a / maxX;
        const maxY = a / minX;
        const yLow = Math.min(minY, maxY);
        const yHigh = Math.max(minY, maxY);
        text = `y = ${a}/x で、xの変域が ${minX} ≦ x ≦ ${maxX} のとき、yの変域を求めなさい。`;
        answer = `${yLow}≦y≦${yHigh}`;
        variants = [`${yLow} ≦ y ≦ ${yHigh}`, `${yLow}<=y<=${yHigh}`];
    }

    return {
        id: `inv-gen-${Date.now()}-${rand(0, 999)}`,
        meta: { difficulty, points: POINTS_MAP[difficulty], unit: '反比例' },
        problem: { text, correct_answer: answer, answer_variants: variants },
        hints: [
            '反比例の式は y = a/x の形です。',
            `x = ${x1}, y = ${y1} を代入すると a = ${x1} × ${y1} = ${a}`,
            `よって y = ${a}/x です。`,
        ],
        chips: [x1.toString(), y1.toString(), a.toString(), x2.toString(), 'x', 'y', '=', '÷', '/'],
    };
}

// ============================================
// 動的生成: 一次方程式 (Linear Equations)
// ax + b = c (x は整数)
// ============================================

export function generateLinearEquation(difficulty: 'Easy' | 'Normal' | 'Hard' | 'Expert'): GeneratedProblem {
    let x: number, a: number, b: number, c: number;
    let text: string, hints: string[];

    if (difficulty === 'Easy') {
        // ax = c (bなし)
        a = rand(2, 5);
        x = rand(1, 9);
        c = a * x;
        b = 0;
        text = `${a}x = ${c} のとき、x の値を求めなさい。`;
        hints = [
            `両辺を ${a} で割ります。`,
            `x = ${c} ÷ ${a}`,
        ];
    } else if (difficulty === 'Normal') {
        // ax + b = c
        a = rand(2, 5);
        x = rand(1, 9);
        b = rand(1, 15);
        c = a * x + b;
        text = `${a}x + ${b} = ${c} のとき、x の値を求めなさい。`;
        hints = [
            `まず ${b} を右辺に移項します。`,
            `${a}x = ${c} - ${b} = ${c - b}`,
            `両辺を ${a} で割ると x = ${x}`,
        ];
    } else if (difficulty === 'Hard') {
        // ax + b = c (負の解もあり)
        a = rand(2, 7);
        x = rand(-9, 9);
        b = rand(-10, 20);
        c = a * x + b;
        const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
        text = `${a}x ${bStr} = ${c} のとき、x の値を求めなさい。`;
        hints = [
            `まず定数項を右辺に移項します。`,
            `${a}x = ${c} ${b >= 0 ? `- ${b}` : `+ ${Math.abs(b)}`} = ${c - b}`,
            `両辺を ${a} で割ると x = ${x}`,
        ];
    } else {
        // Expert: ax + b = dx + e (両辺にx)
        a = rand(3, 8);
        const d = rand(1, a - 1); // a > d を保証
        x = rand(-5, 9);
        b = rand(-10, 15);
        const e = (a - d) * x + b;
        const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
        const eStr = e >= 0 ? `${e}` : `${e}`;
        text = `${a}x ${bStr} = ${d}x + ${eStr} のとき、x の値を求めなさい。`;
        c = (a - d) * x + b; // unused but for consistency
        hints = [
            `xの項を左辺に、定数を右辺にまとめます。`,
            `${a}x - ${d}x = ${eStr} ${b >= 0 ? `- ${b}` : `+ ${Math.abs(b)}`}`,
            `${a - d}x = ${e - b} → x = ${x}`,
        ];
    }

    return {
        id: `eq-gen-${Date.now()}-${rand(0, 999)}`,
        meta: { difficulty, points: POINTS_MAP[difficulty], unit: '一次方程式' },
        problem: {
            text,
            correct_answer: x.toString(),
            answer_variants: [`x=${x}`, `x = ${x}`],
        },
        hints,
        chips: [a.toString(), b.toString(), c.toString(), x.toString(), 'x', '=', '+', '-', '÷'],
    };
}

// ============================================
// 正解判定関数（全問題タイプ対応）
// ============================================

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
