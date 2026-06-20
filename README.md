# 命題論理シミュレーター (Proposition Logic Simulator)

TypeScriptで構築された、型安全な命題論理の真理値評価シミュレーターです。
与えられた命題（論理式）の構造を抽象構文木（AST）として表現し、各変数の真偽値の組み合わせから最終的な真理値を判定・シミュレーションします。
<img width="917" height="380" alt="スクリーンショット 2026-06-20 091712" src="https://github.com/user-attachments/assets/13408f2b-5a44-4810-ae6f-44fcbd4932e5" />

---

## 🚀 特徴

* **型安全（Strict Mode 完全対応）**: TypeScriptの厳格な型チェックをパスするよう設計されており、予期せぬ `undefined` によるエラーを防ぎます。
* **網羅性チェック**: 抽象論理式の評価に `never` 型を用いたエグゾースティブ・チェック（網羅性検査）を導入。新しい論理演算子を追加した際のバグをコンパイル時点で検知します。
* **対偶・同値の検証**: 標準で「PならばQ ($P \rightarrow Q$)」とその対偶の真理値表を自動生成し、論理的同値性を視覚的に検証できます。

---

## 🛠️ 動作環境・使用技術

* **言語**: TypeScript
* **実行環境**: Node.js
* **実行ツール**: `ts-node`

---

## 📦 セットアップと実行手順

### 1. リポジトリの準備と依存関係のインストール

プロジェクトフォルダに移動し、必要なパッケージ（TypeScriptおよび実行環境）をインストールします。

```bash
# プロジェクトの初期化（未実施の場合）
npm init -y

# 必要な開発依存ライブラリのインストール
npm install -D typescript ts-node @types/node

# TypeScript設定ファイルの作成（未実施の場合）
npx tsc --init
2. ソースファイルの配置ルートディレクトリに index.ts を作成し、シミュレーターのソースコードを記述します。3. シミュレーターの実行ts-node を使用して、コンパイルと実行をワンコマンドで行います。Bashnpx ts-node index.ts
📝 対応している論理演算本シミュレーターでは、以下の5つの論理要素をサポートしています。演算子表現方法 (TypeScript型)論理学上の記号説明変数{ type: 'Variable', name: 'P' }$P, Q, R$命題変数そのもの否定{ type: 'Not', argument: ... }$\neg P$NOT（〜ではない）論理積{ type: 'And', left: ..., right: ... }$P \land Q$AND（かつ）論理和{ type: 'Or', left: ..., right: ... }$P \lor Q$OR（または）含意{ type: 'Implies', left: ..., right: ... }$P \rightarrow Q$条件法（ならば）💡 「ならば（$P \rightarrow Q$）」のロジックについてプログラミング言語の標準演算子には存在しないため、論理学的に等価な ¬P ∨ Q（Pが偽、またはQが真のときに全体が真になる）に内部で変換して評価しています。📊 出力結果の例実行すると、コンソールに以下のような美しい真理値表が出力され、命題の同値性が証明されます。Plaintext検証する命題A: (P → Q)
検証する命題B: (¬(Q) → ¬(P))

--- 真理値表シミュレーション ---
|   P   |   Q   | 命題A (P→Q) | 命題B (¬Q→¬P) | 一致するか？ |
|-------|-------|-------------|---------------|--------------|
| true  | true  | true        | true          | ✅ 一致      |
| true  | false | false       | false         | ✅ 一致      |
| false | true  | true        | true          | ✅ 一致      |
| false | false | true        | true          | ✅ 一致      |
⚙️ 拡張について新しい演算子（例：同値 $P \leftrightarrow Q$ など）を追加したい場合は、以下の手順で行えます。type Proposition に { type: 'Equivalent'; left: Proposition; right: Proposition } を追加。evaluate 関数と stringify 関数にそれぞれの switch ケースを追加（追加しない場合、TypeScriptがコンパイルエラーを出して教えてくれます）。<img width="917" height="380" alt="スクリーンショット 2026-06-20 091712" src="https://github.com/user-attachments/assets/255ccf73-cbfa-4371-9398-fa1047993c2d" />

