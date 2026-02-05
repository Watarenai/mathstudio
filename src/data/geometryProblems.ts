// 図形問題データ - 平面図形と図形の移動
// Easy (100pt), Normal (200pt), Hard (300pt), Expert (400pt)

import { GeneratedProblem, ProblemMeta } from './mockProblems';

// Geometry専用のメタ情報（unitを拡張）
export interface GeometryProblemMeta extends Omit<ProblemMeta, 'unit'> {
    unit: '平面図形' | '図形の移動';
    genre: 'geometry';
}

export interface GeometryProblem extends Omit<GeneratedProblem, 'meta'> {
    meta: GeometryProblemMeta;
}

// ============================================
// 平面図形 - Easy (100pt)
// ============================================

const geometry_plane_easy_01: GeometryProblem = {
    id: 'geo-plane-easy-01',
    meta: { difficulty: 'Easy', points: 100, unit: '平面図形', genre: 'geometry' },
    problem: {
        text: '直線上の点Aで、∠AOB = 70°のとき、∠BOCは何度ですか。（O, A, B, Cは直線上）',
        correct_answer: '110',
        answer_variants: ['110°', '110度'],
    },
    hints: [
        '直線上の角度は180°です。',
        '∠AOB + ∠BOC = 180°',
        '180° - 70° = 110°',
    ],
    chips: ['70', '110', '180', '°', '+', '-', '='],
};

const geometry_plane_easy_02: GeometryProblem = {
    id: 'geo-plane-easy-02',
    meta: { difficulty: 'Easy', points: 100, unit: '平面図形', genre: 'geometry' },
    problem: {
        text: '正三角形の1つの内角は何度ですか。',
        correct_answer: '60',
        answer_variants: ['60°', '60度'],
    },
    hints: [
        '三角形の内角の和は180°です。',
        '正三角形は3つの角が等しいです。',
        '180° ÷ 3 = 60°',
    ],
    chips: ['60', '180', '3', '°', '÷', '='],
};

const geometry_plane_easy_03: GeometryProblem = {
    id: 'geo-plane-easy-03',
    meta: { difficulty: 'Easy', points: 100, unit: '平面図形', genre: 'geometry' },
    problem: {
        text: '対頂角は等しい。∠A = 45°のとき、対頂角の∠Bは何度ですか。',
        correct_answer: '45',
        answer_variants: ['45°', '45度'],
    },
    hints: [
        '対頂角は向かい合う角です。',
        '対頂角は常に等しくなります。',
    ],
    chips: ['45', '°', '='],
};

const geometry_plane_easy_04: GeometryProblem = {
    id: 'geo-plane-easy-04',
    meta: { difficulty: 'Easy', points: 100, unit: '平面図形', genre: 'geometry' },
    problem: {
        text: '長方形の面積を求めなさい。縦 5cm、横 8cm。',
        correct_answer: '40',
        answer_variants: ['40cm²', '40 cm²', '40cm2'],
    },
    hints: [
        '長方形の面積 = 縦 × 横',
        '5 × 8 = 40',
    ],
    chips: ['5', '8', '40', 'cm²', '×', '='],
};

// ============================================
// 平面図形 - Normal (200pt)
// ============================================

const geometry_plane_normal_01: GeometryProblem = {
    id: 'geo-plane-normal-01',
    meta: { difficulty: 'Normal', points: 200, unit: '平面図形', genre: 'geometry' },
    problem: {
        text: '三角形で、∠A = 50°、∠B = 60°のとき、∠Cは何度ですか。',
        correct_answer: '70',
        answer_variants: ['70°', '70度'],
    },
    hints: [
        '三角形の内角の和は180°です。',
        '∠A + ∠B + ∠C = 180°',
        '180° - 50° - 60° = 70°',
    ],
    chips: ['50', '60', '70', '180', '°', '+', '-', '='],
};

const geometry_plane_normal_02: GeometryProblem = {
    id: 'geo-plane-normal-02',
    meta: { difficulty: 'Normal', points: 200, unit: '平面図形', genre: 'geometry' },
    problem: {
        text: '平行線と錯角。l // m のとき、錯角は等しい。∠x = 75°のとき、錯角の∠yは何度ですか。',
        correct_answer: '75',
        answer_variants: ['75°', '75度'],
    },
    hints: [
        '平行線で錯角は等しくなります。',
        '∠x と ∠y は錯角の関係です。',
    ],
    chips: ['75', '°', '='],
};

