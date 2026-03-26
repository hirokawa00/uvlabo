import type { Metadata } from "next"
import Link from "next/link"
import {
  BLOG_POSTS,
  CATEGORY_CONFIG,
  getFeaturedPosts,
  formatDate,
  type BlogCategory,
} from "@/lib/blog"
import { Footer } from "@/components/Footer"
import { Clock, ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "UV・紫外線ケアコラム",
  description: "日焼け止めの選び方・UV指数の読み方・日焼けあとのケア方法など、紫外線対策に関する情報をまとめたコラム一覧です。",
}

export default function BlogIndexPage() {
  const featured = getFeaturedPosts()
  const all = BLOG_POSTS

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ヘッダー */}
      <header className="border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium">
            UV<span className="text-emerald-700">lab</span>o
          </Link>
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ツールを使う →
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">

        {/* ページタイトル */}
        <div className="mb-8">
          <p className="text-xs font-medium text-emerald-700 tracking-widest mb-1.5">COLUMN</p>
          <h1 className="text-2xl font-bold text-foreground mb-2">UV・紫外線ケアコラム</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            日焼け止めの選び方から日焼けあとのケアまで、<br className="hidden sm:block" />
            毎日の紫外線対策に役立つ情報をお届けします。
          </p>
        </div>

        {/* 注目記事（大カード） */}
        {featured.length > 0 && (
          <section className="mb-10">
            <SectionLabel>注目の記事</SectionLabel>
            <div className="space-y-4">
              {featured.map((post) => (
                <FeaturedCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* カテゴリ別フィルター */}
        <section className="mb-8">
          <SectionLabel>カテゴリから探す</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(CATEGORY_CONFIG) as [BlogCategory, typeof CATEGORY_CONFIG[BlogCategory]][]).map(([key, cfg]) => {
              const count = BLOG_POSTS.filter((p) => p.category === key).length
              if (count === 0) return null
              return (
                <Link
                  key={key}
                  href={`/blog/category/${key}`}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-opacity hover:opacity-80 ${cfg.color} ${cfg.textColor}`}
                >
                  <span>{cfg.emoji}</span>
                  {cfg.label}
                  <span className="opacity-60">({count})</span>
                </Link>
              )
            })}
          </div>
        </section>

        {/* 全記事一覧 */}
        <section>
          <SectionLabel>すべての記事</SectionLabel>
          <div className="space-y-3">
            {all.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        {/* ツールへのCTA */}
        <div className="mt-12 p-5 rounded-2xl bg-linear-to-br from-emerald-50 to-teal-50 border border-emerald-200">
          <p className="text-xs font-bold text-emerald-700 tracking-widest mb-1.5">☀️ UVlabo ツール</p>
          <p className="font-medium text-foreground mb-1">今日のUV指数を確認する</p>
          <p className="text-sm text-muted-foreground mb-4">
            現在地のUV指数と、肌タイプ別の日焼け止め診断ツールが使えます。
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 transition-colors"
          >
            ツールを使う →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

// ── 共通コンポーネント ────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium text-muted-foreground tracking-wider mb-3 uppercase">
      {children}
    </p>
  )
}

function FeaturedCard({ post }: { post: ReturnType<typeof getFeaturedPosts>[0] }) {
  const cfg = CATEGORY_CONFIG[post.category]
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <div className="rounded-2xl border border-border overflow-hidden hover:border-emerald-300 transition-colors">
        {/* カバーグラデーション */}
        <div className={`bg-linear-to-r ${post.coverColor} px-6 py-8 flex items-center justify-between`}>
          <span className="text-5xl">{post.coverEmoji}</span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${cfg.color} ${cfg.textColor}`}>
            {cfg.emoji} {cfg.label}
          </span>
        </div>
        {/* テキスト */}
        <div className="px-5 py-4">
          <h2 className="font-bold text-foreground text-base leading-snug mb-2 group-hover:text-emerald-700 transition-colors">
            {post.title}
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
            {post.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{formatDate(post.publishedAt)}</span>
              <span className="flex items-center gap-0.5">
                <Clock className="w-3 h-3" />
                {post.readingTimeMin}分
              </span>
            </div>
            <span className="text-xs text-emerald-700 flex items-center gap-0.5 font-medium">
              読む <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function ArticleCard({ post }: { post: (typeof BLOG_POSTS)[0] }) {
  const cfg = CATEGORY_CONFIG[post.category]
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <div className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-emerald-300 hover:bg-emerald-50/30 transition-all">
        <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${post.coverColor} flex items-center justify-center text-2xl shrink-0`}>
          {post.coverEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${cfg.color} ${cfg.textColor} mb-1 inline-block`}>
            {cfg.label}
          </span>
          <p className="text-sm font-medium text-foreground leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
            {post.title}
          </p>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
            <span>{formatDate(post.publishedAt)}</span>
            <span>·</span>
            <span className="flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5" />
              {post.readingTimeMin}分
            </span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
      </div>
    </Link>
  )
}