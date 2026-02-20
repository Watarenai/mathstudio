# MathStudio - すべてのこどもに、数学の楽しさを。

学習障がいや書字困難のある中学生のための、アクセシブルな数学学習プラットフォームです。

## 🌟 特徴

- **直感的な操作**: テンキー入力、手書きツール（TLDraw）、グラフ可視化を統合。
- **アクセシビリティ**: ふりがな表示、文字サイズ変更、音声読み上げ機能を搭載。
- **サブスクリプション機能**: Stripeを統合したProプラン管理。
- **分析機能**: ユーザーごとの学習データ（解答時間、正答率）のトラッキング。
- **保護者・管理者画面**: 学習履歴の確認やユーザー管理機能。

## 🚀 技術スタック

- **Frontend**: React, TypeScript, Vite, Framer Motion, Zustand
- **Backend/DB**: Supabase (Auth, Database, Edge Functions)
- **Payment**: Stripe
- **Monitoring**: Sentry
- **Testing**: Vitest

## 🛠️ 公開・リリースの準備 (Vercel編)

推奨ホスティング: **Vercel** (設定ファイル `vercel.json` 同梱済み)

1.  **Vercelにこのリポジトリをインポート**
    - Framework Preset: `Vite`
    - Root Directory: `./` (デフォルト)

2.  **Environment Variables (環境変数) の設定**
    Vercelの管理画面で以下を設定してください：

    | 変数名 | 設定値の例 / 備考 |
    | :--- | :--- |
    | `VITE_SUPABASE_URL` | あなたのSupabaseプロジェクトURL |
    | `VITE_SUPABASE_ANON_KEY` | あなたのSupabase Anon Key |
    | `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_live_51T2CkVH3R2LaFbghw9mFXIVYKms6GGltwE0J3Caf5ra6G1cGL74n4hs4lZA5mJaXqNn1f0Lyn6g5n1zHTpVlWLzL00QiZHVgtm` (提供済み) |
    | `VITE_SENTRY_DSN` | (任意) Sentry DSN |
    | `SENTRY_AUTH_TOKEN` | (任意) Sentry Auth Token |

3.  **Deploy**
    - 設定後、Deployボタンを押すだけで公開されます。

### Stripe Webhookの設定
Supabase Edge Function (`stripe-webhook`) のURLをStripeダッシュボードのWebhook設定に追加してください。
- URL形式: `https://[PROJECT_REF].supabase.co/functions/v1/stripe-webhook`
- イベント: `customer.subscription.created`, `invoice.payment_succeeded` など

## 📄 ライセンス

Copyright (c) 2026 MathStudio Team. All rights reserved.
