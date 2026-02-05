// AI生成問題データ V3 - Self-Paced Sandbox対応
// ヒント配列と正解判定用データを含む

export interface ProblemMeta {
    difficulty: 'Easy' | 'Normal' | 'Hard';
    points: number;
    unit: '比例' | '反比例';
}

export interface Problem {
    text: string;
    correct_answer: string;      // 正解（式または値）
    answer_variants?: string[];  // 正解の別表現（オプション）
}

export interface GeneratedProblem {
    id: string;
    meta: ProblemMeta;
    problem: Problem;
    hints: string[];  // 段階的に表示するヒント
    chips: string[];  // ドラッグ可能チップ
}

// ============================================
// 比例 - Easy (100pt)
// ============================================

const proportional_easy_01: GeneratedProblem = {
    id: 'prop-easy-01',
    meta: { difficulty: 'Easy', points: 100, unit: '比例' },
    problem: {
        text: 'y = 3x のとき、x = 4 ならば y はいくつですか。',
        correct_answer: '12',
        answer_variants: ['y=12', 'y = 12'],
    },
    hints: [
        'y = 3x の x のところに 4 を入れます。',
        'y = 3 × 4 を計算してみましょう。',
    ],
    chips: ['3', '4', '12', 'x', 'y', '=', '×'],
};

const proportional_easy_02: GeneratedProblem = {
    id: 'prop-easy-02',
    meta: { difficulty: 'Easy', points: 100, unit: '比例' },
    problem: {
        text: 'y = 2x で y = 10 のとき、x の値を求めなさい。',
        correct_answer: '5',
        answer_variants: ['x=5', 'x = 5'],
    },
    hints: [
        'y = 2x に y = 10 を代入します。',
        '10 = 2x となります。x を求めるには両辺を 2 で割ります。',
    ],
    chips: ['2', '5', '10', 'x', 'y', '=', '÷'],
};

const proportional_easy_03: GeneratedProblem = {
    id: 'prop-easy-03',
    meta: { difficulty: 'Easy', points: 100, unit: '比例' },
    problem: {
        text: 'y = 5x のとき、x = 3 ならば y はいくつですか。',
        correct_answer: '15',
        answer_variants: ['y=15', 'y = 15'],
    },
    hints: [
        'x = 3 を式に代入します。',
        'y = 5 × 3 を計算しましょう。',
    ],
    chips: ['3', '5', '15', 'x', 'y', '=', '×'],
};

const proportional_easy_04: GeneratedProblem = {
    id: 'prop-easy-04',
    meta: { difficulty: 'Easy', points: 100, unit: '比例' },
    problem: {
        text: 'y = 4x のとき、x = 6 ならば y はいくつですか。',
        correct_answer: '24',
        answer_variants: ['y=24', 'y = 24'],
    },
    hints: [
        'x = 6 を式に代入します。',
        'y = 4 × 6 を計算しましょう。',
    ],
    chips: ['4', '6', '24', 'x', 'y', '=', '×'],
};

const proportional_easy_05: GeneratedProblem = {
    id: 'prop-easy-05',
    meta: { difficulty: 'Easy', points: 100, unit: '比例' },
    problem: {
        text: 'y = 7x で y = 21 のとき、x の値を求めなさい。',
        correct_answer: '3',
        answer_variants: ['x=3', 'x = 3'],
    },
    hints: [
        'y = 7x に y = 21 を代入します。',
        '21 = 7x なので、x = 21 ÷ 7',
    ],
    chips: ['3', '7', '21', 'x', 'y', '=', '÷'],
};

const proportional_easy_06: GeneratedProblem = {
    id: 'prop-easy-06',
    meta: { difficulty: 'Easy', points: 100, unit: '比例' },
    problem: {
        text: 'y = 6x のとき、x = 5 ならば y はいくつですか。',
        correct_answer: '30',
        answer_variants: ['y=30', 'y = 30'],
    },
    hints: [
        'x = 5 を式に代入します。',
        'y = 6 × 5 を計算しましょう。',
    ],
    chips: ['5', '6', '30', 'x', 'y', '=', '×'],
};

