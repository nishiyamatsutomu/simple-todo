"use client";

import { useEffect, useState } from "react";

// 決算書からうつす項目（あとで自由に変えられます）
type Field =
  | { label: string; type: "number"; unit: string }
  | { label: string; type: "yesno" };

const FIELDS: Field[] = [
  { label: "売上総利益", type: "number", unit: "千円" },
  { label: "経常利益", type: "number", unit: "千円" },
  { label: "人件費（役員報酬・給与・法定福利費・福利厚生費）", type: "number", unit: "千円" },
  { label: "販売管理費（減価償却費を除く）", type: "number", unit: "千円" },
  { label: "現預金", type: "number", unit: "千円" },
  { label: "自己資本", type: "number", unit: "千円" },
  { label: "総資産", type: "number", unit: "千円" },
  { label: "従業員数（役員・社員は1、非正規は0.5）", type: "number", unit: "人" },
  { label: "資金繰り表作成", type: "yesno" },
];

const STORAGE_KEY = "app:financial-inputs-v3";

export default function FinancialInputs() {
  const [values, setValues] = useState<string[]>(() => FIELDS.map(() => ""));
  const [loaded, setLoaded] = useState(false);

  // 初回に localStorage から読み込む
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr) && arr.length === FIELDS.length) {
          setValues(arr);
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    }
  }, [values, loaded]);

  const update = (index: number, value: string) => {
    setValues((prev) => prev.map((v, i) => (i === index ? value : v)));
  };

  const clearAll = () => {
    setValues(FIELDS.map(() => ""));
  };

  return (
    <section className="card card-plain">
      <p className="section-lead">
        決算書を見ながら、下の欄に入力してください。
      </p>

      <div className="finput-list">
        {FIELDS.map((field, i) => (
          <div
            className={`finput-row${field.type === "yesno" ? " finput-full" : ""}`}
            key={i}
          >
            <label className="finput-label" htmlFor={`finput-${i}`}>
              {field.label}
            </label>

            {field.type === "number" ? (
              <div className="finput-box">
                <input
                  id={`finput-${i}`}
                  className="finput-input"
                  type="text"
                  inputMode="numeric"
                  value={values[i] ?? ""}
                  onChange={(e) => update(i, e.target.value)}
                  placeholder="0"
                />
                <span className="finput-unit">{field.unit}</span>
              </div>
            ) : (
              <div className="yesno-box">
                <button
                  type="button"
                  className={`yesno-btn${values[i] === "あり" ? " selected" : ""}`}
                  onClick={() => update(i, "あり")}
                >
                  あり
                </button>
                <button
                  type="button"
                  className={`yesno-btn${values[i] === "なし" ? " selected" : ""}`}
                  onClick={() => update(i, "なし")}
                >
                  なし
                </button>
              </div>
            )}
          </div>
        ))}
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
