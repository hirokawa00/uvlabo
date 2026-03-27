import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { BLOG_POSTS, CATEGORY_CONFIG, getPostBySlug, formatDate } from "@/lib/blog"
import { Footer } from "@/components/Footer"
import { Breadcrumb } from "@/components/blog/Breadcrumb"
import { ShareButtons } from "@/components/blog/ShareButtons"
import { AutoTableOfContents } from "@/components/blog/AutoTableOfContents"
import {
  RelatedPosts,
  PrevNextNav,
  CategoryNav,
  SidebarToolCTA,
} from "@/components/blog/NavigationWidgets"
import { Clock, Calendar } from "lucide-react"

// ── MDXを静的にインポート（Webpackの静的解析に対応）─────────────
import SPF30VsSPF50 from "@/content/blog/spf30-vs-spf50.mdx"
import SensitiveSkinSunscreen from "@/content/blog/sensitive-skin-sunscreen-2025.mdx"
import PaValueExplained from "@/content/blog/pa-value-explained.mdx"
import SunburnAftercare from "@/content/blog/sunburn-aftercare-72hours.mdx"
// 新しい記事を追加するたびにここにimportを追加してください

const MDX_MAP: Record<string, React.ComponentType> = {
  "spf30-vs-spf50":                SPF30VsSPF50,
  "sensitive-skin-sunscreen-2025": SensitiveSkinSunscreen,
  "sunburn-aftercare-72hours":  SunburnAftercare,
  "pa-value-explained":  PaValueExplained,
}

// ─────────────────────────────────────────────────────────────────

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: "記事が見つかりません" }

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://uvlabo.com"
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      url: `${BASE_URL}/blog/${post.slug}`,
      tags: post.tags,
    },
    alternates: { canonical: `${BASE_URL}/blog/${post.slug}` },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const PostContent = MDX_MAP[slug]
  if (!PostContent) notFound()

  const cfg = CATEGORY_CONFIG[post.category]
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://uvlabo.com"
  const articleUrl = `${BASE_URL}/blog/${post.slug}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@type": "Organization", name: "UVlabo", url: BASE_URL },
    publisher: { "@type": "Organization", name: "UVlabo", url: BASE_URL },
    keywords: post.tags.join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ── ヘッダー ─────────────────────────────────────────── */}
      <header className="border-b border-border sticky top-0 z-20 bg-background/90 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium shrink-0">
            UV<span className="text-emerald-700">lab</span>o
          </Link>
          <div className="flex-1 mx-4 min-w-0">
            <Breadcrumb
              items={[
                { label: "コラム", href: "/blog" },
                { label: post.title },
              ]}
            />
          </div>
          <Link
            href="/"
            className="text-xs text-emerald-700 font-medium border border-emerald-300 px-2.5 py-1 rounded-lg hover:bg-emerald-50 transition-colors shrink-0 hidden sm:block"
          >
            ツールを使う
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <div className="flex gap-8">

          {/* ── メインカラム ────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* 記事ヘッダー */}
            <div className="mb-8">
              <Link
                href={`/blog/category/${post.category}`}
                className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium mb-4 ${cfg.color} ${cfg.textColor}`}
              >
                {cfg.emoji} {cfg.label}
              </Link>

              <h1 className="text-2xl font-bold text-foreground leading-snug mb-4 tracking-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(post.publishedAt)}
                  </span>
                  {post.updatedAt && (
                    <span>更新: {formatDate(post.updatedAt)}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    約{post.readingTimeMin}分
                  </span>
                </div>
                <ShareButtons title={post.title} url={articleUrl} />
              </div>

              <div className={`w-full rounded-2xl bg-linear-to-br ${post.coverColor} py-12 flex items-center justify-center mb-6`}>
                <span className="text-7xl">{post.coverEmoji}</span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed bg-secondary/50 rounded-xl px-4 py-4 border border-border">
                {post.description}
              </p>
            </div>

            {/* 目次（モバイル） */}
            <div className="lg:hidden mb-8">
              <AutoTableOfContents articleId="article-body" />
            </div>

            {/* MDX本文 */}
            <article
              id="article-body"
              className="
                prose prose-sm max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-xl prose-h2:mt-12 prose-h2:mb-4
                prose-h2:pb-3 prose-h2:border-b-2 prose-h2:border-emerald-200
                prose-h3:text-base prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-[15px]
                prose-li:text-gray-700 prose-li:text-[15px]
                prose-strong:font-bold prose-strong:text-emerald-800
                prose-a:text-emerald-700 prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-emerald-300 prose-blockquote:py-1
                prose-img:rounded-2xl

                [&_h2]:scroll-mt-24
                [&_h3]:scroll-mt-24
                [&_.anchor-link]:ml-2
                [&_.anchor-link]:opacity-0
                [&_.anchor-link]:text-muted-foreground
                [&_.anchor-link]:transition-opacity
                [&_h2:hover_.anchor-link]:opacity-100
                [&_h3:hover_.anchor-link]:opacity-100
              "
            >
              <PostContent />
            </article>

            {/* 記事下シェア */}
            <div className="mt-10 pt-6 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">この記事は参考になりましたか？</p>
              <ShareButtons title={post.title} url={articleUrl} />
            </div>

            {/* タグ */}
            <div className="mt-6 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-secondary border border-border text-muted-foreground">
                  #{tag}
                </span>
              ))}
            </div>

            {/* 前後ナビ */}
            <div className="mt-8">
              <PrevNextNav currentSlug={slug} />
            </div>

            {/* カテゴリナビ */}
            <div className="mt-6">
              <CategoryNav category={post.category} currentSlug={slug} />
            </div>

            {/* 関連記事 */}
            <div className="mt-8">
              <RelatedPosts currentSlug={slug} currentCategory={post.category} />
            </div>

            <div className="mt-8 text-center">
              <Link href="/blog" className="text-sm text-emerald-700 hover:text-emerald-800 transition-colors">
                ← コラム一覧へ
              </Link>
            </div>
          </div>

          {/* ── サイドバー（PC） ─────────────────────────── */}
          <aside className="w-72 shrink-0 hidden lg:block">
            <div className="sticky top-22 space-y-6">
              <AutoTableOfContents articleId="article-body" />
              <SidebarToolCTA />
            </div>
          </aside>
        </div>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  )
}