// ============================================
// 比例 - Normal (200pt)
// ============================================

const proportional_normal_01: GeneratedProblem = {
    id: 'prop-normal-01',
    meta: { difficulty: 'Normal', points: 200, unit: '比例' },
    problem: {
        text: 'y は x に比例し、x = 2 のとき y = 6 です。比例定数 a を求めなさい。',
        correct_answer: '3',
        answer_variants: ['a=3', 'a = 3'],
    },
    hints: [
        'y が x に比例するので y = ax と書けます。',
        'x = 2, y = 6 を代入すると 6 = a × 2 となります。',
        '両辺を 2 で割って a を求めます。',
    ],
    chips: ['2', '3', '6', 'a', 'x', 'y', '=', '×', '÷'],
};

const proportional_normal_02: GeneratedProblem = {
    id: 'prop-normal-02',
    meta: { difficulty: 'Normal', points: 200, unit: '比例' },
    problem: {
        text: '1分間に 5cm ずつ進むロボットがあります。x 分間で進む距離を y cm として、y を x の式で表しなさい。',
        correct_answer: 'y=5x',
        answer_variants: ['y = 5x', 'y=5*x'],
    },
    hints: [
        '1分で 5cm 進むということは、x分では何cm進むでしょう？',
        '時間 × 速さ = 距離 の関係を使います。',
        'x分 × 5cm = □cm',
    ],
    chips: ['1', '5', 'x', 'y', '=', '×', 'cm', '分'],
};

const proportional_normal_03: GeneratedProblem = {
    id: 'prop-normal-03',
    meta: { difficulty: 'Normal', points: 200, unit: '比例' },
    problem: {
        text: '1個 80円 のりんごを x 個買ったときの代金を y 円とします。y を x の式で表しなさい。',
        correct_answer: 'y=80x',
        answer_variants: ['y = 80x', 'y=80*x'],
    },
    hints: [
        '単価 × 個数 = 合計金額 の関係です。',
        '1個 80円 なので、x個では 80 × x 円かかります。',
    ],
    chips: ['80', 'x', 'y', '=', '×', '円', '個'],
};

const proportional_normal_04: GeneratedProblem = {
    id: 'prop-normal-04',
    meta: { difficulty: 'Normal', points: 200, unit: '比例' },
    problem: {
        text: 'y は x に比例し、x = 5 のとき y = 20 です。y を x の式で表しなさい。',
        correct_answer: 'y=4x',
        answer_variants: ['y = 4x', 'y=4*x'],
    },
    hints: [
        'まず比例定数 a を求めます。y = ax に代入します。',
        '20 = a × 5 から a = 4 です。',
        'よって y = 4x となります。',
    ],
    chips: ['4', '5', '20', 'a', 'x', 'y', '=', '×'],
};

const proportional_normal_05: GeneratedProblem = {
    id: 'prop-normal-05',
    meta: { difficulty: 'Normal', points: 200, unit: '比例' },
    problem: {
        text: '水槽に毎分 3L ずつ水を入れます。x 分後の水の量を y L とするとき、y を x の式で表しなさい。',
        correct_answer: 'y=3x',
        answer_variants: ['y = 3x', 'y=3*x'],
    },
    hints: [
        '1分で 3L 入るなら、x分では？',
        '時間 × 速さ = 量 の関係です。',
    ],
    chips: ['3', 'x', 'y', '=', '×', 'L', '分'],
};

const proportional_normal_06: GeneratedProblem = {
    id: 'prop-normal-06',
    meta: { difficulty: 'Normal', points: 200, unit: '比例' },
    problem: {
        text: 'y は x に比例し、x = 3 のとき y = 15 です。x = 7 のとき y の値を求めなさい。',
        correct_answer: '35',
        answer_variants: ['y=35', 'y = 35'],
    },
    hints: [
        'まず比例定数を求めます。15 = a × 3 から a = 5',
        'y = 5x に x = 7 を代入します。',
        'y = 5 × 7 = 35',
    ],
    chips: ['3', '5', '7', '15', '35', 'x', 'y', '=', '×'],
};

