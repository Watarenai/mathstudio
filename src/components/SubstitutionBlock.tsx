import React, { useState } from 'react';
import { ArrowDown } from 'lucide-react';

interface SubstitutionBlockProps {
    onCalculate: (x: number, y: number) => void;
}

const SubstitutionBlock: React.FC<SubstitutionBlockProps> = ({ onCalculate }) => {
    const [coefficient, setCoefficient] = useState<string>('2');
    const [inputVal, setInputVal] = useState<string>('');
    const [steps, setSteps] = useState<{ x: number; y: number }[]>([]);

    const handleCalculate = () => {
        const x = parseFloat(inputVal);
        const a = parseFloat(coefficient);

        if (!isNaN(x) && !isNaN(a)) {
            const y = a * x;
            const newStep = { x, y };
            setSteps([newStep, ...steps]);
            onCalculate(x, y);
            setInputVal('');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border-2 border-slate-200 p-4 w-full max-w-md">
            <h3 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">代入お化け (Substitution)</h3>

            {/* Formula Configuration */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center mb-6 flex items-center justify-center gap-2">
                <span className="text-2xl font-mono font-bold text-blue-900">y = </span>
                <input
                    type="number"
                    value={coefficient}
                    onChange={(e) => setCoefficient(e.target.value)}
                    className="border-2 border-blue-300 rounded w-16 p-1 text-xl text-center font-bold text-blue-900 bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                    placeholder="a"
                />
                <span className="text-2xl font-mono font-bold text-blue-900">x</span>
            </div>

            {/* Input Area */}
            <div className="flex flex-col items-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-xl">
                    <span className="font-bold font-mono">x = </span>
                    <input
                        type="number"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        className="border-2 border-math-primary rounded-lg w-24 p-2 text-center font-bold text-xl focus:ring-4 focus:ring-blue-100 outline-none"
                        placeholder="?"
                        onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
                    />
                </div>

                <button
                    onClick={handleCalculate}
                    disabled={!inputVal || !coefficient}
                    className="w-full bg-math-primary text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <ArrowDown size={20} />
                    <span>計算する (Calculate)</span>
                </button>
            </div>

            {/* History */}
            {steps.length > 0 && (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">履歴</h4>
                    {steps.map((step, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3 animate-slide-in-top">
                            <div className="flex justify-between items-center text-lg">
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-500">x=</span>
                                    <span className="font-bold">{step.x}</span>
                                </div>
                                <div className="text-slate-300">→</div>
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-500">y=</span>
                                    <span className="font-bold text-math-secondary">{step.y}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubstitutionBlock;
