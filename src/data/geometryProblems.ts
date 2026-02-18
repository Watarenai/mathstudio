// 図形問題 - 型定義 + ユーティリティ関数
// データ本体は geometryProblems.json から読み込み

import { GeneratedProblem, ProblemMeta } from './mockProblems';
import geometryData from './geometryProblems.json';

// Geometry専用のメタ情報（unitを拡張）
export interface GeometryProblemMeta extends Omit<ProblemMeta, 'unit'> {
    unit: '平面図形' | '図形の移動';
    genre: 'geometry';
}

export interface GeometryProblem extends Omit<GeneratedProblem, 'meta'> {
    meta: GeometryProblemMeta;
}

// JSONからデータ読み込み
export const allGeometryProblems: GeometryProblem[] = geometryData as GeometryProblem[];

// 難易度別にフィルタリング
export const getGeometryProblemsByDifficulty = (difficulty: 'Easy' | 'Normal' | 'Hard' | 'Expert') =>
    allGeometryProblems.filter(p => p.meta.difficulty === difficulty);

// ランダムに1問取得
export function getRandomGeometryProblem(): GeometryProblem {
    return allGeometryProblems[Math.floor(Math.random() * allGeometryProblems.length)];
}

// 難易度を指定してランダムに1問取得
export function getRandomGeometryProblemByDifficulty(difficulty: 'Easy' | 'Normal' | 'Hard' | 'Expert'): GeometryProblem {
    const filtered = getGeometryProblemsByDifficulty(difficulty);
    if (filtered.length === 0) {
        const fallback = allGeometryProblems.filter(p => p.meta.difficulty === 'Hard');
        return fallback[Math.floor(Math.random() * fallback.length)];
    }
    return filtered[Math.floor(Math.random() * filtered.length)];
}
