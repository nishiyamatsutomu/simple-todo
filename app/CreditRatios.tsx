"use client";

import { useEffect, useState } from "react";

// 各項目と、その中の行数
const CATEGORIES: { name: string; rows: number }[] = [
  { name: "安定性", rows: 2 },
  { name: "収益性", rows: 2 },
  { name: "生産性", rows: 2 },
  { name: "資金繰り表", rows: 1 },
];

const STORAGE_KEY = "app:credit-ratios-v8";
// 2ページ目の数字入力（自己資本=5、総資産=6）
const FIN_KEY = "app:financial-inputs-v3";
const IDX_JIKOSHIHON = 5;
const IDX_SOSHISAN = 6;

type Row = { formula: string; score: string };

function emptyData(): Row[][] {
  const data = CATEGORIES.map((c) =>
    Array.from({ length: c.rows }, () => ({ formula: "", score: "" }))
  );
  // 安定性
  data[0][0].formula = "今までの積み重ね自己資本比率";
  data[0][1].formula = "売上不振・不況になっても耐えうる余力";
  // 収益性
  data[1][0].formula = "業種を問わず売上総利益から判定";
  data[1][1].formula = "M＆Aでも使われる経常利益/自己資本比率";
  // 生産性
  data[2][0].formula = "従業員1名当たりの貢献度から判定";
  data[2][1].formula = "再チェック人件費比率";
  // 資金繰り表
  data[3][0].formula = "有無";
  return data;
}

// 安定性1項目め（自動計算するセル）
const AUTO_CI = 0;
const AUTO_RI = 0;

export default function CreditRatios() {
  const [data, setData] = useState<Row[][]>(emptyData);
  const [loaded, setLoaded] = useState(false);
  const [fin, setFin] = useState<string[]>([]);

  // 初回に localStorage から読み込む
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const arr = JSON.parse(saved);
        if (
          Array.isArray(arr) &&
          arr.length === CATEGORIES.length &&
          arr.every(
            (rows, i) => Array.isArray(rows) && rows.length === CATEGORIES[i].rows
          )
        ) {
          setData(arr);
        }
      }
    } catch {
      // 破損データは無視
    }
    // 2ページ目の数字も読み込む
    try {
      const s = localStorage.getItem(FIN_KEY);
      if (s) {
        const a = JSON.parse(s);
        if (Array.isArray(a)) setFin(a);
      }
    } catch {
      // 無視
    }
    setLoaded(true);
  }, []);

  // 自己資本比率＝自己資本 ÷ 総資産 × 100
  const jiko = parseFloat(fin[IDX_JIKOSHIHON] ?? "");
  const so = parseFloat(fin[IDX_SOSHISAN] ?? "");
  const jikoRatio =
    Number.isFinite(jiko) && Number.isFinite(so) && so !== 0
      ? (jiko / so) * 100
      : null;
  // 点数ルール：50%以上=15、30%以上=10、10%以上=5、それ未満=0
  const jikoScore =
    jikoRatio === null
      ? null
      : jikoRatio >= 50
      ? 15
      : jikoRatio >= 30
      ? 10
      : jikoRatio >= 10
      ? 5
      : 0;

  // 計算結果を 安定性1項目めの点数に反映（同じ値なら更新せずループを防ぐ）
  useEffect(() => {
    if (!loaded) return;
    const desired = jikoScore === null ? "" : String(jikoScore);
    setData((prev) => {
      if (prev[AUTO_CI][AUTO_RI].score === desired) return prev;
      return prev.map((rows, i) =>
        i !== AUTO_CI
          ? rows
          : rows.map((row, j) =>
              j !== AUTO_RI ? row : { ...row, score: desired }
            )
      );
    });
  }, [loaded, jikoScore]);

  // 変更のたびに保存
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, loaded]);

  const update = (
    ci: number,
    ri: number,
    field: "formula" | "score",
    value: string
  ) => {
    setData((prev) =>
      prev.map((rows, i) =>
        i !== ci
          ? rows
          : rows.map((row, j) => (j !== ri ? row : { ...row, [field]: value }))
      )
    );
  };

  const clearAll = () => setData(emptyData());

  // 点数の合計（数字として読めるものだけ足す）
  const total = data.reduce(
    (sum, rows) =>
      sum +
      rows.reduce((s, row) => {
        const n = parseFloat(row.score);
        return s + (Number.isFinite(n) ? n : 0);
      }, 0),
    0
  );

  return (
    <section className="card">
      <p className="section-lead">
        安定性・収益性・生産性・資金繰り表について、式と点数を入力してください。
      </p>

      {CATEGORIES.map((cat, ci) => (
        <div className="ratio-group" key={ci}>
          <h3 className="ratio-cat">{cat.name}</h3>
          {data[ci].map((row, ri) => {
            const isAuto = ci === AUTO_CI && ri === AUTO_RI;
            return (
              <div key={ri}>
                <div className="ratio-row">
                  <input
                    className="ratio-formula"
                    type="text"
                    value={row.formula}
                    onChange={(e) => update(ci, ri, "formula", e.target.value)}
                    placeholder="式"
                  />
                  <div className="ratio-score-box">
                    <input
                      className="ratio-score"
                      type="text"
                      inputMode="numeric"
                      value={row.score}
                      onChange={(e) => update(ci, ri, "score", e.target.value)}
                      placeholder="点数"
                      readOnly={isAuto}
                    />
                    <span className="finput-unit">点</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      <div className="ratio-total">
        <span className="ratio-total-label">合計点数</span>
        <span className="ratio-total-value">{total} 点</span>
      </div>

      <div className="ratio-criteria">
        <p className="ratio-criteria-title">判定基準</p>
        <p>70点以上　　高い財務健全性</p>
        <p>40点〜69点　財務健全標準</p>
        <p>40点以下　　注意を要する</p>
      </div>

      <div className="checklist-footer">
        <span className="footer">入力は自動で保存されます</span>
        <button className="reset-btn" onClick={clearAll}>
          クリア
        </button>
      </div>
    </section>
  );
}
