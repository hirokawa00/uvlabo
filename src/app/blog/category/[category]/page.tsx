import { ChevronRight, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/blog/Breadcrumb";
import { Footer } from "@/components/Footer";
import {
  BLOG_POSTS,
  type BlogCategory,
  CATEGORY_CONFIG,
  formatDate,
  getPostsByCategory,
} from "@/lib/blog";

type Props = {
  params: Promise<{ category: string }>;
};

const VALID_CATEGORIES = Object.keys(CATEGORY_CONFIG) as BlogCategory[];

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (!VALID_CATEGORIES.includes(category as BlogCategory)) {
    return { title: "カテゴリが見つかりません" };
  }
  const cfg = CATEGORY_CONFIG[category as BlogCategory];
  return {
    title: `${cfg.label}の記事一覧`,
    description: `UVlaboの${cfg.label}に関するコラム一覧です。`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category as BlogCategory)) {
    notFound();
  }

  const cat = category as BlogCategory;
  const cfg = CATEGORY_CONFIG[cat];
  const posts = getPostsByCategory(cat);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ヘッダー */}
      <header className="border-b border-border sticky top-0 z-20 bg-background/90 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium shrink-0">
            UV<span className="text-emerald-700">lab</span>o
          </Link>
          <div className="flex-1 mx-4 min-w-0">
            <Breadcrumb
              items={[{ label: "コラム", href: "/blog" }, { label: cfg.label }]}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        {/* カテゴリヘッダー */}
        <div className="mb-8">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${cfg.color} ${cfg.textColor}`}
          >
            <span>{cfg.emoji}</span>
            {cfg.label}
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {cfg.label}の記事一覧
          </h1>
          <p className="text-sm text-muted-foreground">
            {posts.length}件の記事があります
          </p>
        </div>

        {/* 記事一覧 */}
        {posts.length > 0 ? (
          <div className="space-y-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-linear-to-br ${post.coverColor} flex items-center justify-center text-2xl shrink-0`}
                >
                  {post.coverEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug mb-1">
                    {post.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-1.5">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {post.readingTimeMin}分
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-4xl mb-4">📝</p>
            <p className="text-sm">このカテゴリの記事は近日公開予定です</p>
          </div>
        )}

        {/* 他カテゴリへの導線 */}
        <div className="mt-10 pt-6 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground tracking-wider mb-3">
            他のカテゴリを見る
          </p>
          <div className="flex flex-wrap gap-2">
            {VALID_CATEGORIES.filter((c) => c !== cat).map((c) => {
              const c_cfg = CATEGORY_CONFIG[c];
              const count = BLOG_POSTS.filter((p) => p.category === c).length;
              if (count === 0) return null;
              return (
                <Link
                  key={c}
                  href={`/blog/category/${c}`}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-opacity hover:opacity-80 ${c_cfg.color} ${c_cfg.textColor}`}
                >
                  {c_cfg.emoji} {c_cfg.label}
                  <span className="opacity-60">({count})</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/blog"
            className="text-sm text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            ← コラム一覧へ
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
