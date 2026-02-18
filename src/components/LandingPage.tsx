import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Pencil, BarChart3, Brain, Shapes, ArrowRight, CheckCircle, Users, Star, Zap } from 'lucide-react';

interface LandingPageProps {
    onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {

    const features = [
        {
            icon: Pencil,
            title: '手書き解答スペース',
            desc: 'デジタルキャンバスに自由に書き込める。書字が苦手でもOK。',
            color: 'text-blue-500',
            bg: 'bg-blue-50',
        },
        {
            icon: BarChart3,
            title: 'インタラクティブグラフ',
            desc: '比例・反比例をグラフで可視化。面積も一目でわかる。',
            color: 'text-emerald-500',
            bg: 'bg-emerald-50',
        },
        {
            icon: Brain,
            title: 'ヒントシステム',
            desc: '段階的ヒントで「考える力」を育てる。答えは教えない。',
            color: 'text-purple-500',
            bg: 'bg-purple-50',
        },
        {
            icon: Shapes,
            title: '図形問題対応',
            desc: '平行移動・回転移動・対称・角度の問題を豊富に収録。',
            color: 'text-orange-500',
            bg: 'bg-orange-50',
        },
    ];

    const stats = [
        { value: '100+', label: '収録問題数' },
        { value: '4段階', label: '難易度設定' },
        { value: '即時', label: '解答チェック' },
        { value: '無料', label: 'で始められる' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30 font-sans overflow-x-hidden">

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/40">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
                            M
                        </div>
                        <span className="text-xl font-bold text-slate-800 tracking-tight">MathStudio</span>
                    </div>
                    <button
                        onClick={onStart}
                        className="btn-vibe text-sm !px-5 !py-2.5"
                    >
                        無料で始める
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl" />
                    <div className="absolute top-40 right-10 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-64 bg-gradient-to-t from-blue-50/50 to-transparent" />
                </div>

                <div className="max-w-4xl mx-auto text-center relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 mb-8">
                            <Sparkles size={14} />
                            書字困難（ディスグラフィア）対応
                        </span>
                    </motion.div>

                    <motion.h1
                        className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        書けなくても、
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                            数学はできる。
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        MathStudioは、書字が苦手な中学生のための<br className="hidden md:inline" />
                        インタラクティブ数学学習アプリ。
                        <br className="hidden md:inline" />
                        手書き・入力・グラフ可視化の3つのモードで、
                        <br className="hidden md:inline" />
                        <strong className="text-slate-700">「わかった！」</strong>の瞬間を、もっと増やす。
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <button
                            onClick={onStart}
                            className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all text-lg"
                        >
                            今すぐ無料で体験
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </div>

                {/* App Preview Mock */}
                <motion.div
                    className="max-w-5xl mx-auto mt-16 relative"
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/10 border border-white/60">
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-1">
                            <div className="bg-white rounded-[20px] p-2">
                                {/* Fake app toolbar */}
                                <div className="bg-slate-50 rounded-2xl p-4">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-xs">M</div>
                                        <span className="font-bold text-slate-700 text-sm">MathStudio Vibe</span>
                                        <div className="flex-1" />
                                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">Easy</span>
                                    </div>
                                    {/* Fake problem card */}
                                    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm mb-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Zap size={14} className="text-orange-500" />
                                            <span className="text-xs font-bold text-slate-400">Q.12 | 比例</span>
                                        </div>
                                        <p className="text-slate-800 font-medium">y = ax で x=3, y=15 のとき、a の値を求めなさい。</p>
                                    </div>
                                    {/* Fake answer area */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-slate-100 rounded-xl px-4 py-3 text-slate-400 text-sm font-mono">a = 5</div>
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                                            <CheckCircle size={18} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Glow effect */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-blue-400/10 rounded-[40px] blur-2xl -z-10" />
                </motion.div>
            </section>

            {/* Stats Strip */}
            <section className="py-8 border-y border-slate-100 bg-white/60 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((s, i) => (
                        <motion.div
                            key={i}
                            className="text-center"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-3xl md:text-4xl font-extrabold text-slate-800">{s.value}</div>
                            <div className="text-sm text-slate-500 mt-1">{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                            学びを<span className="text-blue-500">楽しく</span>する機能
                        </h2>
                        <p className="text-slate-500 text-lg">
                            一人ひとりのペースに合わせた、やさしい数学体験
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                className="vibe-card p-6 hover:shadow-vibe-lg transition-all group cursor-default"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <f.icon size={24} className={f.color} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">{f.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Target Users Section */}
            <section className="py-24 px-6 bg-gradient-to-b from-blue-50/30 to-white">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                            こんな方に<span className="text-purple-500">おすすめ</span>
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: Users, label: '保護者の方', desc: '書字に困難を抱えるお子さまの家庭学習をサポート', color: 'blue' },
                            { icon: Star, label: '塾・教室', desc: '通級・放課後デイサービスでの合理的配慮に最適', color: 'emerald' },
                            { icon: Brain, label: '先生方', desc: '生徒の理解度に合わせた個別指導のツールとして', color: 'purple' },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                className="vibe-card p-6 text-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.15 }}
                                viewport={{ once: true }}
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-${item.color}-50 flex items-center justify-center mx-auto mb-4`}>
                                    <item.icon size={28} className={`text-${item.color}-500`} />
                                </div>
                                <h3 className="font-bold text-slate-800 text-lg mb-2">{item.label}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <motion.div
                    className="max-w-3xl mx-auto text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="vibe-card p-12 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                                今すぐ始めよう
                            </h2>
                            <p className="text-slate-500 text-lg mb-8">
                                登録不要・無料で、すぐに使い始められます。
                            </p>
                            <button
                                onClick={onStart}
                                className="group inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:-translate-y-1 transition-all text-lg"
                            >
                                学習を始める
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-slate-100">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <div className="w-6 h-6 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-xs">M</div>
                        <span className="font-bold text-slate-600 text-sm">MathStudio</span>
                    </div>
                    <p className="text-slate-400 text-sm">
                        © 2026 MathStudio. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
