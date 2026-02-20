# MathStudio 別PC セットアップガイド

> このファイルは「別のPCでこのプロジェクトを動かす」ための手順書です。
> 初めてやる方でも迷わないように、ひとつひとつ丁寧に説明しています。

---

## 全体の流れ

```
1. Node.js をインストール（プログラム実行に必要）
2. Git をインストール（コードを取得するツール）
3. コードをGitHubから取得（ダウンロード）
4. .env ファイルを作成（パスワード・設定ファイル）
5. npm install（必要なライブラリをインストール）
6. npm run dev（アプリを起動）
```

所要時間の目安：**30〜60分**（インストール時間含む）

---

## ステップ1: Node.js をインストールする

> Node.js とは、JavaScriptを動かすためのエンジンです。このプロジェクトに必須です。

### インストール手順

1. ブラウザで `https://nodejs.org` を開く
2. **「LTS」と書かれた緑のボタン**をクリックしてダウンロード
   - ※ LTS = Long Term Support（安定版）という意味。こちらを選ぶ
3. ダウンロードした `.msi` ファイルを開いてインストール
   - 「Next」を押し続けるだけでOK。設定は変えなくて大丈夫

### インストール確認

インストールが終わったら、コマンドプロンプト（またはターミナル）を開いて：

```
node --version
```

と入力して Enter。`v20.x.x` のような数字が表示されれば成功です。

---

## ステップ2: Git をインストールする

> Git とは、コードの「履歴管理ツール」です。GitHubからコードを取得するために必要です。

### インストール手順

1. ブラウザで `https://git-scm.com` を開く
2. 「Download for Windows」をクリック
3. ダウンロードした `.exe` ファイルを開いてインストール
   - こちらも「Next」を押し続けるだけでOK

### インストール確認

コマンドプロンプトで：

```
git --version
```

と入力して `git version 2.x.x` が表示されれば成功です。

---

## ステップ3: コードをGitHubから取得する

> この操作を「クローン（clone）」と言います。GitHubにあるコードを自分のPCにコピーするイメージです。

### コマンドプロンプトを開く

- Windowsキー + R を押して `cmd` と入力して Enter
- または「スタートメニュー」から「コマンドプロンプト」を検索

### 保存したいフォルダに移動する

デスクトップに置きたい場合：

```
cd %USERPROFILE%\Desktop
```

### クローン（ダウンロード）する

```
git clone https://github.com/Watarenai/mathstudio.git
```

Enter を押すとダウンロードが始まります。完了すると `mathstudio` というフォルダができます。

### フォルダに入る

```
cd mathstudio
```

---

## ステップ4: .env ファイルを作成する

> `.env` ファイルとは「パスワードや設定を書いた秘密のファイル」です。
> セキュリティのためGitHubには保存されていないので、手動で作る必要があります。

### 必要な情報

以下の情報が必要です。**現在使っているPCの `.env` ファイルを見て確認してください：**

| 変数名 | 説明 | 場所 |
|--------|------|------|
| `VITE_SUPABASE_URL` | SupabaseのプロジェクトURL | Supabaseの管理画面 or 現在の.envファイル |
| `VITE_SUPABASE_ANON_KEY` | Supabaseの公開キー | 同上 |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripeの公開キー | .env.exampleに記載済み |

### ファイルの作り方

メモ帳（または VSCode）で新規ファイルを作成し、以下の内容を書いて `.env` という名前で `mathstudio` フォルダ直下に保存：

```
VITE_SUPABASE_URL=（ここにSupabaseのURLを貼り付け）
VITE_SUPABASE_ANON_KEY=（ここにSupabaseのキーを貼り付け）
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51T2CkVH3R2LaFbghw9mFXIVYKms6GGltwE0J3Caf5ra6G1cGL74n4hs4lZA5mJaXqNn1f0Lyn6g5n1zHTpVlWLzL00QiZHVgtm
NODE_ENV=development
VITE_APP_URL=http://localhost:5173
```

> ⚠️ ファイル名は `.env` です（拡張子なし）。
> メモ帳で保存するとき「ファイルの種類」を「すべてのファイル」にして、ファイル名を `.env` にしてください。

### Supabaseのキーの確認方法

1. `https://supabase.com` にログイン
2. 対象のプロジェクトを選択
3. 左メニューの「Settings（設定）」→「API」をクリック
4. `Project URL` と `anon public` キーをコピー

---

## ステップ5: ライブラリをインストールする

コマンドプロンプトで `mathstudio` フォルダに入った状態で：

```
npm install
```

と入力して Enter。たくさんのファイルがダウンロードされます（数分かかります）。

最後に `added xxx packages` と表示されれば成功です。

---

## ステップ6: アプリを起動する

```
npm run dev
```

と入力して Enter。

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

このような表示が出たら成功です！
ブラウザで `http://localhost:5173` を開くとアプリが表示されます。

---

## うまくいかない時のチェックリスト

| 症状 | 確認すること |
|------|-------------|
| `node` コマンドが使えない | Node.jsのインストールができているか確認。PCを再起動してみる |
| `git` コマンドが使えない | Gitのインストールができているか確認。PCを再起動してみる |
| `npm install` でエラー | Node.jsのバージョンが古い可能性。v18以上をインストール |
| アプリが起動するが機能しない | `.env` ファイルの内容が正しいか確認 |
| Supabaseのエラーが出る | `.env` のURLとキーが正しいか確認 |

---

## コードを最新版に更新する方法

誰かが変更をGitHubに送った後、自分のPCでも最新版にしたいとき：

```
git pull
npm install
```

この2つを実行するだけで最新版になります。

---

## よく使うコマンド一覧

| コマンド | 意味 |
|----------|------|
| `npm run dev` | 開発サーバーを起動（アプリを動かす） |
| `npm run build` | 本番用にビルドする |
| `npm run test` | テストを実行する |
| `git pull` | GitHubから最新版を取得する |
| `git status` | 変更されたファイルを確認する |
| `git add .` | 全ての変更をステージングする |
| `git commit -m "説明"` | 変更を保存（セーブ）する |
| `git push` | GitHubに変更を送信する |

---

作成日: 2026-02-20
GitHubリポジトリ: https://github.com/Watarenai/mathstudio
