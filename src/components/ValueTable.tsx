import React, { useState } from 'react';

interface Point {
    x: number;
    y: number;
}

interface ValueTableProps {
    points: Point[];
    onUpdatePoint?: (index: number, field: 'x' | 'y', value: string) => void;
    onAddPoint?: (x: number, y: number) => void;
}

const ValueTable: React.FC<ValueTableProps> = ({ points, onUpdatePoint, onAddPoint }) => {
    const [newX, setNewX] = useState('');
    const [newY, setNewY] = useState('');

    const handleNewRowChange = (field: 'x' | 'y', val: string) => {
        if (field === 'x') setNewX(val);
        if (field === 'y') setNewY(val);

        // Auto-add when both fields are filled with valid numbers could be tricky if user is typing "12" and "1" triggers it.
        // Let's rely on Enter key or losing focus? Or just a simple button? 
        // For simplicity: Add explicit Add button or auto-add when both valid numbers.
        // Let's try auto-add logic carefully, OR just require user to fill both.
        // Actually, handling it via onBlur or Enter is better.
        // For this prototype, let's keep it simple: Just inputs.
    };

    // Helper to add point when Enter is pressed in new row
    const handleKeyDown = (e: React.KeyboardEvent, _field: 'x' | 'y') => {
        if (e.key === 'Enter') {
            const x = parseFloat(newX);
            const y = parseFloat(newY);
            if (!isNaN(x) && !isNaN(y) && onAddPoint) {
                onAddPoint(x, y);
                setNewX('');
                setNewY('');
            }
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-md border-2 border-slate-200 p-4">
            <h4 className="text-center font-bold text-slate-500 mb-2">値の表 (Table)</h4>
            <div className="grid grid-cols-2 border-2 border-slate-300 rounded-lg overflow-hidden">
                {/* Header */}
                <div className="bg-slate-100 p-2 text-center font-bold border-b-2 border-r-2 border-slate-300">x</div>
                <div className="bg-slate-100 p-2 text-center font-bold border-b-2 border-slate-300">y</div>

                {/* Existing Rows */}
                {points.map((p, i) => (
                    <React.Fragment key={i}>
                        <div className="p-0 border-b border-r border-slate-200 h-10">
                            <input
                                type="number"
                                value={!isNaN(p.x) ? p.x : ''}
                                onChange={(e) => onUpdatePoint && onUpdatePoint(i, 'x', e.target.value)}
                                className="w-full h-full text-center font-mono text-lg outline-none focus:bg-blue-50"
                            />
                        </div>
                        <div className="p-0 border-b border-slate-200 h-10">
                            <input
                                type="number"
                                value={!isNaN(p.y) ? p.y : ''}
                                onChange={(e) => onUpdatePoint && onUpdatePoint(i, 'y', e.target.value)}
                                className="w-full h-full text-center font-mono text-lg font-bold text-math-secondary outline-none focus:bg-blue-50"
                            />
                        </div>
                    </React.Fragment>
                ))}

                {/* New Entry Row */}
                <React.Fragment>
                    <div className="p-0 border-r border-slate-200 h-10">
                        <input
                            type="number"
                            value={newX}
                            onChange={(e) => handleNewRowChange('x', e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, 'x')}
                            placeholder="x"
                            className="w-full h-full text-center font-mono text-lg outline-none bg-slate-50 focus:bg-blue-50 placeholder:text-slate-300"
                        />
                    </div>
                    <div className="p-0 h-10">
                        <input
                            type="number"
                            value={newY}
                            onChange={(e) => handleNewRowChange('y', e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, 'y')}
                            placeholder="y"
                            className="w-full h-full text-center font-mono text-lg font-bold text-math-secondary outline-none bg-slate-50 focus:bg-blue-50 placeholder:text-slate-300"
                        />
                    </div>
                </React.Fragment>
            </div>
            <p className="text-xs text-center text-slate-400 mt-2">Enterキーで追加</p>
        </div>
    );
};

export default ValueTable;
