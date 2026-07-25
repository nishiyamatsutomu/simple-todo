"use client";

import { useState } from "react";

// お問い合わせの送り先メールアドレス（変えたいときはここを直します）
const CONTACT_EMAIL = "nishiyama2106senshou@gmail.com";

export default function ContactForm() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const send = () => {
    const subject = encodeURIComponent("アプリのお問い合わせ");
    const body = encodeURIComponent(
      `ご返信先メール: ${email}\n\n${message}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  if (!open) {
    return (
      <button className="contact-link" onClick={() => setOpen(true)}>
        このアプリのお問い合わせはコチラへ →
      </button>
    );
  }

  return (
    <section className="card contact-panel">
      <p className="contact-title">お問い合わせ</p>
      <p className="contact-to">宛先（To）：{CONTACT_EMAIL}</p>
      <input
        className="contact-input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ご返信先メールアドレス"
      />
      <textarea
        className="contact-textarea"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="お問い合わせ内容を入力してください"
        rows={5}
      />
      <div className="contact-actions">
        <button className="reset-btn" onClick={() => setOpen(false)}>
          閉じる
        </button>
        <button
          className="add-btn contact-send"
          onClick={send}
          disabled={!message.trim() || !email.trim()}
        >
          送信する
        </button>
      </div>
      <p className="contact-note">
        「送信する」を押すと、メールアプリが開いて送信できます。
      </p>
    </section>
  );
}