const geometry_plane_normal_03: GeometryProblem = {
    id: 'geo-plane-normal-03',
    meta: { difficulty: 'Normal', points: 200, unit: '平面図形', genre: 'geometry' },
    problem: {
        text: '三角形の外角は、それと隣り合わない2つの内角の和に等しい。∠A = 40°、∠B = 50°のとき、∠Cの外角は何度ですか。',
        correct_answer: '90',
        answer_variants: ['90°', '90度'],
    },
    hints: [
        '外角 = 隣り合わない2つの内角の和',
        '∠Aの大きさ + ∠Bの大きさ = 外角',
        '40° + 50° = 90°',
    ],
    chips: ['40', '50', '90', '°', '+', '='],
};

const geometry_plane_normal_04: GeometryProblem = {
    id: 'geo-plane-normal-04',
    meta: { difficulty: 'Normal', points: 200, unit: '平面図形', genre: 'geometry' },
    problem: {
        text: '台形の面積を求めなさい。上底 4cm、下底 8cm、高さ 5cm。',
        correct_answer: '30',
        answer_variants: ['30cm²', '30 cm²', '30cm2'],
    },
    hints: [
        '台形の面積 = (上底 + 下底) × 高さ ÷ 2',
        '(4 + 8) × 5 ÷ 2 = 12 × 5 ÷ 2',
        '60 ÷ 2 = 30',
    ],
    chips: ['4', '5', '8', '30', '60', 'cm²', '×', '÷', '+', '='],
};

// ============================================
// 平面図形 - Hard (300pt)
// ============================================

const geometry_plane_hard_01: GeometryProblem = {
    id: 'geo-plane-hard-01',
    meta: { difficulty: 'Hard', points: 300, unit: '平面図形', genre: 'geometry' },
    problem: {
        text: '正五角形の1つの内角は何度ですか。',
        correct_answer: '108',
        answer_variants: ['108°', '108度'],
    },
    hints: [
        'n角形の内角の和 = (n-2) × 180°',
        '正五角形の内角の和 = (5-2) × 180° = 540°',
        '1つの内角 = 540° ÷ 5 = 108°',
    ],
    chips: ['5', '108', '180', '540', '°', '×', '÷', '-', '='],
};

const geometry_plane_hard_02: GeometryProblem = {
    id: 'geo-plane-hard-02',
    meta: { difficulty: 'Hard', points: 300, unit: '平面図形', genre: 'geometry' },
    problem: {
        text: '円の半径が 7cm のとき、円周の長さは何cmですか。（円周率はπとする）',
        correct_answer: '14π',
        answer_variants: ['14πcm', '14π cm', '14*π'],
    },
    hints: [
        '円周 = 2 × π × 半径',
        '2 × π × 7 = 14π',
    ],
    chips: ['2', '7', '14', 'π', '×', '='],
};

// ============================================
// 図形の移動 - Easy (100pt)
// ============================================

const geometry_move_easy_01: GeometryProblem = {
    id: 'geo-move-easy-01',
    meta: { difficulty: 'Easy', points: 100, unit: '図形の移動', genre: 'geometry' },
    problem: {
        text: '点A(2, 3)を右に4、上に2だけ平行移動させると、点A\'の座標は何ですか。',
        correct_answer: '(6,5)',
        answer_variants: ['(6, 5)', '6,5', 'A\'(6,5)'],
    },
    hints: [
        'x座標: 2 + 4 = 6',
        'y座標: 3 + 2 = 5',
        '移動後の座標は (6, 5)',
    ],
    chips: ['2', '3', '4', '5', '6', '(', ')', ',', '+', '='],
};

const geometry_move_easy_02: GeometryProblem = {
    id: 'geo-move-easy-02',
    meta: { difficulty: 'Easy', points: 100, unit: '図形の移動', genre: 'geometry' },
    problem: {
        text: '点P(5, 2)を左に3、下に1だけ平行移動させると、点P\'の座標は何ですか。',
        correct_answer: '(2,1)',
        answer_variants: ['(2, 1)', '2,1', 'P\'(2,1)'],
    },
    hints: [
        'x座標: 5 - 3 = 2',
        'y座標: 2 - 1 = 1',
        '移動後の座標は (2, 1)',
    ],
    chips: ['1', '2', '3', '5', '(', ')', ',', '-', '='],
};

// ============================================
// 図形の移動 - Normal (200pt)
// ============================================

const geometry_move_normal_01: GeometryProblem = {
    id: 'geo-move-normal-01',
    meta: { difficulty: 'Normal', points: 200, unit: '図形の移動', genre: 'geometry' },
    problem: {
        text: '点A(3, 4)をx軸について対称移動すると、点A\'の座標は何ですか。',
        correct_answer: '(3,-4)',
        answer_variants: ['(3, -4)', '3,-4'],
    },
    hints: [
        'x軸について対称移動するとy座標の符号が変わります。',
        'x座標はそのまま: 3',
        'y座標は符号反転: 4 → -4',
    ],
    chips: ['3', '4', '-4', '(', ')', ',', '-', '='],
};

