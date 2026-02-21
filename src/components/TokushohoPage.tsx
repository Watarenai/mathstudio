import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useGameStore } from '../stores/useGameStore';

const TokushohoPage: React.FC = () => {
  const { setView } = useGameStore();

  const sections = [
    {
      title: '販売事業者名（会社名・屋号）',
      content: 'MathStudio'
    },
    {
      title: '代表者・運営統括責任者',
      content: '塚田航'
    },
    {
      title: '所在地',
      content: '〒222-0011\n神奈川県横浜市港北区菊名3-3-8さんクレスト菊名\n（※ご自身の住所。バーチャルオフィスの場合はその旨と実拠点情報を記載する場合があります）'
    },
    {
      title: '連絡先',
      content: '電話番号：070-3536-1964\n（※「電話番号でのご対応は行っておりません。お問い合わせはメールにてお願いいたします」といった記載とともに、確実に連絡が取れる電話番号を記載）\n\nメールアドレス：wassa0969@gmail.com\n（※確実に受信できるアドレス）'
    },
    {
      title: '販売価格',
      content: '各プランの購入ページにて表示する価格（税込価格）となります。'
    },
    {
      title: '商品代金以外に必要な費用',
      content: '当サイトのページの閲覧、サービス利用、ソフトウェアのダウンロード等に必要となるインターネット接続料金、通信料金は、お客様のご負担となります。'
    },
    {
      title: '代金の支払時期および方法',
      content: '支払方法：クレジットカード決済（Stripe）\n支払時期：初回は申し込み時、翌月以降は毎月自動更新となります。'
    },
    {
      title: 'サービスの提供時期',
      content: '決済手続き完了後、すぐにご利用いただけます。'
    },
    {
      title: '返品・キャンセル等の対応',
      content: 'デジタルコンテンツという商品の特性上、購入後の返品・返金・キャンセルはお受けできません。\nサブスクリプションの解約は、ユーザー設定画面（またはStripeのカスタマーポータル）からいつでも可能です。解約手続きが完了した月の翌月以降の請求は発生しません。'
    },
    {
      title: '動作環境',
      content: '推奨ブラウザ：Google Chrome 最新版、Safari 最新版、Microsoft Edge 最新版\nインターネット接続必須'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              M
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">MathStudio</span>
          </div>
          <button
            onClick={() => {
              // URLをルートに戻してリロードするか、viewパラメータをlandingに戻す
              window.history.pushState({}, '', '/');
              setView('landing');
            }}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full"
          >
            <ArrowLeft size={16} />
            トップページへ戻る
          </button>
        </div>
      </nav>

      <main className="pt-28 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">特定商取引法に基づく表記</h1>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="p-8 md:p-10 text-slate-700 space-y-8">

              <div className="grid gap-6">
                {sections.map((section, index) => (
                  <div key={index} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
                      {section.title}
                    </h2>
                    <p className="text-slate-800 font-medium whitespace-pre-wrap leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default TokushohoPage;
