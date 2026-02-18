import React, { useState } from 'react';
import { BookOpen, PenTool, Hash, BrainCircuit, Shapes } from 'lucide-react';

export type ProblemCategory = 'simple' | 'fraction' | 'graph' | 'word' | 'advanced' | 'geometry';

export interface Problem {
    id: string;
    category: ProblemCategory;
    title: string;
    text: string;
    formula?: string;
    coefficient?: number;
    keywords?: string[]; // For flexible string matching
    graphMode?: 'proportional' | 'inverse' | 'area'; // Interaction mode for graph
}

const PROBLEMS: Problem[] = [
    // --- 1. Basic (Simple Ratio) ---
    { id: '1', category: 'simple', title: 'No.1', text: 'x=2, y=8', formula: 'y = 4x', coefficient: 4 },
    { id: '2', category: 'simple', title: 'No.2', text: 'x=3, y=15', formula: 'y = 5x', coefficient: 5 },
    { id: '3', category: 'simple', title: 'No.3', text: 'x=5, y=30', formula: 'y = 6x', coefficient: 6 },
    { id: '4', category: 'simple', title: 'No.4', text: 'x=4, y=4', formula: 'y = x', coefficient: 1 },
    { id: '5', category: 'simple', title: 'No.5', text: 'x=7, y=14', formula: 'y = 2x', coefficient: 2 },
    { id: '6', category: 'simple', title: 'No.6', text: 'x=3, y=-9', formula: 'y = -3x', coefficient: -3 },
    { id: '7', category: 'simple', title: 'No.7', text: 'x=-4, y=12', formula: 'y = -3x', coefficient: -3 },
    { id: '8', category: 'simple', title: 'No.8', text: 'x=-2, y=-10', formula: 'y = 5x', coefficient: 5 },
    { id: '9', category: 'simple', title: 'No.9', text: 'x=6, y=-12', formula: 'y = -2x', coefficient: -2 },
    { id: '10', category: 'simple', title: 'No.10', text: 'x=8, y=32', formula: 'y = 4x', coefficient: 4 },

    // --- 2. Fraction / Decimal ---
    { id: '16', category: 'fraction', title: 'No.16', text: 'x=4, y=2', formula: 'y = 0.5x', coefficient: 0.5 },
    { id: '17', category: 'fraction', title: 'No.17', text: 'x=6, y=4', formula: 'y = 2/3x', coefficient: 2 / 3 },
    { id: '18', category: 'fraction', title: 'No.18', text: 'x=15, y=3', formula: 'y = 0.2x', coefficient: 0.2 },
    { id: '19', category: 'fraction', title: 'No.19', text: 'x=8, y=-6', formula: 'y = -0.75x', coefficient: -0.75 },
    { id: '20', category: 'fraction', title: 'No.20', text: 'x=-9, y=6', formula: 'y = -2/3x', coefficient: -2 / 3 },

    // --- 3. Graphs ---
    { id: 'g1', category: 'graph', title: 'グラフ描画 1', text: 'y = 2x のグラフを描きなさい。', formula: 'y = 2x', coefficient: 2, graphMode: 'proportional' },
    { id: 'g8', category: 'graph', title: '点を通るグラフ 1', text: 'x=2, y=6 を通る比例のグラフを描きなさい。', formula: 'y = 3x', coefficient: 3, graphMode: 'proportional' },

    // --- 4. Word Problems ---
    { id: 'w1', category: 'word', title: '針金の重さ', text: '針金 x m の重さを y g とします。2 m のときの重さが 30 g でした。y を x の式で表しなさい。', formula: 'y = 15x', coefficient: 15 },
    { id: 'w6', category: 'word', title: '動点と面積', text: '底辺 12cm, 高さ 8cm の三角形... (略)', formula: 'y = 6x', coefficient: 6 },

    // --- 5. Advanced / Conceptual (New ID 121+) ---
    {
        id: '121', category: 'advanced', title: '反比例の性質 1',
        text: '反比例 y = a/x のグラフで、xの値が2倍になるとyの値はどうなりますか？',
        keywords: ['半分', '1/2', '0.5'],
        graphMode: 'inverse'
    },
    {
        id: '122', category: 'advanced', title: '反比例の性質 2',
        text: '反比例のグラフの曲線を何といいますか？',
        keywords: ['双曲線', 'そうきょくせん'],
        graphMode: 'inverse'
    },

    // --- Area Calculation (ID 131+) ---
    {
        id: '131', category: 'advanced', title: '面積と比例定数 1',
        text: '反比例のグラフ上の点 A(4, 5) から軸に垂線を引いてできる長方形の面積は？',
        coefficient: 20,
        graphMode: 'area'
    },
    {
        id: '132', category: 'advanced', title: '面積と比例定数 2',
        text: '反比例のグラフ上の点 B(3, -6) X軸Y軸で作る長方形の面積は？(絶対値)',
        coefficient: 18,
        graphMode: 'area'
    },
    {
        id: '133', category: 'advanced', title: '面積と比例定数 3',
        text: 'グラフ上の点(5, 1.2)の作る面積は？',
        coefficient: 6,
        graphMode: 'area'
    },
    {
        id: '134', category: 'advanced', title: '面積と比例定数 4',
        text: 'グラフ上の点(8, 0.5)の作る面積は？',
        coefficient: 4,
        graphMode: 'area'
    },
    {
        id: '135', category: 'advanced', title: '面積と比例定数 5',
        text: 'グラフ上の点(10, 15)の作る面積は？',
        coefficient: 150,
        graphMode: 'area'
    },

    // --- Tricky Calculation (ID 136+) ---
    {
        id: '136', category: 'advanced', title: '分数座標 1',
        text: '反比例 y=a/x が点(2/3, 9)を通るとき、aの値は？',
        coefficient: 6,
        graphMode: 'inverse'
    },
    {
        id: '137', category: 'advanced', title: '分数座標 2',
        text: '反比例 y=a/x が点(3/4, 16)を通るとき、aの値は？',
        coefficient: 12,
        graphMode: 'inverse'
    },
    {
        id: '138', category: 'advanced', title: '分数座標 3',
        text: '反比例 y=a/x が点(5/2, 4)を通るとき、aの値は？',
        coefficient: 10,
        graphMode: 'inverse'
    },
    {
        id: '139', category: 'advanced', title: '分数座標 4',
        text: '反比例 y=a/x が点(0.5, 8)を通るとき、aの値は？',
        coefficient: 4,
        graphMode: 'inverse'
    },
    {
        id: '140', category: 'advanced', title: '分数座標 5',
        text: '反比例 y=a/x が点(1/5, 100)を通るとき、aの値は？',
        coefficient: 20,
        graphMode: 'inverse'
    },

    // --- 6. Geometry / 図形 (平行移動・回転移動・点対称・角度) ---
    // -- 平行移動 (Translation) --
    {
        id: 'geo1', category: 'geometry', title: '平行移動 1',
        text: '△ABCを矢印OPの方向に、矢印の長さだけ平行移動させた△A\'B\'C\'をかきなさい。',
        keywords: ['平行移動', '同じ方向', '同じ長さ']
    },
    {
        id: 'geo2', category: 'geometry', title: '平行移動 2',
        text: '△ABCを平行移動させた△A\'B\'C\'で、点C\'は辺BCの延長上にある。BC=12cm, B\'C\'=3cmのとき、線分BC\'の長さを求めなさい。',
        coefficient: 15,
        keywords: ['15']
    },
    {
        id: 'geo3', category: 'geometry', title: '平行移動 3',
        text: '平行移動では、対応する点を結ぶ線分はどのような関係にありますか？',
        keywords: ['平行', '等しい', '同じ長さ']
    },

    // -- 回転移動 (Rotation) --
    {
        id: 'geo4', category: 'geometry', title: '回転移動 1',
        text: '△ABOを、点Oを中心として反時計回りに90°だけ回転移動させた△A\'B\'Oをかきなさい。',
        keywords: ['90', '反時計回り', '回転']
    },
    {
        id: 'geo5', category: 'geometry', title: '回転移動 2',
        text: '△ABCを点Oを中心に180°回転移動させた図形を何といいますか？',
        keywords: ['点対称', '180']
    },
    {
        id: 'geo6', category: 'geometry', title: '回転移動 3',
        text: '正三角形を中心のまわりに何度回転させると自分自身に重なりますか？（最小の角度）',
        coefficient: 120,
        keywords: ['120']
    },
    {
        id: 'geo7', category: 'geometry', title: '回転移動 4',
        text: '正方形を中心のまわりに回転移動して自分自身に重ねるとき、可能な回転角をすべて答えなさい。',
        keywords: ['90', '180', '270', '360']
    },

    // -- 点対称移動 (Point Symmetry) --
    {
        id: 'geo8', category: 'geometry', title: '点対称移動 1',
        text: '△ABCを、点Oを中心として点対称移動させた△A\'B\'C\'をかきなさい。',
        keywords: ['点対称', '180°回転', 'O']
    },
    {
        id: 'geo9', category: 'geometry', title: '点対称移動 2',
        text: '点対称移動で、対応する点と中心Oの関係を説明しなさい。',
        keywords: ['中点', '一直線', 'Oを通る', '等しい距離']
    },

    // -- 角度 (Angles) --
    {
        id: 'geo10', category: 'geometry', title: '角度 1',
        text: '直線AB上にOがあり、∠AOC = ∠COD, ∠DOE = ∠EOB であるとき、∠COEの大きさを求めなさい。',
        coefficient: 90,
        keywords: ['90']
    },
    {
        id: 'geo11', category: 'geometry', title: '角度 2',
        text: '対頂角の性質を答えなさい。',
        keywords: ['等しい', '同じ']
    },
    {
        id: 'geo12', category: 'geometry', title: '角度 3',
        text: '∠xの対頂角が55°のとき、∠xは何度ですか？',
        coefficient: 55,
        keywords: ['55']
    },
    {
        id: 'geo13', category: 'geometry', title: '角度 4',
        text: '一直線が作る角は何度ですか？',
        coefficient: 180,
        keywords: ['180']
    },

    // -- 回転移動の説明 (Rotation Descriptions) --
    {
        id: 'geo14', category: 'geometry', title: '回転移動の説明',
        text: '長方形ABCDを4つの合同な直角二等辺三角形に分けた。アの三角形は1回の回転移動でイの三角形に重ね合わせることができる。どのような回転移動か説明しなさい。',
        keywords: ['90', '回転', '中心']
    },
    {
        id: 'geo15', category: 'geometry', title: '作図と移動',
        text: '線分ABの垂直二等分線を作図しなさい。（コンパスと定規を使う）',
        keywords: ['垂直二等分線', 'コンパス', '交点']
    },
];