// ============================================
// 比例 - Hard (300pt)
// ============================================

const proportional_hard_01: GeneratedProblem = {
    id: 'prop-hard-01',
    meta: { difficulty: 'Hard', points: 300, unit: '比例' },
    problem: {
        text: 'グラフが点 (4, 12) を通る比例の式を求めなさい。',
        correct_answer: 'y=3x',
        answer_variants: ['y = 3x', 'y=3*x'],
    },
    hints: [
        '比例は y = ax の形です。',
        '点 (4, 12) は x = 4, y = 12 を意味します。',
        '12 = a × 4 から a を求めます。a = 3 です。',
    ],
    chips: ['3', '4', '12', 'a', 'x', 'y', '=', '×', '÷'],
};

const proportional_hard_02: GeneratedProblem = {
    id: 'prop-hard-02',
    meta: { difficulty: 'Hard', points: 300, unit: '比例' },
    problem: {
        text: 'y = 2x で、x の変域が 1 ≦ x ≦ 5 のとき、y の変域を求めなさい。',
        correct_answer: '2≦y≦10',
        answer_variants: ['2 ≦ y ≦ 10', '2<=y<=10', '2 <= y <= 10'],
    },
    hints: [
        'x = 1 のとき y = 2 × 1 = 2',
        'x = 5 のとき y = 2 × 5 = 10',
        '比例定数が正なので、x が増えると y も増えます。',
    ],
    chips: ['1', '2', '5', '10', 'x', 'y', '≦', '='],
};

const proportional_hard_03: GeneratedProblem = {
    id: 'prop-hard-03',
    meta: { difficulty: 'Hard', points: 300, unit: '比例' },
    problem: {
        text: 'グラフが点 (-2, 8) を通る比例の式を求めなさい。',
        correct_answer: 'y=-4x',
        answer_variants: ['y = -4x', 'y=-4*x'],
    },
    hints: [
        '比例は y = ax の形です。点を代入します。',
        '8 = a × (-2) より a = 8 ÷ (-2) = -4',
        'よって y = -4x',
    ],
    chips: ['-4', '-2', '8', 'a', 'x', 'y', '=', '×', '÷'],
};

const proportional_hard_04: GeneratedProblem = {
    id: 'prop-hard-04',
    meta: { difficulty: 'Hard', points: 300, unit: '比例' },
    problem: {
        text: 'y = -3x で、x の変域が -2 ≦ x ≦ 4 のとき、y の変域を求めなさい。',
        correct_answer: '-12≦y≦6',
        answer_variants: ['-12 ≦ y ≦ 6', '-12<=y<=6'],
    },
    hints: [
        'x = -2 のとき y = -3 × (-2) = 6',
        'x = 4 のとき y = -3 × 4 = -12',
        '比例定数が負なので、x が増えると y は減ります。',
    ],
    chips: ['-12', '-3', '-2', '4', '6', 'x', 'y', '≦', '='],
};

// ============================================
// 反比例 - Easy (100pt)
// ============================================

const inverse_easy_01: GeneratedProblem = {
    id: 'inv-easy-01',
    meta: { difficulty: 'Easy', points: 100, unit: '反比例' },
    problem: {
        text: 'y = 12/x のとき、x = 3 ならば y はいくつですか。',
        correct_answer: '4',
        answer_variants: ['y=4', 'y = 4'],
    },
    hints: [
        'y = 12/x に x = 3 を代入します。',
        'y = 12 ÷ 3 を計算しましょう。',
    ],
    chips: ['3', '4', '12', 'x', 'y', '=', '÷'],
};

const inverse_easy_02: GeneratedProblem = {
    id: 'inv-easy-02',
    meta: { difficulty: 'Easy', points: 100, unit: '反比例' },
    problem: {
        text: 'y = 20/x で y = 5 のとき、x の値を求めなさい。',
        correct_answer: '4',
        answer_variants: ['x=4', 'x = 4'],
    },
    hints: [
        '5 = 20/x という式になります。',
        'xy = 20 なので、5 × x = 20 です。',
        'x = 20 ÷ 5 = 4',
    ],
    chips: ['4', '5', '20', 'x', 'y', '=', '×', '÷'],
};

