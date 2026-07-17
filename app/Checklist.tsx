"use client";

import { useEffect, useState } from "react";

type Props = {
  storageKey: string;
  defaultItems: string[];
  showJudge?: boolean;
};

export default function Checklist({
  storageKey,
  defaultItems,
  showJudge = true,
}: Props) {
  const [checked, setChecked] = useState<boolean[]>(() =>
    defaultItems.map(() => false)
  );
  const [loaded, setLoaded] = useState(false);
  const [judged, setJudged] = useState(false);

  // 初回に localStorage から読み込む
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr) && arr.length === defaultItems.length) {
          setChecked(arr);
        }
      }
    } catch {
      // 破損データは無視
    }
    setLoaded(true);
  }, [storageKey, defaultItems.length]);

  // 変更のたびに保存
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(storageKey, JSON.stringify(checked));
    }
  }, [checked, loaded, storageKey]);

  const toggle = (index: number) => {
    setChecked((prev) => prev.map((c, i) => (i === index ? !c : c)));
    setJudged(false); // チェックを変えたら判定はやり直し
  };

  const reset = () => {
    setChecked(defaultItems.map(() => false));
    setJudged(false);
  };

  const doneCount = checked.filter(Boolean).length;
  const missingItems = defaultItems.filter((_, i) => !checked[i]);
  const allChecked = missingItems.length === 0;

  return (
    <section className="card">
      <ul className="list">
        {defaultItems.map((item, i) => (
          <li key={i} className={`item${checked[i] ? " done" : ""}`}>
            <input
              className="checkbox"
              type="checkbox"
              checked={checked[i] ?? false}
              onChange={() => toggle(i)}
              aria-label={`${item} を確認`}
            />
            <span className="item-text">{item}</span>
          </li>
        ))}
      </ul>

      {showJudge && (
        <button className="judge-btn" onClick={() => setJudged(true)}>
          判定する
        </button>
      )}

      {showJudge && judged && (
        <div className={`judge-result${allChecked ? " ok" : " warn"}`}>
          <p className="judge-headline">
            {allChecked ? "✅ 判定：OK" : "⚠️ 判定：改善してください"}
          </p>
          <p className="judge-detail">
            {allChecked
              ? `${defaultItems.length}項目すべてに当てはまりました。`
              : `次の${missingItems.length}項目が当てはまっていません。改善してください。`}
          </p>
          {!allChecked && (
            <ul className="judge-missing">
              {missingItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="checklist-footer">
        <span className="footer">
          {doneCount} / {defaultItems.length} 項目 チェック済み
        </span>
        <button className="reset-btn" onClick={reset}>
          リセット
        </button>
      </div>
    </section>
  );
}
