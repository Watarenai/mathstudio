import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, ArrowDown, Trash2 } from 'lucide-react';
import MathInputVibe from './MathInputVibe';

interface SubstitutionStep {
    id: string;
    expression: string;
    memo: string;
}

interface SubstitutionBlocksProps {
    initialExpression?: string;
}

const SubstitutionBlocks: React.FC<SubstitutionBlocksProps> = ({
    initialExpression = '',
}) => {
    const [steps, setSteps] = useState<SubstitutionStep[]>(
        initialExpression
            ? [{ id: `step-0`, expression: initialExpression, memo: '問題の式' }]
            : []
    );

    const addStep = () => {
        const newStep: SubstitutionStep = {
            id: `step-${Date.now()}`,
            expression: '',
            memo: '',
        };
        setSteps([...steps, newStep]);
    };

    const updateStep = (id: string, field: 'expression' | 'memo', value: string) => {
        setSteps(steps.map(step =>
            step.id === id ? { ...step, [field]: value } : step
        ));
    };

    const removeStep = (id: string) => {
        if (steps.length > 1) {
            setSteps(steps.filter(step => step.id !== id));
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const stepVariants = {
        hidden: { opacity: 0, y: -20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: 'spring' as const,
                stiffness: 300,
                damping: 25,
            },
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            y: -10,
            transition: { duration: 0.2 },
        },
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-vibe-text flex items-center gap-2">
                    <span className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-white">
                        <ArrowDown size={18} />
                    </span>
                    計算ステップ
                </h3>
                <span className="text-sm text-vibe-muted bg-slate-100 px-3 py-1 rounded-full">
                    {steps.length} ステップ
                </span>
            </div>

            {/* Steps Container */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
            >
                <AnimatePresence mode="popLayout">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            variants={stepVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            layout
                            className="substitution-block relative group"
                        >
                            {/* Step Number */}
                            <div className="absolute -left-4 top-6 w-8 h-8 bg-gradient-to-br from-vibe-primary to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                {index + 1}
                            </div>

                            {/* Delete Button */}
                            {steps.length > 1 && (
                                <button
                                    onClick={() => removeStep(step.id)}
                                    className="absolute -right-3 -top-3 w-7 h-7 bg-red-100 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}

                            {/* Math Expression Input */}
                            <div className="ml-6">
                                <MathInputVibe
                                    value={step.expression}
                                    onChange={(val) => updateStep(step.id, 'expression', val)}
                                    size="large"
                                    placeholder="式を入力..."
                                />
                            </div>

                            {/* Memo Field */}
                            <div className="ml-6 mt-3">
                                <div className="flex items-start gap-2 bg-vibe-orange/50 rounded-xl p-3 border border-orange-100">
                                    <MessageSquare size={16} className="text-orange-400 mt-0.5 flex-shrink-0" />
                                    <input
                                        type="text"
                                        value={step.memo}
                                        onChange={(e) => updateStep(step.id, 'memo', e.target.value)}
                                        placeholder="何をしたか書こう（例：両辺から5を引く）"
                                        className="flex-1 bg-transparent text-sm text-vibe-text placeholder:text-orange-300 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Arrow to next step */}
                            {index < steps.length - 1 && (
                                <div className="flex justify-center mt-4">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-slate-300"
                                    >
                                        <ArrowDown size={24} />
                                    </motion.div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Add Step Button */}
            <motion.button
                onClick={addStep}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 py-4 rounded-2xl border-2 border-dashed border-slate-200 text-vibe-muted hover:border-vibe-primary hover:text-vibe-primary hover:bg-vibe-sky/30 transition-all flex items-center justify-center gap-2 font-medium"
            >
                <Plus size={20} />
                <span>次のステップを追加</span>
            </motion.button>
        </div>
    );
};

export default SubstitutionBlocks;
