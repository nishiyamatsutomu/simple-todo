"use client";

import { useRef, useState } from "react";

export default function PhotoAnalyze() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  const clearImage = () => {
    setImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <section className="card card-plain">
      <p className="section-lead">
        決算書を撮影すると、ここに表示されます。
        <br />
        （AIによる分析は、次のステップで追加します）
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        style={{ display: "none" }}
        id="photo-input"
      />

      {!imageUrl ? (
        <label htmlFor="photo-input" className="photo-drop">
          <span className="photo-icon">📷</span>
          <span>タップして写真をとる／えらぶ</span>
        </label>
      ) : (
        <div className="photo-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="撮影した決算書" className="photo-image" />
          <div className="photo-actions">
            <label htmlFor="photo-input" className="add-btn secondary">
              撮りなおす
            </label>
            <button className="reset-btn" onClick={clearImage}>
              消す
            </button>
          </div>
          <button className="add-btn analyze-btn" disabled>
            AIで分析する（ステップ2で追加予定）
          </button>
        </div>
      )}

      <div className="photo-hint">
        <p>
          ジェミニなどに画像を添付して「財務分析」と入力すれば、分析してもらえます。
        </p>
        <p>但し、一般的でポジティブなコメントになります。</p>
      </div>
    </section>
  );
}
