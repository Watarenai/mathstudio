import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Save, X, Eye, Trash2, ChevronDown, Lightbulb, AlertCircle, CheckCircle } from 'lucide-react';
import { addProblem, NewProblemInput } from '../lib/problemService';

const GENRES = [
    { value: 'proportional', label: '比例' },
    { value: 'inverse', label: '反比例' },
    { value: 'equation', label: '方程式' },
    { value: 'geometry', label: '図形' },
    { value: 'sector', label: 'おうぎ形' },
];

const DIFFICULTIES = [
    { value: 'Easy', label: 'Easy', points: 100 },
    { value: 'Normal', label: 'Normal', points: 200 },
    { value: 'Hard', label: 'Hard', points: 300 },
    { value: 'Expert', label: 'Expert', points: 400 },
];

const EMPTY_FORM: NewProblemInput = {
    genre: 'proportional',
    difficulty: 'Easy',
    unit: '',
    points: 100,
    problemText: '',
    correctAnswer: '',
    answerVariants: [''],
    hints: [''],
    chips: [],
};

interface ProblemEditorProps {
    onClose: () => void;
}

const ProblemEditor: React.FC<ProblemEditorProps> = ({ onClose }) => {
    const [form, setForm] = useState<NewProblemInput>({ ...EMPTY_FORM });
    const [showPreview, setShowPreview] = useState(false);
    const [saving, setSaving] = useState(false);
    const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const updateField = <K extends keyof NewProblemInput>(key: K, value: NewProblemInput[K]) => {
        setForm(f => ({ ...f, [key]: value }));
        if (key === 'difficulty') {
            const d = DIFFICULTIES.find(d => d.value === value);
            if (d) setForm(f => ({ ...f, [key]: value, points: d.points }));
        }
    };

    const updateHint = (index: number, value: string) => {
        const next = [...form.hints];
        next[index] = value;
        setForm(f => ({ ...f, hints: next }));
    };

    const addHint = () => setForm(f => ({ ...f, hints: [...f.hints, ''] }));
    const removeHint = (i: number) => setForm(f => ({ ...f, hints: f.hints.filter((_, idx) => idx !== i) }));

    const updateVariant = (index: number, value: string) => {
        const next = [...form.answerVariants];
        next[index] = value;
        setForm(f => ({ ...f, answerVariants: next }));
    };

    const addVariant = () => setForm(f => ({ ...f, answerVariants: [...f.answerVariants, ''] }));
    const removeVariant = (i: number) => setForm(f => ({ ...f, answerVariants: f.answerVariants.filter((_, idx) => idx !== i) }));

    const handleSave = async () => {
        if (!form.problemText.trim() || !form.correctAnswer.trim()) {
            setResult({ type: 'error', message: '問題文と正解は必須です' });
            return;
        }

        setSaving(true);
        setResult(null);

        const clean: NewProblemInput = {
            ...form,
            answerVariants: form.answerVariants.filter(v => v.trim()),
            hints: form.hints.filter(h => h.trim()),
        };

        const res = await addProblem(clean);
        setSaving(false);

        if (res.success) {
            setResult({ type: 'success', message: '問題を登録しました！（承認後に出題されます）' });
            setForm({ ...EMPTY_FORM });
        } else {
            setResult({ type: 'error', message: res.error || '登録に失敗しました' });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white z-10 p-5 pb-3 border-b border-slate-100 flex items-center justify-between rounded-t-3xl">
                    <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <Plus size={20} className="text-sky-500" /> 問題を追加
                    </h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    {/* ジャンル & 難易度 */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">ジャンル</label>
                            <div className="relative">
                                <select
                                    value={form.genre}
                                    onChange={e => updateField('genre', e.target.value)}
                                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm font-bold text-slate-700 appearance-none pr-8"
                                >
                                    {GENRES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">難易度</label>
                            <div className="relative">
                                <select
                                    value={form.difficulty}
                                    onChange={e => updateField('difficulty', e.target.value)}
                                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm font-bold text-slate-700 appearance-none pr-8"
                                >
                                    {DIFFICULTIES.map(d => <option key={d.value} value={d.value}>{d.label} ({d.points}pt)</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* 単元名 */}
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">単元名</label>
                        <input
                            value={form.unit}
                            onChange={e => updateField('unit', e.target.value)}
                            placeholder="例: 比例のグラフ"
                            className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-700"
                        />
                    </div>

                    {/* 問題文 */}
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">問題文 *</label>
                        <textarea
                            value={form.problemText}
                            onChange={e => updateField('problemText', e.target.value)}
                            placeholder="y = 2x のとき、x = 5 ならば y はいくつですか。"
                            rows={3}
                            className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-700 resize-none"
                        />
                    </div>

                    {/* 正解 */}
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">正解 *</label>
                        <input
                            value={form.correctAnswer}
                            onChange={e => updateField('correctAnswer', e.target.value)}
                            placeholder="10"
                            className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm font-mono text-slate-700"
                        />
                    </div>

                    {/* 別解 */}
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                            許容する別の回答形式
                        </label>
                        {form.answerVariants.map((v, i) => (
                            <div key={i} className="flex gap-2 mb-2">
                                <input
                                    value={v}
                                    onChange={e => updateVariant(i, e.target.value)}
                                    placeholder="例: y=10"
                                    className="flex-1 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-sm font-mono text-slate-700"
                                />
                                {form.answerVariants.length > 1 && (
                                    <button onClick={() => removeVariant(i)} className="text-rose-300 hover:text-rose-500"><Trash2 size={14} /></button>
                                )}
                            </div>
                        ))}
                        <button onClick={addVariant} className="text-xs text-sky-500 font-bold hover:text-sky-600">+ 追加</button>
                    </div>

                    {/* ヒント */}
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block flex items-center gap-1">
                            <Lightbulb size={12} /> ヒント
                        </label>
                        {form.hints.map((h, i) => (
                            <div key={i} className="flex gap-2 mb-2">
                                <span className="text-xs text-slate-300 font-bold mt-3 w-4">{i + 1}</span>
                                <input
                                    value={h}
                                    onChange={e => updateHint(i, e.target.value)}
                                    placeholder={`ヒント ${i + 1}`}
                                    className="flex-1 p-2.5 bg-amber-50 rounded-lg border border-amber-100 text-sm text-slate-700"
                                />
                                {form.hints.length > 1 && (
                                    <button onClick={() => removeHint(i)} className="text-rose-300 hover:text-rose-500"><Trash2 size={14} /></button>
                                )}
                            </div>
                        ))}
                        <button onClick={addHint} className="text-xs text-amber-500 font-bold hover:text-amber-600">+ ヒント追加</button>
                    </div>

                    {/* プレビュー */}
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-500 flex items-center justify-center gap-2 hover:bg-slate-100"
                    >
                        <Eye size={16} /> {showPreview ? 'プレビューを閉じる' : 'プレビュー'}
                    </button>

                    <AnimatePresence>
                        {showPreview && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100">
                                    <p className="text-xs font-bold text-sky-400 mb-2">— プレビュー —</p>
                                    <p className="text-base font-bold text-slate-800 mb-2">{form.problemText || '（問題文未入力）'}</p>
                                    <p className="text-sm text-emerald-600 font-mono">正解: {form.correctAnswer || '—'}</p>
                                    {form.hints.filter(h => h).length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            {form.hints.filter(h => h).map((h, i) => (
                                                <p key={i} className="text-xs text-amber-600 flex gap-1"><Lightbulb size={12} /> {h}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Result */}
                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className={`p-3 rounded-xl text-sm font-bold flex items-center gap-2 ${result.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}
                            >
                                {result.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                {result.message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={saving || !form.problemText.trim() || !form.correctAnswer.trim()}
                        className="w-full p-4 bg-slate-800 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        <Save size={16} /> {saving ? '保存中...' : '問題を保存'}
                    </button>

                    <p className="text-[10px] text-center text-slate-300">
                        登録した問題は承認後に出題されます
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ProblemEditor;
