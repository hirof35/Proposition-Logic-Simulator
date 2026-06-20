// ==========================================
// 1. 型定義とシミュレーターのコアロジック
// ==========================================

type Proposition =
  | { type: 'Variable'; name: string }
  | { type: 'Not'; argument: Proposition }
  | { type: 'And'; left: Proposition; right: Proposition }
  | { type: 'Or'; left: Proposition; right: Proposition }
  | { type: 'Implies'; left: Proposition; right: Proposition };

// strictモードに対応するため、値が boolean | undefined であることを明示
type Environment = Record<string, boolean | undefined>;

function evaluate(prop: Proposition, env: Environment): boolean {
  switch (prop.type) {
    case 'Variable':
      const value = env[prop.name];
      // 存在チェック（undefined でないことを確定させる）
      if (value === undefined) {
        throw new Error(`変数 "${prop.name}" の真偽値が指定されていません。`);
      }
      return value;

    case 'Not':
      return !evaluate(prop.argument, env);

    case 'And':
      return evaluate(prop.left, env) && evaluate(prop.right, env);

    case 'Or':
      return evaluate(prop.left, env) || evaluate(prop.right, env);

    case 'Implies': {
      const p = evaluate(prop.left, env);
      const q = evaluate(prop.right, env);
      return !p || q;
    }
    default:
      const _exhaustiveCheck: never = prop;
      return _exhaustiveCheck;
  }
}

function stringify(prop: Proposition): string {
  switch (prop.type) {
    case 'Variable': return prop.name;
    case 'Not': return `¬(${stringify(prop.argument)})`;
    case 'And': return `(${stringify(prop.left)} ∧ ${stringify(prop.right)})`;
    case 'Or': return `(${stringify(prop.left)} ∨ ${stringify(prop.right)})`;
    case 'Implies': return `(${stringify(prop.left)} → ${stringify(prop.right)})`;
  }
}

// ==========================================
// 2. 実行テスト（真理値表の出力）
// ==========================================

const P: Proposition = { type: 'Variable', name: 'P' };
const Q: Proposition = { type: 'Variable', name: 'Q' };

const propositionA: Proposition = { type: 'Implies', left: P, right: Q };
const propositionB: Proposition = {
  type: 'Implies',
  left: { type: 'Not', argument: Q },
  right: { type: 'Not', argument: P }
};

const testEnvironments: Environment[] = [
  { P: true,  Q: true },
  { P: true,  Q: false },
  { P: false, Q: true },
  { P: false, Q: false },
];

console.log(`検証する命題A: ${stringify(propositionA)}`);
console.log(`検証する命題B: ${stringify(propositionB)}\n`);
console.log('|   P   |   Q   | 命題A (P→Q) | 命題B (¬Q→¬P) | 一致するか？ |');
console.log('|-------|-------|-------------|---------------|--------------|');

for (const env of testEnvironments) {
  const resultA = evaluate(propositionA, env);
  const resultB = evaluate(propositionB, env);
  const match = resultA === resultB ? '✅ 一致' : '❌ 不一致';

  // Null合体演算子 (??) を使い、万が一undefinedだった場合のデフォルト値を指定してエラーを回避
  const pStr = (env.P ?? false).toString().padEnd(5);
  const qStr = (env.Q ?? false).toString().padEnd(5);
  const aStr = resultA.toString().padEnd(11);
  const bStr = resultB.toString().padEnd(13);

  console.log(`| ${pStr} | ${qStr} | ${aStr} | ${bStr} | ${match}      |`);
}