# シンプル TODO アプリ

Next.js (App Router) + TypeScript で作った、シンプルでおしゃれな TODO アプリです。

## 機能

- ✅ タスクの追加
- ✅ 完了チェック（クリックで切り替え）
- ✅ タスクの削除
- 🌐 日本語対応（Noto Sans JP フォント）
- 💾 ブラウザの localStorage に自動保存（リロードしても消えません）

## ローカルで動かす

Node.js（18 以上）が必要です。

```bash
# 1. 依存パッケージをインストール
npm install

# 2. 開発サーバーを起動
npm run dev
```

ブラウザで http://localhost:3000 を開いてください。

## Vercel へのデプロイ

1. このプロジェクトを GitHub などにプッシュします。
2. [Vercel](https://vercel.com/) にログインし、「Add New… → Project」からリポジトリをインポートします。
3. フレームワークは自動で **Next.js** と認識されます。設定はそのままで **Deploy** を押すだけです。

CLI からデプロイする場合:

```bash
npm i -g vercel
vercel
```

## 構成

```
.
├── app/
│   ├── layout.tsx     # 全体レイアウト・フォント・メタ情報
│   ├── page.tsx       # トップページ
│   ├── TodoApp.tsx    # TODO 本体（追加・完了・削除）
│   └── globals.css    # スタイル
├── next.config.mjs
├── package.json
└── tsconfig.json
```
