import React, { useMemo } from 'react'
import { X, TrendingUp, AlertCircle, Flame } from 'lucide-react'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, CartesianGrid,
} from 'recharts'
import { useGameStore, type WrongAnswerItem } from '../stores/useGameStore'

interface ParentDashboardProps {
    onClose: () => void
}

/** GeneratedProblem は meta.unit（日本語）、GeometryProblem は meta.genre を持つ */
function getGenreLabel(w: WrongAnswerItem): string {
    const meta = w.problem.meta as unknown as Record<string, unknown>
    if ('genre' in meta) return '図形・おうぎ形'
    return (meta.unit as string) ?? '不明'
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ onClose }) => {
    const { history, wrongAnswers, score, streak } = useGameStore()

    // 直近20問の得点推移
    const scoreTrend = useMemo(() =>
        history.slice(-20).map((h, i) => ({
            label: `${i + 1}問目`,
            points: h.points,
        })),
        [history]
    )

    // ジャンル別ミス数（直近30日のwrongAnswers）
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
    const recentWrong = wrongAnswers.filter((w: WrongAnswerItem) => w.timestamp > thirtyDaysAgo)

    const genreErrors = useMemo(() => {
        const counts: Record<string, number> = {}
        recentWrong.forEach((w: WrongAnswerItem) => {
            const label = getGenreLabel(w)
            counts[label] = (counts[label] ?? 0) + 1
        })
        return Object.entries(counts)
            .map(([genre, count]) => ({ genre, count }))
            .sort((a, b) => b.count - a.count)
    }, [recentWrong])

    // 直近5件の間違い
    const recentMistakes = wrongAnswers.slice(-5).reverse()

    return (
        <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* ヘッダー */}
                <div className="sticky top-0 bg-white border-b border-slate-100 flex items-center justify-between px-6 py-4 rounded-t-3xl z-10">
                    <h2 className="text-lg font-black text-slate-700">保護者ダッシュボード</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* サマリーカード */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: '合計スコア', value: score.toLocaleString(), unit: 'pt', color: 'text-violet-600' },
                            { label: '合計問題数', value: history.length, unit: '問', color: 'text-blue-600' },
                            { label: '連続正解', value: streak, unit: '問', color: 'text-emerald-600', icon: <Flame size={14} className="inline mb-0.5" /> },
                        ].map(card => (
                            <div key={card.label} className="bg-slate-50 rounded-2xl p-4 text-center">
                                <p className="text-xs text-slate-400 mb-1">{card.label}</p>
                                <p className={`text-2xl font-black ${card.color}`}>
                                    {card.icon}{card.value}
                                    <span className="text-sm font-medium text-slate-400 ml-0.5">{card.unit}</span>
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* 得点推移グラフ */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp size={16} className="text-violet-500" />
                            <h3 className="font-bold text-slate-600 text-sm">得点推移（直近20問）</h3>
                        </div>
                        {scoreTrend.length > 0 ? (
                            <ResponsiveContainer width="100%" height={160}>
                                <LineChart data={scoreTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                                    <YAxis tick={{ fontSize: 10 }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="points" stroke="#7c3aed" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-sm text-slate-400 text-center py-8">まだ学習データがありません</p>
                        )}
                    </div>

                    {/* ジャンル別ミス数 */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <AlertCircle size={16} className="text-rose-500" />
                            <h3 className="font-bold text-slate-600 text-sm">苦手ジャンル（直近30日）</h3>
                        </div>
                        {genreErrors.length > 0 ? (
                            <ResponsiveContainer width="100%" height={160}>
                                <BarChart data={genreErrors} layout="vertical">
                                    <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                                    <YAxis dataKey="genre" type="category" tick={{ fontSize: 11 }} width={80} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#f43f5e" radius={[0, 4, 4, 0]} name="ミス数" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-sm text-slate-400 text-center py-8">直近30日のミスデータがありません</p>
                        )}
                    </div>

                    {/* 直近の間違い問題 */}
                    <div>
                        <h3 className="font-bold text-slate-600 text-sm mb-3">最近の間違い問題</h3>
                        {recentMistakes.length > 0 ? (
                            <ul className="space-y-2">
                                {recentMistakes.map((w: WrongAnswerItem) => (
                                    <li key={w.id} className="flex items-start gap-3 p-3 bg-rose-50 rounded-xl">
                                        <span className="text-rose-400 mt-0.5 shrink-0">✗</span>
                                        <div className="min-w-0">
                                            <p className="text-sm text-slate-700 font-medium truncate">{w.problem.problem.text}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                あなたの答え: <span className="text-rose-500 font-bold">{w.userAnswer}</span>
                                                　正解: <span className="text-emerald-600 font-bold">{w.problem.problem.correct_answer}</span>
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-slate-400 text-center py-4">間違い問題がありません</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ParentDashboard