const inverse_easy_03: GeneratedProblem = {
    id: 'inv-easy-03',
    meta: { difficulty: 'Easy', points: 100, unit: '反比例' },
    problem: {
        text: 'y = 18/x のとき、x = 6 ならば y はいくつですか。',
        correct_answer: '3',
        answer_variants: ['y=3', 'y = 3'],
    },
    hints: [
        'x = 6 を式に代入します。',
        'y = 18 ÷ 6 を計算します。',
    ],
    chips: ['3', '6', '18', 'x', 'y', '=', '÷'],
};

const inverse_easy_04: GeneratedProblem = {
    id: 'inv-easy-04',
    meta: { difficulty: 'Easy', points: 100, unit: '反比例' },
    problem: {
        text: 'y = 24/x のとき、x = 8 ならば y はいくつですか。',
        correct_answer: '3',
        answer_variants: ['y=3', 'y = 3'],
    },
    hints: [
        'x = 8 を式に代入します。',
        'y = 24 ÷ 8 を計算します。',
    ],
    chips: ['3', '8', '24', 'x', 'y', '=', '÷'],
};

const inverse_easy_05: GeneratedProblem = {
    id: 'inv-easy-05',
    meta: { difficulty: 'Easy', points: 100, unit: '反比例' },
    problem: {
        text: 'y = 30/x で y = 6 のとき、x の値を求めなさい。',
        correct_answer: '5',
        answer_variants: ['x=5', 'x = 5'],
    },
    hints: [
        '6 = 30/x という式になります。',
        'x = 30 ÷ 6 = 5',
    ],
    chips: ['5', '6', '30', 'x', 'y', '=', '÷'],
};

const inverse_easy_06: GeneratedProblem = {
    id: 'inv-easy-06',
    meta: { difficulty: 'Easy', points: 100, unit: '反比例' },
    problem: {
        text: 'y = 16/x のとき、x = 4 ならば y はいくつですか。',
        correct_answer: '4',
        answer_variants: ['y=4', 'y = 4'],
    },
    hints: [
        'x = 4 を式に代入します。',
        'y = 16 ÷ 4 を計算します。',
    ],
    chips: ['4', '16', 'x', 'y', '=', '÷'],
};

// ============================================
// 反比例 - Normal (200pt)
// ============================================

const inverse_normal_01: GeneratedProblem = {
    id: 'inv-normal-01',
    meta: { difficulty: 'Normal', points: 200, unit: '反比例' },
    problem: {
        text: 'y は x に反比例し、x = 4 のとき y = 6 です。比例定数 a を求めなさい。',
        correct_answer: '24',
        answer_variants: ['a=24', 'a = 24'],
    },
    hints: [
        '反比例は y = a/x の形です。',
        'xy = a（一定）という関係を使います。',
        '4 × 6 = 24',
    ],
    chips: ['4', '6', '24', 'a', 'x', 'y', '=', '×'],
};

const inverse_normal_02: GeneratedProblem = {
    id: 'inv-normal-02',
    meta: { difficulty: 'Normal', points: 200, unit: '反比例' },
    problem: {
        text: '面積が 36 cm² の長方形があります。縦の長さを x cm、横の長さを y cm とするとき、y を x の式で表しなさい。',
        correct_answer: 'y=36/x',
        answer_variants: ['y = 36/x', 'y=36÷x'],
    },
    hints: [
        '長方形の面積 = 縦 × 横 = xy',
        'xy = 36 なので、y について解きます。',
        '両辺を x で割ると y = 36/x',
    ],
    chips: ['36', 'x', 'y', '=', '×', '÷', 'cm²', 'cm'],
};

