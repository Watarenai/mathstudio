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
    unit: '比例' | '反比例' | '一次方程式' | '一次関数' | '連立方程式';
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
// 動的生成: 一次関数 (Linear Function)
// y = ax + b
// ============================================

export function generateLinearFunction(difficulty: 'Easy' | 'Normal' | 'Hard' | 'Expert'): GeneratedProblem {
    let a: number, b: number, x: number;
    let text: string, answer: string, variants: string[];
    let hints: string[] = [];
    let chips: string[] = [];

    // 傾きと切片をランダム生成
    a = rand(2, 5) * (Math.random() > 0.5 ? 1 : -1);
    b = rand(1, 10) * (Math.random() > 0.5 ? 1 : -1);

    // Easy: xからyを求める (y = 2x + 3, x = 4)
    if (difficulty === 'Easy') {
        x = rand(1, 5);
        const y = a * x + b;
        const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
        text = `一次関数 y = ${a}x ${bStr} について、x = ${x} のときの y の値を求めなさい。`;
        answer = y.toString();
        variants = [`y=${y}`, `y = ${y}`, `${y}`];
        hints = [
            `式 y = ${a}x ${bStr} の x に ${x} を代入します。`,
            `y = ${a} × ${x} ${bStr}`,
            `y = ${a * x} ${bStr} = ${y}`,
        ];
        chips = [a.toString(), x.toString(), b.toString(), y.toString(), 'x', 'y', '=', '+', '-'];
    }
    // Normal: 傾きと1点から式を求める (変化の割合が2で、点(1,3)を通る)
    else if (difficulty === 'Normal') {
        x = rand(1, 4);
        const y = a * x + b;
        text = `変化の割合が ${a} で、点 (${x}, ${y}) を通る直線の式を求めなさい。`;
        const bStr = b >= 0 ? `+${b}` : `${b}`; // スペースなしで正規化
        answer = `y=${a}x${bStr}`;
        variants = [`y = ${a}x ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}`];
        hints = [
            `求める式を y = ${a}x + b と置きます。`,
            `x = ${x}, y = ${y} を代入して b を求めます。`,
            `${y} = ${a} × ${x} + b → ${y} = ${a * x} + b → b = ${b}`,
        ];
        chips = ['y', '=', 'x', '+', '-', a.toString(), b.toString(), x.toString(), y.toString()];
    }
    // Hard: 2点から式を求める (連立方程式を使わない解法)
    else {
        const x1 = rand(1, 3);
        const x2 = x1 + rand(2, 4); // x2 > x1
        const y1 = a * x1 + b;
        const y2 = a * x2 + b;

        text = `2点 (${x1}, ${y1}), (${x2}, ${y2}) を通る直線の式を求めなさい。`;
        const bStr = b >= 0 ? `+${b}` : `${b}`;
        answer = `y=${a}x${bStr}`;
        variants = [`y = ${a}x ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}`];
        hints = [
            `まず変化の割合（傾き）a を求めます: (yの増加量) ÷ (xの増加量)`,
            `a = (${y2} - ${y1}) ÷ (${x2} - ${x1}) = ${a}`,
            `y = ${a}x + b に1点の座標を代入して b を求めます。`,
        ];
        chips = ['y', '=', 'x', '+', '-', a.toString(), b.toString(), '2'];
    }

    return {
        id: `lin-gen-${Date.now()}-${rand(0, 999)}`,
        meta: { difficulty, points: POINTS_MAP[difficulty], unit: '一次関数' },
        problem: { text, correct_answer: answer, answer_variants: variants },
        hints,
        chips,
    };
}

// ============================================
// 動的生成: 連立方程式 (Simultaneous Equations)
// ax + by = c, dx + ey = f
// ============================================

export function generateSimultaneousEquation(difficulty: 'Easy' | 'Normal' | 'Hard' | 'Expert'): GeneratedProblem {
    // 解を整数にするため逆算で生成
    const x = rand(1, 6) * (Math.random() > 0.5 ? 1 : -1);
    const y = rand(1, 6) * (Math.random() > 0.5 ? 1 : -1);

    // 式1: ax + by = c
    const a = rand(1, 4);
    const b = rand(1, 4) * (Math.random() > 0.5 ? 1 : -1);
    const c = a * x + b * y;

    // 式2: dx + ey = f
    let d = rand(1, 4);
    /* d/a != e/b になるように調整（平行にならないように） */
    let e = rand(1, 4) * (Math.random() > 0.5 ? 1 : -1);
    while (a * e === b * d) {
        e = rand(1, 5) * (Math.random() > 0.5 ? 1 : -1);
    }
    const f = d * x + e * y;


    // 係数が1の場合は数字を省略
    const formatTerm = (coef: number, val: string) => {
        if (coef === 1) return val;
        if (coef === -1) return `-${val}`;
        return `${coef}${val}`;
    }

    const eq1 = `${formatTerm(a, 'x')} ${b >= 0 ? '+' : '-'} ${formatTerm(Math.abs(b), 'y')} = ${c}`;
    const eq2 = `${formatTerm(d, 'x')} ${e >= 0 ? '+' : '-'} ${formatTerm(Math.abs(e), 'y')} = ${f}`;

    const text = `次の連立方程式を解きなさい。\n${eq1} ...①\n${eq2} ...②`;
    const answer = `x=${x},y=${y}`; // スペースなし

    const variants = [
        `x = ${x}, y = ${y}`,
        `x=${x}, y=${y}`,
        `x:${x},y:${y}`
    ];

    return {
        id: `sys-gen-${Date.now()}-${rand(0, 999)}`,
        meta: { difficulty, points: POINTS_MAP[difficulty] + 50, unit: '連立方程式' }, // 少し配点高め
        problem: { text, correct_answer: answer, answer_variants: variants },
        hints: [
            `①か②の式を変形して、代入法か加減法で解きます。`,
            `片方の文字を消去することを目指しましょう。`,
            `解: x = ${x}, y = ${y}`,
        ],
        chips: ['x', 'y', '=', ',', x.toString(), y.toString(), a.toString(), d.toString()],
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
