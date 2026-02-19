import React, { useMemo, useState, useEffect } from 'react'
import { X, TrendingUp, AlertCircle, Users, Plus, UserCircle } from 'lucide-react'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, CartesianGrid,
} from 'recharts'
import { useAuthStore } from '../stores/useAuthStore'
import { supabase } from '../lib/supabase'

interface ParentDashboardProps {
    onClose: () => void
}

/** 簡易的な型定義 */
interface GameResult {
    id: string;
    score: number;
    created_at: string;
    genre: string;
}

interface WrongLog {
    id: string;
    problem_text: string;
    user_answer: string;
    correct_answer: string;
    genre: string;
    created_at: string;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ onClose }) => {
    const { children, fetchChildren, createChildAccount } = useAuthStore()
    const [selectedChildId, setSelectedChildId] = useState<string | null>(null)
    const [gameResults, setGameResults] = useState<GameResult[]>([])
    const [wrongLogs, setWrongLogs] = useState<WrongLog[]>([])
    const [loading, setLoading] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [newChildName, setNewChildName] = useState('')

    // 初回ロード時に子供リストを取得
    useEffect(() => {
        fetchChildren().then(() => {
            // デフォルトで最初の子を選択
            const currentChildren = useAuthStore.getState().children;
            if (currentChildren.length > 0 && !selectedChildId) {
                setSelectedChildId(currentChildren[0].id)
            }
        });
    }, [])

    // 子供が選択されたらデータを取得
    useEffect(() => {
        if (!selectedChildId || !supabase) return;

        const fetchData = async () => {
            if (!supabase) return; // TS Guard
            setLoading(true)
            try {
                // ゲーム結果（スコア）
                const { data: results } = await supabase
                    .from('game_results')
                    .select('*')
                    .eq('user_id', selectedChildId)
                    .order('created_at', { ascending: true })
                    .limit(100);

                // 間違いログ
                const { data: wrongs } = await supabase
                    .from('wrong_answer_logs')
                    .select('*')
                    .eq('user_id', selectedChildId)
                    .order('created_at', { ascending: false })
                    .limit(20);

                setGameResults(results || []);
                setWrongLogs(wrongs || []);
            } catch (error) {
                console.error('Data fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedChildId])

    const [createdUser, setCreatedUser] = useState<{ email: string, password: string } | null>(null)

    const handleCreateChild = async () => {
        if (!newChildName) return;
        const result = await createChildAccount(newChildName, 'ignored', 'middle1');
        if (result && result.credentials) {
            setCreatedUser(result.credentials);
            setNewChildName('');
            // リスト更新後に選択
            const currentChildren = useAuthStore.getState().children;
            if (currentChildren.length > 0) setSelectedChildId(currentChildren[currentChildren.length - 1].id);
        }
    }

    // 集計ロジック
    const totalScore = useMemo(() => gameResults.reduce((acc, r) => acc + r.score, 0), [gameResults])
    const totalProblems = gameResults.length

    // 得点推移（直近20件）
    const scoreTrend = useMemo(() =>
        gameResults.slice(-20).map((r, i) => ({
            label: `${i + 1}`,
            points: r.score,
        })), [gameResults]
    )

    // ジャンル別ミス集計
    const genreErrors = useMemo(() => {
        const counts: Record<string, number> = {}
        wrongLogs.forEach(w => {
            counts[w.genre] = (counts[w.genre] || 0) + 1
        })
        return Object.entries(counts)
            .map(([genre, count]) => ({ genre, count }))
            .sort((a, b) => b.count - a.count)
    }, [wrongLogs])

    return (
        <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row"
                onClick={e => e.stopPropagation()}
            >
                {/* サイドバー（子供リスト） */}
                <div className="w-full md:w-64 bg-slate-50 p-6 border-r border-slate-100 flex-shrink-0">
                    <h2 className="text-lg font-black text-slate-700 mb-6 flex items-center gap-2">
                        <Users size={20} />
                        ファミリー
                    </h2>

                    <div className="space-y-2 mb-6">
                        {children.map((child: any) => (
                            <button
                                key={child.id}
                                onClick={() => setSelectedChildId(child.id)}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${selectedChildId === child.id
                                    ? 'bg-white shadow-md text-blue-600 ring-2 ring-blue-100 font-bold'
                                    : 'text-slate-500 hover:bg-white hover:shadow-sm'
                                    }`}
                            >
                                <UserCircle size={20} />
                                <span className="truncate">{child.display_name || '名称未設定'}</span>
                            </button>
                        ))}
                    </div>

                    {createdUser ? (
                        <div className="bg-emerald-50 p-4 rounded-xl shadow-sm border border-emerald-100 mb-4 animate-in fade-in slide-in-from-top-2">
                            <h3 className="text-sm font-bold text-emerald-800 mb-2">お子様のアカウントを作成しました！</h3>
                            <p className="text-xs text-emerald-600 mb-3">以下の情報を必ず控えてください。</p>
                            <div className="bg-white p-3 rounded-lg border border-emerald-200 space-y-2 text-sm">
                                <div>
                                    <span className="text-xs text-slate-400 block">ID (メールアドレス)</span>
                                    <code className="font-mono font-bold text-slate-700 select-all">{createdUser.email}</code>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-400 block">パスワード</span>
                                    <code className="font-mono font-bold text-slate-700 select-all">{createdUser.password}</code>
                                </div>
                            </div>
                            <button
                                onClick={() => { setCreatedUser(null); setIsCreating(false); }}
                                className="w-full mt-3 bg-emerald-600 text-white text-xs py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors"
                            >
                                確認しました（閉じる）
                            </button>
                        </div>
                    ) : isCreating ? (
                        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
                            <input
                                autoFocus
                                type="text"
                                placeholder="名前を入力"
                                className="w-full text-sm p-2 border border-slate-200 rounded-lg mb-2"
                                value={newChildName}
                                onChange={e => setNewChildName(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCreateChild}
                                    disabled={!newChildName}
                                    className="flex-1 bg-blue-500 text-white text-xs py-1.5 rounded-lg font-bold disabled:opacity-50"
                                >
                                    追加
                                </button>
                                <button
                                    onClick={() => setIsCreating(false)}
                                    className="flex-1 bg-slate-100 text-slate-500 text-xs py-1.5 rounded-lg"
                                >
                                    キャンセル
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsCreating(true)}
                            className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-all flex items-center justify-center gap-2 text-sm font-bold"
                        >
                            <Plus size={16} />
                            お子様を追加
                        </button>
                    )}
                </div>

                {/* メインコンテンツ */}
                <div className="flex-1 min-w-0">
                    {/* ヘッダー */}
                    <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-slate-100 flex items-center justify-between px-6 py-4 z-10">
                        <h2 className="text-lg font-bold text-slate-700">
                            {children.find((c: any) => c.id === selectedChildId)?.display_name || 'お子様'}の学習記録
                        </h2>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-slate-400">読み込み中...</div>
                    ) : selectedChildId ? (
                        <div className="p-6 space-y-6">
                            {/* サマリーカード */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 rounded-2xl p-4 text-center">
                                    <p className="text-xs text-slate-400 mb-1">合計スコア</p>
                                    <p className="text-2xl font-black text-violet-600">{totalScore.toLocaleString()}</p>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-4 text-center">
                                    <p className="text-xs text-slate-400 mb-1">といた問題数</p>
                                    <p className="text-2xl font-black text-blue-600">{totalProblems}</p>
                                </div>
                            </div>

                            {/* 得点推移グラフ */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <TrendingUp size={16} className="text-violet-500" />
                                    <h3 className="font-bold text-slate-600 text-sm">学習ペース（直近の取り組み）</h3>
                                </div>
                                {scoreTrend.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={160}>
                                        <LineChart data={scoreTrend}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                            <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                                            <YAxis tick={{ fontSize: 10 }} />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="points" stroke="#7c3aed" strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-sm text-slate-400 text-center py-8">まだデータがありません</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 苦手ジャンル */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <AlertCircle size={16} className="text-rose-500" />
                                        <h3 className="font-bold text-slate-600 text-sm">苦手ジャンル</h3>
                                    </div>
                                    {genreErrors.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={160}>
                                            <BarChart data={genreErrors} layout="vertical">
                                                <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                                                <YAxis dataKey="genre" type="category" tick={{ fontSize: 11 }} width={80} />
                                                <Tooltip />
                                                <Bar dataKey="count" fill="#f43f5e" radius={[0, 4, 4, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <p className="text-sm text-slate-400 text-center py-8">データなし</p>
                                    )}
                                </div>

                                {/* 間違い履歴 */}
                                <div>
                                    <h3 className="font-bold text-slate-600 text-sm mb-3">最近の間違い</h3>
                                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                                        {wrongLogs.length > 0 ? wrongLogs.map(w => (
                                            <div key={w.id} className="p-3 bg-rose-50 rounded-xl text-sm">
                                                <p className="font-medium text-slate-700 mb-1">{w.problem_text}</p>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-rose-500">× {w.user_answer}</span>
                                                    <span className="text-emerald-600">○ {w.correct_answer}</span>
                                                </div>
                                            </div>
                                        )) : (
                                            <p className="text-sm text-slate-400 text-center py-8">間違いなし</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 p-12">
                            <Users size={48} className="mb-4 opacity-20" />
                            <p>左のメニューからお子様を選択するか、<br />新しく追加してください</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ParentDashboard
