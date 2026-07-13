"use client";

import { useState } from "react";
import Checklist from "./Checklist";
import PhotoAnalyze from "./PhotoAnalyze";

// ▼ 1ページ目：取引前チェック（サンプル。あとで本物に差しかえOK）
const PAGE1_ITEMS = [
  "会社名・所在地を確認した",
  "登記情報（会社の登録内容）を確認した",
  "代表者の氏名を確認した",
  "事業の内容を確認した",
  "設立年・営業年数を確認した",
  "取引の目的を確認した",
  "決算書を入手した",
  "希望する取引金額を確認した",
  "支払い条件を確認した",
  "反社会的勢力でないか確認した",
];

// ▼ 3ページ目：与信判断チェック（サンプル。あとで本物に差しかえOK）
const CREDIT_ITEMS = [
  "売上は安定して伸びているか",
  "利益（黒字）が出ているか",
  "自己資本比率は十分か",
  "借入が多すぎないか",
  "現金・預金は十分にあるか",
  "支払い遅れの情報はないか",
  "取引限度額を決めたか",
  "担保・保証はあるか",
  "業界全体の景気は悪くないか",
  "総合的に取引してよいと判断できるか",
];

type Tab = 1 | 2 | 3;

const TITLES: Record<Tab, { title: string; subtitle: string }> = {
  1: { title: "① 取引前チェック", subtitle: "取引をはじめる前の基本の確認" },
  2: { title: "② 決算書 撮影・分析", subtitle: "決算書を撮って企業を分析" },
  3: { title: "③ 与信判断チェック", subtitle: "取引してよいかの最終判断" },
};

export default function AppTabs() {
  const [tab, setTab] = useState<Tab>(1);

  return (
    <>
      <header className="header">
        <h1 className="title">{TITLES[tab].title}</h1>
        <p className="subtitle">{TITLES[tab].subtitle}</p>
      </header>

      <div className="tab-content">
        {tab === 1 && (
          <Checklist storageKey="app:check-page1" defaultItems={PAGE1_ITEMS} />
        )}
        {tab === 2 && <PhotoAnalyze />}
        {tab === 3 && (
          <Checklist storageKey="app:check-credit" defaultItems={CREDIT_ITEMS} />
        )}
      </div>

      <nav className="tabbar">
        <button
          className={`tabbtn${tab === 1 ? " active" : ""}`}
          onClick={() => setTab(1)}
        >
          <span className="tabbtn-icon">✅</span>
          <span className="tabbtn-label">取引前</span>
        </button>
        <button
          className={`tabbtn${tab === 2 ? " active" : ""}`}
          onClick={() => setTab(2)}
        >
          <span className="tabbtn-icon">📷</span>
          <span className="tabbtn-label">決算書</span>
        </button>
        <button
          className={`tabbtn${tab === 3 ? " active" : ""}`}
          onClick={() => setTab(3)}
        >
          <span className="tabbtn-icon">⚖️</span>
          <span className="tabbtn-label">与信判断</span>
        </button>
      </nav>
    </>
  );
}
