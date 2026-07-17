"use client";

import { useState } from "react";
import Checklist from "./Checklist";
import PhotoAnalyze from "./PhotoAnalyze";
import FinancialInputs from "./FinancialInputs";

// ▼ 1ページ目：取引前チェック
const PAGE1_ITEMS = [
  "公序良俗に違反する業種ではない",
  "許可が必要な業種の場合、許可がある",
  "過去に自己破産・代位弁済がない",
  "配偶者・親戚に、類似業種での事故歴がない",
  "住宅ローン・個人借り入れの返済に乱れがない",
  "事務所を自社で所有、または賃貸契約している",
  "今回の資金の使いみちは事業性である",
  "帳簿・決算に変造・粉飾がない",
  "電気・ガス・水道代の延滞がない",
  "悪質な紹介者に多大な手数料を支払っていない",
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

const APP_TITLE = "あなたの会社分析";

const TITLES: Record<
  Tab,
  { title: string; lead?: string; subtitle?: string[]; note?: string[] }
> = {
  1: {
    title: "① 申込前チェック",
    subtitle: ["次の10項目に当てはまればチェックをいれて下さい"],
  },
  2: {
    title: "② 決算書 撮影・分析",
    note: [
      "1つでもチェックがない場合は改善してください",
      "金融公庫や保証付き融資の与信判断に影響する場合があります",
    ],
    subtitle: [
      "次にあなたの会社の財務分析をします",
      "決算書・貸借対照表・損益計算書の写真を撮って画像を添付してください",
      "会社名や取引先がわかるものは消してください",
    ],
  },
  3: {
    title: "③ 与信判断チェック",
    lead: "比率分析からの判断",
    subtitle: [
      "企業の安定性・収益性・生産性についての与信判断です。",
      "業種・業界の成長性については加味していません。",
    ],
  },
};

export default function AppTabs() {
  const [tab, setTab] = useState<Tab>(1);
  const { title, lead, subtitle, note } = TITLES[tab];

  return (
    <>
      <header className="header">
        <p className="app-title">{APP_TITLE}</p>
        {note && (
          <div className="header-note">
            {note.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}
        <h1 className="title">{title}</h1>
        {lead && <p className="page-lead">{lead}</p>}
        {subtitle && (
          <div className="subtitle">
            {subtitle.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}
      </header>

      <div className="tab-content">
        {tab === 1 && (
          <Checklist storageKey="app:check-page1-v2" defaultItems={PAGE1_ITEMS} />
        )}
        {tab === 2 && (
          <>
            <PhotoAnalyze />
            <FinancialInputs />
            <button className="next-page-btn" onClick={() => setTab(3)}>
              判定は次のページで →
            </button>
          </>
        )}
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
          <span className="tabbtn-label">申込前</span>
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
