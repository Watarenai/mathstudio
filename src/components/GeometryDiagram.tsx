import React from 'react';

interface DiagramProps {
    problemId: string;
    problemText: string;
}

// メインのダイアグラムディスパッチャー
const GeometryDiagram: React.FC<DiagramProps> = ({ problemId, problemText }) => {
    // 問題IDとテキストから適切な図を選択
    if (problemId.startsWith('sector-gen') || problemText.includes('おうぎ形')) {
        return <SectorDiagram text={problemText} />;
    }
    if (problemText.includes('∠') && problemText.includes('直線')) {
        return <SupplementaryAngleDiagram text={problemText} />;
    }
    if (problemText.includes('三角形') && problemText.includes('内角')) {
        return <TriangleAngleDiagram text={problemText} />;
    }
    if (problemText.includes('正五角形')) {
        return <PentagonDiagram />;
    }
    if (problemText.includes('三角形') && problemText.includes('面積')) {
        return <TriangleAreaDiagram text={problemText} />;
    }
    if (problemText.includes('台形')) {
        return <TrapezoidDiagram text={problemText} />;
    }
    if (problemText.includes('円') && problemText.includes('半径')) {
        return <CircleDiagram text={problemText} />;
    }
    if (problemText.includes('平行移動')) {
        return <TranslationDiagram text={problemText} />;
    }
    if (problemText.includes('対称移動') || problemText.includes('回転')) {
        return <TransformDiagram text={problemText} />;
    }
    return null;
};

// ============================================
// 直線上の角度（補角）
// ============================================
const SupplementaryAngleDiagram: React.FC<{ text: string }> = ({ text }) => {
    const match = text.match(/(\d+)°/);
    const angle = match ? parseInt(match[1]) : 70;

    return (
        <svg viewBox="0 0 280 140" className="w-full max-w-[280px] mx-auto">
            {/* 直線 */}
            <line x1="20" y1="100" x2="260" y2="100" stroke="#334155" strokeWidth="2.5" />
            {/* 斜め線 */}
            <line x1="140" y1="100" x2="200" y2="30" stroke="#3b82f6" strokeWidth="2.5" />
            {/* 角度の弧 */}
            <path d="M 170 100 A 30 30 0 0 0 155 72" fill="none" stroke="#3b82f6" strokeWidth="2" />
            <path d="M 110 100 A 30 30 0 0 0 155 72" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" />
            {/* ラベル */}
            <text x="175" y="88" className="text-xs font-bold" fill="#3b82f6">{angle}°</text>
            <text x="108" y="88" className="text-xs font-bold" fill="#f59e0b">?</text>
            {/* 点 */}
            <circle cx="140" cy="100" r="4" fill="#334155" />
            <text x="136" y="118" className="text-[10px] font-bold" fill="#334155">O</text>
            <text x="248" y="118" className="text-[10px] font-bold" fill="#334155">B</text>
            <text x="200" y="26" className="text-[10px] font-bold" fill="#3b82f6">A</text>
            <text x="12" y="118" className="text-[10px] font-bold" fill="#334155">C</text>
        </svg>
    );
};

// ============================================
// 三角形の内角
// ============================================
const TriangleAngleDiagram: React.FC<{ text: string }> = ({ text }) => {
    const angles = text.match(/(\d+)°/g)?.map(a => parseInt(a)) || [65, 65];

    return (
        <svg viewBox="0 0 260 180" className="w-full max-w-[260px] mx-auto">
            {/* 三角形 */}
            <polygon points="130,20 40,155 220,155" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" />
            {/* 角度の弧 */}
            <path d="M 60 155 A 20 20 0 0 0 50 140" fill="none" stroke="#3b82f6" strokeWidth="2" />
            <path d="M 200 155 A 20 20 0 0 1 210 140" fill="none" stroke="#3b82f6" strokeWidth="2" />
            <path d="M 125 45 A 15 15 0 0 1 135 45" fill="none" stroke="#f59e0b" strokeWidth="2" />
            {/* ラベル */}
            <text x="52" y="145" className="text-xs font-bold" fill="#3b82f6">{angles[0]}°</text>
            <text x="190" y="145" className="text-xs font-bold" fill="#3b82f6">{angles.length > 1 ? `${angles[1]}°` : ''}</text>
            <text x="122" y="56" className="text-xs font-bold" fill="#f59e0b">?</text>
            {/* 頂点ラベル */}
            <text x="126" y="16" className="text-[10px] font-bold" fill="#334155">A</text>
            <text x="27" y="168" className="text-[10px] font-bold" fill="#334155">B</text>
            <text x="222" y="168" className="text-[10px] font-bold" fill="#334155">C</text>
        </svg>
    );
};