const inverse_normal_03: GeneratedProblem = {
    id: 'inv-normal-03',
    meta: { difficulty: 'Normal', points: 200, unit: '反比例' },
    problem: {
        text: '1200mの道のりを、毎分 x mの速さで歩くときにかかる時間を y 分とします。y を x の式で表しなさい。',
        correct_answer: 'y=1200/x',
        answer_variants: ['y = 1200/x', 'y=1200÷x'],
    },
    hints: [
        '道のり = 速さ × 時間 の関係を使います。',
        '時間 = 道のり ÷ 速さ に書き換えます。',
        'y = 1200 ÷ x = 1200/x',
    ],
    chips: ['1200', 'x', 'y', '=', '÷', 'm', '分'],
};

const inverse_normal_04: GeneratedProblem = {
    id: 'inv-normal-04',
    meta: { difficulty: 'Normal', points: 200, unit: '反比例' },
    problem: {
        text: 'y は x に反比例し、x = 5 のとき y = 8 です。y を x の式で表しなさい。',
        correct_answer: 'y=40/x',
        answer_variants: ['y = 40/x', 'y=40÷x'],
    },
    hints: [
        'xy = a なので、5 × 8 = 40',
        'よって y = 40/x',
    ],
    chips: ['5', '8', '40', 'x', 'y', '=', '×', '÷'],
};

const inverse_normal_05: GeneratedProblem = {
    id: 'inv-normal-05',
    meta: { difficulty: 'Normal', points: 200, unit: '反比例' },
    problem: {
        text: '60個のあめを x 人で等しく分けると、1人あたり y 個もらえます。y を x の式で表しなさい。',
        correct_answer: 'y=60/x',
        answer_variants: ['y = 60/x', 'y=60÷x'],
    },
    hints: [
        '全体 ÷ 人数 = 1人あたりの個数',
        'y = 60 ÷ x',
    ],
    chips: ['60', 'x', 'y', '=', '÷', '個', '人'],
};

const inverse_normal_06: GeneratedProblem = {
    id: 'inv-normal-06',
    meta: { difficulty: 'Normal', points: 200, unit: '反比例' },
    problem: {
        text: 'y は x に反比例し、x = 3 のとき y = 12 です。x = 9 のとき y の値を求めなさい。',
        correct_answer: '4',
        answer_variants: ['y=4', 'y = 4'],
    },
    hints: [
        'まず xy = a を求めます。3 × 12 = 36',
        'x = 9 のとき、9 × y = 36',
        'y = 36 ÷ 9 = 4',
    ],
    chips: ['3', '4', '9', '12', '36', 'x', 'y', '=', '×', '÷'],
};

// ============================================
// 反比例 - Hard (300pt)
// ============================================

const inverse_hard_01: GeneratedProblem = {
    id: 'inv-hard-01',
    meta: { difficulty: 'Hard', points: 300, unit: '反比例' },
    problem: {
        text: 'グラフが点 (3, 8) を通る反比例の式を求めなさい。',
        correct_answer: 'y=24/x',
        answer_variants: ['y = 24/x', 'y=24÷x'],
    },
    hints: [
        '反比例は y = a/x の形です。',
        '点 (3, 8) では xy = a なので、3 × 8 = 24',
        'よって y = 24/x',
    ],
    chips: ['3', '8', '24', 'a', 'x', 'y', '=', '×', '÷'],
};

const inverse_hard_02: GeneratedProblem = {
    id: 'inv-hard-02',
    meta: { difficulty: 'Hard', points: 300, unit: '反比例' },
    problem: {
        text: 'y = 24/x で、x の変域が 2 ≦ x ≦ 6 のとき、y の変域を求めなさい。',
        correct_answer: '4≦y≦12',
        answer_variants: ['4 ≦ y ≦ 12', '4<=y<=12', '4 <= y <= 12'],
    },
    hints: [
        'x = 2 のとき y = 24 ÷ 2 = 12',
        'x = 6 のとき y = 24 ÷ 6 = 4',
        '反比例では x が増えると y は減ります。',
    ],
    chips: ['2', '4', '6', '12', '24', 'x', 'y', '≦', '='],
};

