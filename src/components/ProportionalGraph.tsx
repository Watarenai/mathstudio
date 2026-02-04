import React, { useMemo, useState } from 'react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, ReferenceArea, Scatter } from 'recharts';

interface Point {
    x: number;
    y: number;
}

interface ProportionalGraphProps {
    points: Point[]; // User plotted points
    slope: number; // 'a' value. For proportional: slope. For inverse: constant a.
    graphMode?: 'proportional' | 'inverse' | 'area';
}

const ProportionalGraph: React.FC<ProportionalGraphProps> = ({ points, slope, graphMode = 'proportional' }) => {
    const [areaPoint, setAreaPoint] = useState<Point | null>(null);

    // Generate data for the line/curve
    const chartData = useMemo(() => {
        const data = [];
        // Range from -10 to 10. Avoid 0 for inverse.
        const step = 0.5;
        for (let x = -10; x <= 10; x += step) {
            // Avoid division by zero close to 0
            if (graphMode === 'inverse' || graphMode === 'area') {
                if (Math.abs(x) < 0.2) continue;
                const y = slope / x;
                // Clamp y for visualization if needed, but Recharts handles domain
                if (Math.abs(y) <= 20) {
                    data.push({ x, y });
                }
            } else {
                // Proportional
                data.push({ x, y: slope * x });
            }
        }
        return data;
    }, [slope, graphMode]);

    // Handle click to set area point
    const handleClick = (e: any) => {
        if (!e || !e.activeLabel) return; // activeLabel is usually x value
        // Note: Recharts click event structure depends on chart type.
        // For line chart with numerical axis, e.activeLabel might be the X value snapped to data.
        // But we want free clicking? ComposedChart with numerical X axis clicks are tricky.
        // Alternative: Use the existing data point closest to click?
        // Let's assume snapping to the closest gathered data point for now which is easiest.

        if (graphMode === 'area' && e.activePayload && e.activePayload[0]) {
            const x = e.activePayload[0].payload.x;
            const y = e.activePayload[0].payload.y;
            setAreaPoint({ x, y });
        }
    };

    return (
        <div className="w-full h-80 bg-white rounded-xl shadow-md border-2 border-slate-200 p-2 relative">
            <h4 className="text-center font-bold text-slate-500 mb-2">
                {graphMode === 'proportional' ? `比例 y = ${slope}x` : `反比例 y = ${slope}/x`}
            </h4>

            {/* Area Value Label Overlay */}
            {areaPoint && (
                <div className="absolute top-10 right-4 bg-yellow-100 border border-yellow-300 p-2 rounded shadow-sm z-10 animate-bounce-in">
                    <span className="text-xs text-slate-500 block">面積 (Area)</span>
                    <span className="text-xl font-bold text-slate-800">
                        {Math.abs(areaPoint.x * areaPoint.y).toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">
                        (|x × y|)
                    </span>
                </div>
            )}

            <ResponsiveContainer width="100%" height="85%">
                <ComposedChart
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    onClick={handleClick}
                    data={chartData}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="x"
                        type="number"
                        domain={[-10, 10]}
                        allowDataOverflow={true}
                        tickCount={11}
                    />
                    <YAxis
                        type="number"
                        domain={[-20, 20]}
                        allowDataOverflow={true}
                    />
                    <ReferenceLine x={0} stroke="black" />
                    <ReferenceLine y={0} stroke="black" />

                    {/* Area Rectangle */}
                    {areaPoint && (
                        <ReferenceArea
                            x1={0} x2={areaPoint.x}
                            y1={0} y2={areaPoint.y}
                            fill="#3b82f6"
                            fillOpacity={0.2}
                            stroke="#2563EB"
                            strokeOpacity={0.5}
                        />
                    )}

                    {/* The Function Line/Spline */}
                    <Line
                        data={chartData} // Explicitly pass data here too just in case
                        type="monotone" // 'monotone' smooths it. For hyperbola discontinuous at 0, we might need 'linear' or separating data.
                        dataKey="y"
                        stroke="#2563EB"
                        strokeWidth={3}
                        dot={graphMode === 'area'} // Show dots in area mode to make snapping easier?
                        activeDot={{ r: 6 }}
                        isAnimationActive={false}
                        connectNulls={false} // Don't connect across 0 for hyperbola
                    />

                    {/* User Points */}
                    <Scatter data={points} fill="red" />

                </ComposedChart>
            </ResponsiveContainer>

            {graphMode === 'area' && !areaPoint && (
                <p className="text-center text-xs text-blue-500 animate-pulse mt-[-20px] pointer-events-none">
                    グラフ上の点をクリックして面積を表示
                </p>
            )}
        </div>
    );
};

export default ProportionalGraph;