// ============================================
// 正五角形
// ============================================
const PentagonDiagram: React.FC = () => {
    const cx = 130, cy = 90, r = 65;
    const points = Array.from({ length: 5 }, (_, i) => {
        const angle = (i * 72 - 90) * Math.PI / 180;
        return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(' ');

    return (
        <svg viewBox="0 0 260 180" className="w-full max-w-[260px] mx-auto">
            <polygon points={points} fill="#fef3c7" stroke="#f59e0b" strokeWidth="2.5" strokeLinejoin="round" />
            {/* 角度マーク */}
            <text x="122" y="32" className="text-[10px] font-bold" fill="#f59e0b">?</text>
            <text x="105" y="170" className="text-xs font-bold" fill="#64748b">正五角形</text>
        </svg>
    );
};

// ============================================
// 三角形の面積
// ============================================
const TriangleAreaDiagram: React.FC<{ text: string }> = ({ text }) => {
    const nums = text.match(/(\d+)cm/g)?.map(n => parseInt(n)) || [6, 8];
    const base = nums[0] || 6;
    const height = nums[1] || 8;

    return (
        <svg viewBox="0 0 260 180" className="w-full max-w-[260px] mx-auto">
            <polygon points="50,150 210,150 130,30" fill="#ecfdf5" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" />
            {/* 高さの点線 */}
            <line x1="130" y1="30" x2="130" y2="150" stroke="#10b981" strokeWidth="1.5" strokeDasharray="5 3" />
            {/* 直角マーク */}
            <rect x="130" y="138" width="12" height="12" fill="none" stroke="#10b981" strokeWidth="1.5" />
            {/* 寸法 */}
            <text x="115" y="168" className="text-xs font-bold" fill="#10b981">{base}cm</text>
            <text x="134" y="95" className="text-xs font-bold" fill="#10b981">{height}cm</text>
        </svg>
    );
};

// ============================================
// 台形
// ============================================
const TrapezoidDiagram: React.FC<{ text: string }> = ({ text }) => {
    const nums = text.match(/(\d+)cm/g)?.map(n => parseInt(n)) || [4, 8, 5];

    return (
        <svg viewBox="0 0 280 180" className="w-full max-w-[280px] mx-auto">
            <polygon points="90,40 190,40 240,150 40,150" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2.5" strokeLinejoin="round" />
            {/* 高さ */}
            <line x1="140" y1="40" x2="140" y2="150" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 3" />
            <rect x="140" y="138" width="10" height="10" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
            {/* 寸法 */}
            <text x="125" y="34" className="text-xs font-bold" fill="#f59e0b">{nums[0] || 4}cm</text>
            <text x="115" y="168" className="text-xs font-bold" fill="#f59e0b">{nums[1] || 8}cm</text>
            <text x="144" y="100" className="text-xs font-bold" fill="#f59e0b">{nums[2] || 5}cm</text>
        </svg>
    );
};

// ============================================
// 円
// ============================================
const CircleDiagram: React.FC<{ text: string }> = ({ text }) => {
    const match = text.match(/半径.*?(\d+)/);
    const r = match ? parseInt(match[1]) : 7;

    return (
        <svg viewBox="0 0 240 180" className="w-full max-w-[240px] mx-auto">
            <circle cx="120" cy="90" r="70" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2.5" />
            <circle cx="120" cy="90" r="3" fill="#334155" />
            <line x1="120" y1="90" x2="190" y2="90" stroke="#3b82f6" strokeWidth="2" />
            <text x="140" y="84" className="text-xs font-bold" fill="#3b82f6">{r}cm</text>
            <text x="116" y="104" className="text-[10px] font-bold" fill="#334155">O</text>
        </svg>
    );
};

// ============================================
// おうぎ形
// ============================================
const SectorDiagram: React.FC<{ text: string }> = ({ text }) => {
    const rMatch = text.match(/半径.*?(\d+)/);
    const aMatch = text.match(/中心角.*?(\d+)/);
    const radius = rMatch ? parseInt(rMatch[1]) : 6;
    const angle = aMatch ? parseInt(aMatch[1]) : 90;

    const svgR = 70;
    const cx = 120, cy = 100;
    const startAngle = -angle / 2;
    const endAngle = angle / 2;
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    const x1 = cx + svgR * Math.cos(startRad);
    const y1 = cy + svgR * Math.sin(startRad);
    const x2 = cx + svgR * Math.cos(endRad);
    const y2 = cy + svgR * Math.sin(endRad);
    const largeArc = angle > 180 ? 1 : 0;

    return (
        <svg viewBox="0 0 240 180" className="w-full max-w-[240px] mx-auto">
            <path
                d={`M ${cx} ${cy} L ${x1} ${y1} A ${svgR} ${svgR} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill="#fef3c7" stroke="#f59e0b" strokeWidth="2.5" strokeLinejoin="round"
            />
            {/* 角度弧 */}
            <path
                d={`M ${cx + 20 * Math.cos(startRad)} ${cy + 20 * Math.sin(startRad)} A 20 20 0 ${largeArc} 1 ${cx + 20 * Math.cos(endRad)} ${cy + 20 * Math.sin(endRad)}`}
                fill="none" stroke="#f59e0b" strokeWidth="1.5"
            />
            <text x={cx - 4} y={cy - 25} className="text-[10px] font-bold" fill="#f59e0b">{angle}°</text>
            <text x={cx + 10} y={cy + 15} className="text-xs font-bold" fill="#f59e0b">{radius}cm</text>
            <circle cx={cx} cy={cy} r="3" fill="#334155" />
            <text x={cx - 5} y={cy + 28} className="text-[10px] font-bold" fill="#334155">O</text>
        </svg>
    );
};

// ============================================
// 平行移動（座標グリッド）
// ============================================
const TranslationDiagram: React.FC<{ text: string }> = ({ text }) => {
    const coordMatch = text.match(/\((\-?\d+),\s*(\-?\d+)\)/);
    const x = coordMatch ? parseInt(coordMatch[1]) : 2;
    const y = coordMatch ? parseInt(coordMatch[2]) : 3;

    const dxMatch = text.match(/右に(\d+)/);
    const dyMatch = text.match(/上に(\d+)/);
    const dlMatch = text.match(/左に(\d+)/);
    const ddMatch = text.match(/下に(\d+)/);
    const dx = dxMatch ? parseInt(dxMatch[1]) : dlMatch ? -parseInt(dlMatch[1]) : 0;
    const dy = dyMatch ? -parseInt(dyMatch[1]) : ddMatch ? parseInt(ddMatch[1]) : 0;

    const ox = 40, oy = 140, scale = 18;

    return (
        <svg viewBox="0 0 260 180" className="w-full max-w-[260px] mx-auto">
            {/* グリッド */}
            {Array.from({ length: 12 }, (_, i) => (
                <line key={`v${i}`} x1={ox + i * scale} y1="10" x2={ox + i * scale} y2="170" stroke="#e2e8f0" strokeWidth="0.5" />
            ))}
            {Array.from({ length: 9 }, (_, i) => (
                <line key={`h${i}`} x1="20" y1={oy - i * scale + scale} x2="260" y2={oy - i * scale + scale} stroke="#e2e8f0" strokeWidth="0.5" />
            ))}
            {/* 軸 */}
            <line x1={ox} y1="10" x2={ox} y2="170" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="20" y1={oy} x2="260" y2={oy} stroke="#94a3b8" strokeWidth="1.5" />
            {/* 元の点 */}
            <circle cx={ox + x * scale} cy={oy - y * scale} r="5" fill="#3b82f6" />
            <text x={ox + x * scale + 8} y={oy - y * scale - 5} className="text-[10px] font-bold" fill="#3b82f6">
                ({x},{y})
            </text>
            {/* 移動先 */}
            <circle cx={ox + (x + dx) * scale} cy={oy - (y - dy) * scale} r="5" fill="#f59e0b" />
            <text x={ox + (x + dx) * scale + 8} y={oy - (y - dy) * scale - 5} className="text-[10px] font-bold" fill="#f59e0b">?</text>
            {/* 矢印 */}
            <line
                x1={ox + x * scale} y1={oy - y * scale}
                x2={ox + (x + dx) * scale} y2={oy - (y - dy) * scale}
                stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3"
                markerEnd="url(#arrow)"
            />
            <defs>
                <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <path d="M0,0 L8,3 L0,6" fill="#f59e0b" />
                </marker>
            </defs>
        </svg>
    );
};

// ============================================
// 対称移動・回転（座標グリッド）
// ============================================
const TransformDiagram: React.FC<{ text: string }> = ({ text }) => {
    const coordMatch = text.match(/\((\-?\d+),\s*(\-?\d+)\)/);
    const x = coordMatch ? parseInt(coordMatch[1]) : 3;
    const y = coordMatch ? parseInt(coordMatch[2]) : 4;

    const ox = 120, oy = 100, scale = 14;

    // 変換先を計算
    let tx = x, ty = y;
    if (text.includes('x軸')) { tx = x; ty = -y; }
    else if (text.includes('y軸')) { tx = -x; ty = y; }
    else if (text.includes('y = x')) { tx = y; ty = x; }
    else if (text.includes('180°')) { tx = -x; ty = -y; }
    else if (text.includes('90°')) { tx = -y; ty = x; }

    return (
        <svg viewBox="0 0 260 200" className="w-full max-w-[260px] mx-auto">
            {/* グリッド */}
            {Array.from({ length: 19 }, (_, i) => (
                <line key={`v${i}`} x1={10 + i * scale} y1="2" x2={10 + i * scale} y2="198" stroke="#e2e8f0" strokeWidth="0.5" />
            ))}
            {Array.from({ length: 15 }, (_, i) => (
                <line key={`h${i}`} x1="2" y1={2 + i * scale} x2="258" y2={2 + i * scale} stroke="#e2e8f0" strokeWidth="0.5" />
            ))}
            {/* 軸 */}
            <line x1={ox} y1="2" x2={ox} y2="198" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="2" y1={oy} x2="258" y2={oy} stroke="#94a3b8" strokeWidth="1.5" />
            <text x={ox + 4} y="12" className="text-[9px]" fill="#94a3b8">y</text>
            <text x="248" y={oy - 4} className="text-[9px]" fill="#94a3b8">x</text>
            {/* 対称軸 */}
            {text.includes('y = x') && (
                <line x1="30" y1="170" x2="210" y2="-10" stroke="#a855f7" strokeWidth="1" strokeDasharray="5 3" />
            )}
            {/* 元の点 */}
            <circle cx={ox + x * scale} cy={oy - y * scale} r="5" fill="#3b82f6" />
            <text x={ox + x * scale + 8} y={oy - y * scale - 5} className="text-[10px] font-bold" fill="#3b82f6">
                ({x},{y})
            </text>
            {/* 移動先 */}
            <circle cx={ox + tx * scale} cy={oy - ty * scale} r="5" fill="#f59e0b" strokeWidth="2" stroke="#f59e0b" fillOpacity="0.3" />
            <text x={ox + tx * scale + 8} y={oy - ty * scale - 5} className="text-[10px] font-bold" fill="#f59e0b">?</text>
            {/* 接続点線 */}
            <line
                x1={ox + x * scale} y1={oy - y * scale}
                x2={ox + tx * scale} y2={oy - ty * scale}
                stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3"
            />
            {/* 原点 */}
            <circle cx={ox} cy={oy} r="2.5" fill="#334155" />
            <text x={ox + 5} y={oy + 12} className="text-[9px] font-bold" fill="#334155">O</text>
        </svg>
    );
};

export default GeometryDiagram;
