"use client";

import { AlertCircle, CheckCircle, ChevronDown, Send } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { useState } from "react";

// ── メタデータは別ファイル（server component）で定義が必要なため
// layout.tsxまたはcontact/layout.tsxで設定してください
// export const metadata: Metadata = { title: "お問い合わせ" }

type FormState = "idle" | "sending" | "success" | "error";

type Category = {
  value: string;
  label: string;
};

const CATEGORIES: Category[] = [
  { value: "service", label: "サービスについて" },
  { value: "bug", label: "不具合・エラーの報告" },
  { value: "affiliation", label: "アフィリエイト・広告について" },
  { value: "content", label: "コンテンツの誤りについて" },
  { value: "other", label: "その他" },
];

export default function ContactPage() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const isValid =
    name.trim() &&
    email.includes("@") &&
    category &&
    message.trim().length >= 10;

  const handleSubmit = async () => {
    if (!isValid) return;
    setFormState("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, category, message }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error ?? "送信に失敗しました",
        );
      }

      setFormState("success");
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : "送信に失敗しました");
      setFormState("error");
    }
  };

  // ── 送信完了画面 ───────────────────────────────────────────────
  if (formState === "success") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-medium mb-2">送信しました</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              お問い合わせありがとうございます。
              <br />
              内容を確認の上、3営業日以内にご返信いたします。
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 transition-colors"
            >
              トップページへ戻る
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── フォーム画面 ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-medium mb-1.5">お問い合わせ</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            ご質問・ご要望・不具合の報告などお気軽にどうぞ。
            <br />
            通常3営業日以内にご返信いたします。
          </p>
        </div>

        <div className="space-y-5">
          {/* お名前 */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-1">
              お名前
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-medium">
                必須
              </span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="山田 花子"
              maxLength={50}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* メールアドレス */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-1">
              メールアドレス
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-medium">
                必須
              </span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* お問い合わせ種別 */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-1">
              お問い合わせ種別
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-medium">
                必須
              </span>
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-colors pr-10"
              >
                <option value="">選択してください</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* お問い合わせ内容 */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-1">
              お問い合わせ内容
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-medium">
                必須
              </span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="お問い合わせ内容を入力してください（10文字以上）"
              rows={6}
              maxLength={2000}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-colors resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length} / 2000
            </p>
          </div>

          {/* プライバシーポリシー同意 */}
          <div className="p-4 rounded-xl bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground leading-relaxed">
              送信することで
              <Link
                href="/privacy"
                className="text-emerald-700 underline underline-offset-2 mx-0.5"
              >
                プライバシーポリシー
              </Link>
              に同意したものとみなします。
              いただいたメールアドレスはご返信にのみ使用し、第三者に提供しません。
            </p>
          </div>

          {/* エラー表示 */}
          {formState === "error" && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          )}

          {/* 送信ボタン */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || formState === "sending"}
            className={[
              "w-full py-3.5 rounded-xl text-sm font-medium transition-all",
              "flex items-center justify-center gap-2",
              !isValid || formState === "sending"
                ? "bg-secondary text-muted-foreground cursor-not-allowed"
                : "bg-emerald-700 text-white hover:bg-emerald-800 active:scale-[0.98]",
            ].join(" ")}
          >
            {formState === "sending" ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                送信中...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                送信する
              </>
            )}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ── ヘッダー ──────────────────────────────────────────────────────

function Header() {
  return (
    <header className="border-b border-border">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← トップに戻る
        </Link>
        <span className="text-muted-foreground/40">|</span>
        <Link href="/" className="text-sm font-medium">
          UV<span className="text-emerald-700">lab</span>o
        </Link>
      </div>
    </header>
  );
}

// ── フッター ──────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-border mt-8">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <Link
            href="/privacy"
            className="hover:text-foreground transition-colors"
          >
            プライバシーポリシー
          </Link>
          <Link
            href="/terms"
            className="hover:text-foreground transition-colors"
          >
            利用規約
          </Link>
          <Link
            href="/legal"
            className="hover:text-foreground transition-colors"
          >
            特定商取引法に基づく表記
          </Link>
        </div>
      </div>
    </footer>
  );
}
