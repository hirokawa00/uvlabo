"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { UVCard } from "@/components/UVCard"
import { Footer } from "@/components/Footer"
import { BLOG_POSTS, CATEGORY_CONFIG, formatDate } from "@/lib/blog"
import { Clock, ChevronRight, BookOpen } from "lucide-react"

// ── タブコンテンツを遅延読み込み（初期バンドルから除外）──────────
const DiagnosisContainer = dynamic(
  () =>
    import("@/components/diagnosis/DiagnosisContainer").then((m) => ({
      default: m.DiagnosisContainer,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <div className="h-16 rounded-xl bg-secondary animate-pulse" />
        <div className="h-10 rounded-xl bg-secondary animate-pulse" />
        <div className="h-10 rounded-xl bg-secondary animate-pulse" />
        <div className="h-10 rounded-xl bg-secondary animate-pulse" />
      </div>
    ),
  }
)

const AfterCareContainer = dynamic(
  () =>
    import("@/components/aftercare/AfterCareContainer").then((m) => ({
      default: m.AfterCareContainer,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <div className="h-20 rounded-xl bg-secondary animate-pulse" />
        <div className="h-12 rounded-xl bg-secondary animate-pulse" />
      </div>
    ),
  }
)

type Tab = "uv" | "diagnosis" | "aftercare"

const TABS: { key: Tab; label: string; emoji: string }[] = [
  { key: "uv",        label: "UV指数",       emoji: "☀️" },
  { key: "diagnosis", label: "日焼け止め診断", emoji: "🔍" },
  { key: "aftercare", label: "事後ケア",      emoji: "🌊" },
]

const PICKUP_POSTS = BLOG_POSTS.slice(0, 3)

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("uv")
  const [currentUV, setCurrentUV] = useState<number | undefined>(undefined)

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ── ヘッダー ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">☀️</span>
            <span className="text-base font-medium tracking-tight">
              UV<span className="text-emerald-700">lab</span>o
            </span>
          </div>
          <Link
            href="/blog"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            コラム
          </Link>
        </div>

        {/* タブ */}
        <div className="max-w-lg mx-auto px-4">
          <div className="flex">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={[
                  "flex-1 py-2.5 text-xs transition-all border-b-2 flex items-center justify-center gap-1",
                  activeTab === tab.key
                    ? tab.key === "aftercare"
                      ? "border-orange-600 text-orange-700 font-medium"
                      : "border-emerald-700 text-emerald-700 font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                <span className="text-sm leading-none">{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── メインコンテンツ ─────────────────────────────────────── */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5">

        {/* UV指数タブ */}
        {activeTab === "uv" && (
          <div className="space-y-4">
            <UVCard spf={50} onUVLoaded={(uv) => setCurrentUV(uv)} />

            <button
              type="button"
              onClick={() => setActiveTab("diagnosis")}
              className="w-full py-3.5 rounded-xl bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 active:scale-[0.98] transition-all"
            >
              今日の日焼け止めを診断する →
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("aftercare")}
              className="w-full py-3 rounded-xl border border-orange-300 text-orange-700 text-sm font-medium hover:bg-orange-50 transition-all"
            >
              日焼けしてしまったら →
            </button>

            {/* ── コラム導線 ─────────────────────────────────────── */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-muted-foreground tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  UV・紫外線ケアコラム
                </p>
                <Link
                  href="/blog"
                  className="text-xs text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-0.5"
                >
                  すべて見る
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-2.5">
                {PICKUP_POSTS.map((post) => {
                  const cfg = CATEGORY_CONFIG[post.category]
                  return (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="flex items-center gap-3 p-3.5 rounded-xl border border-border hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${post.coverColor} flex items-center justify-center text-xl shrink-0`}>
                        {post.coverEmoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${cfg.color} ${cfg.textColor} inline-block mb-0.5`}>
                          {cfg.label}
                        </span>
                        <p className="text-sm font-medium text-foreground group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {post.readingTimeMin}分で読める
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </Link>
                  )
                })}
              </div>

              <Link
                href="/blog"
                className="mt-3 flex items-center justify-center gap-1.5 w-full py-3 rounded-xl border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                コラムをもっと読む
              </Link>
            </div>
          </div>
        )}

        {activeTab === "diagnosis" && <DiagnosisContainer uvIndex={currentUV} />}
        {activeTab === "aftercare" && <AfterCareContainer />}
      </main>

      <Footer />
    </div>
  )
}