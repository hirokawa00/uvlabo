import Link from "next/link"
import { ChevronRight, Clock } from "lucide-react"
import { BLOG_POSTS, CATEGORY_CONFIG, formatDate, type BlogPost } from "@/lib/blog"

// ── 関連記事（同カテゴリ優先）────────────────────────────────────

type RelatedPostsProps = {
  currentSlug: string
  currentCategory: BlogPost["category"]
  max?: number
}

export function RelatedPosts({ currentSlug, currentCategory, max = 3 }: RelatedPostsProps) {
  // 同カテゴリを優先し、足りなければ他カテゴリで補完
  const sameCategory = BLOG_POSTS.filter(
    (p) => p.slug !== currentSlug && p.category === currentCategory
  )
  const others = BLOG_POSTS.filter(
    (p) => p.slug !== currentSlug && p.category !== currentCategory
  )
  const related = [...sameCategory, ...others].slice(0, max)

  if (related.length === 0) return null

  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground tracking-wider mb-3 uppercase">
        関連記事
      </p>
      <div className="space-y-2.5">
        {related.map((post) => {
          const cfg = CATEGORY_CONFIG[post.category]
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-border hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group"
            >
              <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${post.coverColor} flex items-center justify-center text-xl shrink-0`}>
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
                  {post.readingTimeMin}分
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// ── 前の記事・次の記事ナビ ────────────────────────────────────────

type PrevNextNavProps = {
  currentSlug: string
}

export function PrevNextNav({ currentSlug }: PrevNextNavProps) {
  const idx = BLOG_POSTS.findIndex((p) => p.slug === currentSlug)
  const prev = idx < BLOG_POSTS.length - 1 ? BLOG_POSTS[idx + 1] : null
  const next = idx > 0 ? BLOG_POSTS[idx - 1] : null

  if (!prev && !next) return null

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* 前の記事 */}
      <div>
        {prev ? (
          <Link
            href={`/blog/${prev.slug}`}
            className="flex flex-col gap-1.5 p-3.5 rounded-xl border border-border hover:border-emerald-300 hover:bg-emerald-50/30 transition-all h-full group"
          >
            <span className="text-[10px] text-muted-foreground">← 前の記事</span>
            <span className="text-xs font-medium text-foreground group-hover:text-emerald-700 transition-colors line-clamp-3 leading-snug">
              {prev.title}
            </span>
          </Link>
        ) : <div />}
      </div>

      {/* 次の記事 */}
      <div>
        {next ? (
          <Link
            href={`/blog/${next.slug}`}
            className="flex flex-col gap-1.5 p-3.5 rounded-xl border border-border hover:border-emerald-300 hover:bg-emerald-50/30 transition-all h-full text-right group"
          >
            <span className="text-[10px] text-muted-foreground">次の記事 →</span>
            <span className="text-xs font-medium text-foreground group-hover:text-emerald-700 transition-colors line-clamp-3 leading-snug">
              {next.title}
            </span>
          </Link>
        ) : <div />}
      </div>
    </div>
  )
}

// ── カテゴリ内の記事一覧CTA ──────────────────────────────────────

type CategoryNavProps = {
  category: BlogPost["category"]
  currentSlug: string
}

export function CategoryNav({ category, currentSlug }: CategoryNavProps) {
  const cfg = CATEGORY_CONFIG[category]
  const posts = BLOG_POSTS.filter(
    (p) => p.category === category && p.slug !== currentSlug
  )

  if (posts.length === 0) return null

  return (
    <div className={`p-4 rounded-2xl border ${cfg.color.replace("bg-", "border-").replace("100", "200")} bg-linear-to-br ${cfg.color}/30 to-transparent`}>
      <p className="text-xs font-bold tracking-widest mb-3 flex items-center gap-1.5" style={{ color: "inherit" }}>
        <span>{cfg.emoji}</span>
        <span className={cfg.textColor}>{cfg.label}の記事をもっと読む</span>
      </p>
      <div className="space-y-1.5">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5"
          >
            <ChevronRight className="w-3 h-3 shrink-0 text-emerald-500" />
            <span className="line-clamp-1">{post.title}</span>
          </Link>
        ))}
      </div>
      <Link
        href={`/blog/category/${category}`}
        className={`mt-3 inline-flex items-center text-xs font-medium ${cfg.textColor} hover:opacity-80 transition-opacity`}
      >
        すべて見る →
      </Link>
    </div>
  )
}

// ── サイドバーのツールCTA ─────────────────────────────────────────

export function SidebarToolCTA() {
  return (
    <div className="p-5 rounded-2xl bg-linear-to-br from-emerald-50 to-teal-50 border border-emerald-200 sticky top-24">
      <p className="text-xs font-bold text-emerald-700 tracking-widest mb-2">☀️ UVlabo ツール</p>
      <p className="text-sm font-medium text-foreground mb-1.5">
        今日の日焼け止めを診断
      </p>
      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
        UV指数の確認・肌タイプ別の製品診断・日焼けあとのケアガイドが使えます。
      </p>
      <div className="space-y-2">
        {[
          { href: "/",              label: "UV指数を確認する",    emoji: "☀️" },
          { href: "/?tab=diagnosis", label: "日焼け止めを診断する", emoji: "🔍" },
          { href: "/?tab=aftercare", label: "事後ケアガイド",      emoji: "🌊" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50 transition-colors"
          >
            <span>{item.emoji}</span>
            {item.label}
            <ChevronRight className="w-3 h-3 ml-auto" />
          </Link>
        ))}
      </div>
    </div>
  )
}