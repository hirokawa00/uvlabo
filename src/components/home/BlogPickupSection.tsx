import { BookOpen, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import { BLOG_POSTS, CATEGORY_CONFIG } from "@/lib/blog";

const PICKUP_POSTS = BLOG_POSTS.slice(0, 3);

export function BlogPickupSection() {
  return (
    <div className="pt-2 pb-5">
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
          const cfg = CATEGORY_CONFIG[post.category];

          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-border hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-linear-to-br ${post.coverColor} flex items-center justify-center text-xl shrink-0`}
              >
                {post.coverEmoji}
              </div>

              <div className="flex-1 min-w-0">
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${cfg.color} ${cfg.textColor} inline-block mb-0.5`}
                >
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
          );
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
  );
}