const inverse_hard_03: GeneratedProblem = {
    id: 'inv-hard-03',
    meta: { difficulty: 'Hard', points: 300, unit: '反比例' },
    problem: {
        text: 'グラフが点 (5, -6) を通る反比例の式を求めなさい。',
        correct_answer: 'y=-30/x',
        answer_variants: ['y = -30/x', 'y=-30÷x'],
    },
    hints: [
        '反比例は y = a/x の形です。',
        '5 × (-6) = -30',
        'よって y = -30/x',
    ],
    chips: ['-30', '-6', '5', 'a', 'x', 'y', '=', '×', '÷'],
};

const inverse_hard_04: GeneratedProblem = {
    id: 'inv-hard-04',
    meta: { difficulty: 'Hard', points: 300, unit: '反比例' },
    problem: {
        text: 'y = 48/x で、x の変域が 4 ≦ x ≦ 12 のとき、y の変域を求めなさい。',
        correct_answer: '4≦y≦12',
        answer_variants: ['4 ≦ y ≦ 12', '4<=y<=12'],
    },
    hints: [
        'x = 4 のとき y = 48 ÷ 4 = 12',
        'x = 12 のとき y = 48 ÷ 12 = 4',
        '反比例では x が増えると y は減ります。',
    ],
    chips: ['4', '12', '48', 'x', 'y', '≦', '=', '÷'],
};

// ============================================
// エクスポート
// ============================================

export const allProblems: GeneratedProblem[] = [
    // 比例 Easy (6問)
    proportional_easy_01,
    proportional_easy_02,
    proportional_easy_03,
    proportional_easy_04,
    proportional_easy_05,
    proportional_easy_06,
    // 比例 Normal (6問)
    proportional_normal_01,
    proportional_normal_02,
    proportional_normal_03,
    proportional_normal_04,
    proportional_normal_05,
    proportional_normal_06,
    // 比例 Hard (4問)
    proportional_hard_01,
    proportional_hard_02,
    proportional_hard_03,
    proportional_hard_04,
    // 反比例 Easy (6問)
    inverse_easy_01,
    inverse_easy_02,
    inverse_easy_03,
    inverse_easy_04,
    inverse_easy_05,
    inverse_easy_06,
    // 反比例 Normal (6問)
    inverse_normal_01,
    inverse_normal_02,
    inverse_normal_03,
    inverse_normal_04,
    inverse_normal_05,
    inverse_normal_06,
    // 反比例 Hard (4問)
    inverse_hard_01,
    inverse_hard_02,
    inverse_hard_03,
    inverse_hard_04,
];

// 難易度別にフィルタリング
export const getProblemsByDifficulty = (difficulty: 'Easy' | 'Normal' | 'Hard') =>
    allProblems.filter(p => p.meta.difficulty === difficulty);

// ランダムに1問取得
export function getRandomProblem(): GeneratedProblem {
    const randomIndex = Math.floor(Math.random() * allProblems.length);
    return allProblems[randomIndex];
}

// 難易度を指定してランダムに1問取得
export function getRandomProblemByDifficulty(difficulty: 'Easy' | 'Normal' | 'Hard'): GeneratedProblem {
    const filtered = getProblemsByDifficulty(difficulty);
    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex];
}

// 正解判定関数
export function checkAnswer(problem: GeneratedProblem, userAnswer: string): boolean {
    // 正規化: 全角半角統一、空白除去、記号統一
    const normalize = (str: string) => {
        return str
            .replace(/\s/g, '')
            .toLowerCase()
            .replace(/−/g, '-')  // Minus sign U+2212 to Hyphen U+002D
            .replace(/×/g, '*')  // Multiplication sign to asterisk
            .replace(/÷/g, '/'); // Division sign to slash
    };

    const normalizedUserAnswer = normalize(userAnswer);
    const normalizedCorrect = normalize(problem.problem.correct_answer);

    if (normalizedUserAnswer === normalizedCorrect) return true;

    // 別表現もチェック
    if (problem.problem.answer_variants) {
        return problem.problem.answer_variants.some(
            variant => normalize(variant) === normalizedUserAnswer
        );
    }

    return false;
}
