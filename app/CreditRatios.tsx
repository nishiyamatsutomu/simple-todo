"use client";

import { useEffect, useState } from "react";

const CATEGORIES = ["安定性", "収益性", "生産性"];
const ROWS_PER_CATEGORY = 2;
const STORAGE_KEY = "app:credit-ratios-v5";

type Row = { formula: string; score: string };

function emptyData(): Row[][] {
  const data = CATEGORIES.map(() =>
    Array.from({ length: ROWS_PER_CATEGORY }, () => ({ formula: "", score: "" }))
  );
  // 収益性（2番目）の項目に、あらかじめ文を入れておく
  data[1][0].formula = "業種を問わず売上総利益から判定";
  data[1][1].formula = "M＆Aでも使われる経常利益/自己資本比率";
  // 安定性（1番目）の2項目目
  data[0][1].formula = "売上不振・不況になっても耐えうる余力";
  // 生産性（3番目）の1項目目
  data[2][0].formula = "従業員1名当たりの貢献度から判定";
  return data;
}

export default function CreditRatios() {
  const [data, setData] = useState<Row[][]>(emptyData);
  const [loaded, setLoaded] = useState(false);

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
            (rows) => Array.isArray(rows) && rows.length === ROWS_PER_CATEGORY
          )
        ) {
          setData(arr);
        }
      }
    } catch {
      // 破損データは無視
    }
    setLoaded(true);
  }, []);

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
          : rows.map((row, j) =>
              j !== ri ? row : { ...row, [field]: value }
            )
      )
    );
  };

  const clearAll = () => setData(emptyData());

  return (
    <section className="card">
      <p className="section-lead">
        安定性・収益性・生産性について、式と点数を入力してください。
      </p>

      {CATEGORIES.map((cat, ci) => (
        <div className="ratio-group" key={ci}>
          <h3 className="ratio-cat">{cat}</h3>
          {data[ci].map((row, ri) => (
            <div className="ratio-row" key={ri}>
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
                />
                <span className="finput-unit">点</span>
              </div>
            </div>
          ))}
        </div>
      ))}

      <div className="checklist-footer">
        <span className="footer">入力は自動で保存されます</span>
        <button className="reset-btn" onClick={clearAll}>
          クリア
        </button>
      </div>
    </section>
  );
}
