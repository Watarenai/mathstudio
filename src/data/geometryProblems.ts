// 図形問題 - 型定義 + ユーティリティ関数 + おうぎ形動的生成
// 静的データは geometryProblems.json から読み込み

import { GeneratedProblem, ProblemMeta } from './mockProblems';
import geometryData from './geometryProblems.json';

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const POINTS_MAP: Record<string, number> = { Easy: 100, Normal: 200, Hard: 300, Expert: 400 };

// ============================================
// 型定義
// ============================================

export interface GeometryProblemMeta extends Omit<ProblemMeta, 'unit'> {
    unit: '平面図形' | '図形の移動' | 'おうぎ形';
    genre: 'geometry';
}

export interface GeometryProblem extends Omit<GeneratedProblem, 'meta'> {
    meta: GeometryProblemMeta;
}

// ============================================
// 静的データ（JSON）
// ============================================

export const allGeometryProblems: GeometryProblem[] = geometryData as GeometryProblem[];

export const getGeometryProblemsByDifficulty = (difficulty: 'Easy' | 'Normal' | 'Hard' | 'Expert') =>
    allGeometryProblems.filter(p => p.meta.difficulty === difficulty);

export function getRandomGeometryProblem(): GeometryProblem {
    return allGeometryProblems[Math.floor(Math.random() * allGeometryProblems.length)];
}

export function getRandomGeometryProblemByDifficulty(difficulty: 'Easy' | 'Normal' | 'Hard' | 'Expert'): GeometryProblem {
    const filtered = getGeometryProblemsByDifficulty(difficulty);
    if (filtered.length === 0) {
        const fallback = allGeometryProblems.filter(p => p.meta.difficulty === 'Hard');
        return fallback[Math.floor(Math.random() * fallback.length)];
    }
    return filtered[Math.floor(Math.random() * filtered.length)];
}

// ============================================
// 動的生成: おうぎ形 (Sectors)
// ============================================

export function generateSectorProblem(difficulty: 'Easy' | 'Normal' | 'Hard' | 'Expert'): GeometryProblem {
    // 難易度別パラメータ
    const radiusOptions = difficulty === 'Easy' || difficulty === 'Normal'
        ? [3, 4, 5, 6, 8, 10]
        : [3, 5, 6, 7, 9, 12];
    const angleOptions = difficulty === 'Easy'
        ? [90, 180]
        : difficulty === 'Normal'
            ? [60, 90, 120, 180]
            : [45, 60, 72, 90, 120, 150, 180, 270];

    const r = radiusOptions[rand(0, radiusOptions.length - 1)];
    const theta = angleOptions[rand(0, angleOptions.length - 1)];

    // 出題タイプをランダムに選択
    const types = difficulty === 'Easy'
        ? ['arc'] // Easyは弧の長さのみ
        : ['arc', 'area'];
    const type = types[rand(0, types.length - 1)];

    // 分数を簡約
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const g = gcd(theta, 360);
    const fracNum = theta / g;
    const fracDen = 360 / g;
    const fractionStr = fracDen === 1 ? `${fracNum}` : `${fracNum}/${fracDen}`;

    let text: string, answer: string, variants: string[], calcHint: string;

    if (type === 'arc') {
        // 弧の長さ: 2πr × (θ/360)
        // 約分して表示
        const arcGcd = gcd(2 * r * fracNum, fracDen);
        const arcNum = (2 * r * fracNum) / arcGcd;
        const arcDen = fracDen / arcGcd;
        const answerStr = arcDen === 1 ? `${arcNum}π` : `${arcNum}π/${arcDen}`;

        text = `半径 ${r}cm、中心角 ${theta}° のおうぎ形の弧の長さを求めなさい。（円周率は π とする）`;
        answer = answerStr;
        variants = [
            `${answerStr}cm`, `${answerStr} cm`,
            // 小数版も許容
        ];
        calcHint = `弧の長さ = 2 × π × ${r} × ${fractionStr} = ${answerStr}`;
    } else {
        // 面積: πr² × (θ/360)
        const rSquared = r * r;
        const areaGcd = gcd(rSquared * fracNum, fracDen);
        const areaNum = (rSquared * fracNum) / areaGcd;
        const areaDen = fracDen / areaGcd;
        const answerStr = areaDen === 1 ? `${areaNum}π` : `${areaNum}π/${areaDen}`;

        text = `半径 ${r}cm、中心角 ${theta}° のおうぎ形の面積を求めなさい。（円周率は π とする）`;
        answer = answerStr;
        variants = [
            `${answerStr}cm²`, `${answerStr} cm²`, `${answerStr}cm2`,
        ];
        calcHint = `面積 = π × ${r}² × ${fractionStr} = ${answerStr}`;
    }

    return {
        id: `sector-gen-${Date.now()}-${rand(0, 999)}`,
        meta: { difficulty, points: POINTS_MAP[difficulty], unit: 'おうぎ形', genre: 'geometry' },
        problem: { text, correct_answer: answer, answer_variants: variants },
        hints: [
            `円全体の ${fractionStr} にあたります（${theta}/360 = ${fractionStr}）。`,
            type === 'arc'
                ? `弧の長さ = 2πr × ${fractionStr}`
                : `面積 = πr² × ${fractionStr}`,
            calcHint,
        ],
        chips: [r.toString(), theta.toString(), '360', 'π', '×', '÷', '=', '²'],
    };
}