const geometry_move_normal_02: GeometryProblem = {
    id: 'geo-move-normal-02',
    meta: { difficulty: 'Normal', points: 200, unit: '図形の移動', genre: 'geometry' },
    problem: {
        text: '点B(5, -2)をy軸について対称移動すると、点B\'の座標は何ですか。',
        correct_answer: '(-5,-2)',
        answer_variants: ['(-5, -2)', '-5,-2'],
    },
    hints: [
        'y軸について対称移動するとx座標の符号が変わります。',
        'x座標は符号反転: 5 → -5',
        'y座標はそのまま: -2',
    ],
    chips: ['2', '5', '-2', '-5', '(', ')', ',', '-', '='],
};

const geometry_move_normal_03: GeometryProblem = {
    id: 'geo-move-normal-03',
    meta: { difficulty: 'Normal', points: 200, unit: '図形の移動', genre: 'geometry' },
    problem: {
        text: '点C(2, 3)を原点Oを中心に180°回転させると、点C\'の座標は何ですか。',
        correct_answer: '(-2,-3)',
        answer_variants: ['(-2, -3)', '-2,-3'],
    },
    hints: [
        '原点を中心に180°回転すると、両方の座標の符号が変わります。',
        'x座標: 2 → -2',
        'y座標: 3 → -3',
    ],
    chips: ['2', '3', '-2', '-3', '(', ')', ',', '-', '='],
};

// ============================================
// 図形の移動 - Hard (300pt)
// ============================================

const geometry_move_hard_01: GeometryProblem = {
    id: 'geo-move-hard-01',
    meta: { difficulty: 'Hard', points: 300, unit: '図形の移動', genre: 'geometry' },
    problem: {
        text: '点A(4, 0)を原点Oを中心に反時計回りに90°回転させると、点A\'の座標は何ですか。',
        correct_answer: '(0,4)',
        answer_variants: ['(0, 4)', '0,4'],
    },
    hints: [
        '90°反時計回りの回転: (x, y) → (-y, x)',
        'A(4, 0) → A\'(-0, 4) = A\'(0, 4)',
    ],
    chips: ['0', '4', '(', ')', ',', '-', '='],
};

const geometry_move_hard_02: GeometryProblem = {
    id: 'geo-move-hard-02',
    meta: { difficulty: 'Hard', points: 300, unit: '図形の移動', genre: 'geometry' },
    problem: {
        text: '点P(1, 2)を直線y = xについて対称移動すると、点P\'の座標は何ですか。',
        correct_answer: '(2,1)',
        answer_variants: ['(2, 1)', '2,1'],
    },
    hints: [
        '直線y = xについて対称移動すると、xとyの座標が入れ替わります。',
        'P(1, 2) → P\'(2, 1)',
    ],
    chips: ['1', '2', '(', ')', ',', '='],
};

// ============================================
// エクスポート
// ============================================

export const allGeometryProblems: GeometryProblem[] = [
    // 平面図形 Easy
    geometry_plane_easy_01,
    geometry_plane_easy_02,
    geometry_plane_easy_03,
    geometry_plane_easy_04,
    // 平面図形 Normal
    geometry_plane_normal_01,
    geometry_plane_normal_02,
    geometry_plane_normal_03,
    geometry_plane_normal_04,
    // 平面図形 Hard
    geometry_plane_hard_01,
    geometry_plane_hard_02,
    // 図形の移動 Easy
    geometry_move_easy_01,
    geometry_move_easy_02,
    // 図形の移動 Normal
    geometry_move_normal_01,
    geometry_move_normal_02,
    geometry_move_normal_03,
    // 図形の移動 Hard
    geometry_move_hard_01,
    geometry_move_hard_02,
];

// 難易度別にフィルタリング
export const getGeometryProblemsByDifficulty = (difficulty: 'Easy' | 'Normal' | 'Hard' | 'Expert') =>
    allGeometryProblems.filter(p => p.meta.difficulty === difficulty);

// ランダムに1問取得
export function getRandomGeometryProblem(): GeometryProblem {
    const randomIndex = Math.floor(Math.random() * allGeometryProblems.length);
    return allGeometryProblems[randomIndex];
}

// 難易度を指定してランダムに1問取得
export function getRandomGeometryProblemByDifficulty(difficulty: 'Easy' | 'Normal' | 'Hard' | 'Expert'): GeometryProblem {
    const filtered = getGeometryProblemsByDifficulty(difficulty);
    if (filtered.length === 0) {
        // Expertがない場合はHardを返す
        const fallback = allGeometryProblems.filter(p => p.meta.difficulty === 'Hard');
        return fallback[Math.floor(Math.random() * fallback.length)];
    }
    return filtered[Math.floor(Math.random() * filtered.length)];
}