interface ProblemSelectorProps {
    onSelectProblem: (problem: Problem) => void;
    onDoubleClickProblem?: (problem: Problem) => void;
}

const ProblemSelector: React.FC<ProblemSelectorProps> = ({ onSelectProblem, onDoubleClickProblem }) => {
    const [activeCategory, setActiveCategory] = useState<ProblemCategory>('simple');

    const categories: { id: ProblemCategory; label: string; icon: React.ReactNode }[] = [
        { id: 'simple', label: '基本', icon: <Hash size={18} /> },
        { id: 'fraction', label: '分数', icon: <span className="font-bold text-xs">1/2</span> },
        { id: 'graph', label: 'グラフ', icon: <PenTool size={18} /> },
        { id: 'word', label: '文章', icon: <BookOpen size={18} /> },
        { id: 'advanced', label: '応用', icon: <BrainCircuit size={18} /> },
        { id: 'geometry', label: '図形', icon: <Shapes size={18} /> },
    ];

    const filteredProblems = PROBLEMS.filter(p => p.category === activeCategory);

    return (
        <div className="w-80 h-full flex flex-col">
            {/* Category Tabs */}
            <div className="flex border-b border-slate-300 flex-none bg-white rounded-t-lg overflow-hidden">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex-1 flex flex-col items-center justify-center p-2 text-xs font-bold transition-colors ${activeCategory === cat.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                    >
                        <div className="mb-1">{cat.icon}</div>
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Problem List */}
            <div className="p-3 space-y-2 bg-white flex-1 overflow-y-auto min-h-[300px] max-h-[500px]">
                {filteredProblems.map(problem => (
                    <div
                        key={problem.id}
                        onClick={() => onSelectProblem(problem)}
                        onDoubleClick={() => onDoubleClickProblem && onDoubleClickProblem(problem)}
                        className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:border-blue-400 hover:shadow-md hover:bg-blue-50 transition-all group"
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-slate-700 text-sm border-b border-slate-300 pb-0.5">{problem.title}</span>
                            {problem.category === 'advanced' && (
                                <span className="text-[10px] bg-purple-100 text-purple-700 px-1 rounded">応用</span>
                            )}
                            {problem.category === 'geometry' && (
                                <span className="text-[10px] bg-teal-100 text-teal-700 px-1 rounded">図形</span>
                            )}
                        </div>
                        <p className="text-sm text-slate-800 leading-relaxed font-medium mt-1">
                            {problem.text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProblemSelector;
