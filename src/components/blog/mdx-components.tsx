import type { MDXComponents } from "mdx/types"
import Link from "next/link"
import { cn } from "@/lib/utils"

// ── アフィリエイトリンクコンポーネント ───────────────────────────
type ProductCardProps = {
  name: string
  brand: string
  price: string
  tags?: string
  href: string
  emoji?: string
  rank?: number
  reason?: string
}

export function ProductCard({
  name, brand, price, tags, href, emoji = "🧴", rank, reason
}: ProductCardProps) {
  const tagList = tags?.split(",").map((t) => t.trim()) ?? []
  return (
    <div className={`
      not-prose my-4 p-4 rounded-2xl border bg-white
      ${rank === 1 ? "border-emerald-400 shadow-sm" : "border-gray-200"}
    `}>
      <div className="flex gap-3 items-start">
        <div className={`
          w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0
          ${rank === 1 ? "bg-emerald-50" : "bg-gray-50"}
        `}>
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          {rank === 1 && (
            <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium mb-1">
              No.1 おすすめ
            </span>
          )}
          {rank && rank > 1 && (
            <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium mb-1">
              No.{rank}
            </span>
          )}
          <p className="font-medium text-sm text-gray-900 leading-tight">{name}</p>
          <p className="text-xs text-gray-500 mb-2">{brand}</p>
          {reason && (
            <p className="text-xs text-emerald-700 mb-2">✓ {reason}</p>
          )}
          {tagList.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {tagList.map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900">{price}</span>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-medium hover:bg-emerald-800 transition-colors"
            >
              Amazonで見る →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── ポイントボックス ──────────────────────────────────────────────
export function PointBox({ children, title = "POINT" }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="not-prose my-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
      <p className="text-xs font-bold text-emerald-700 tracking-widest mb-2">{title}</p>
      <div className="text-sm text-emerald-900 leading-relaxed">{children}</div>
    </div>
  )
}

// ── 警告ボックス ──────────────────────────────────────────────────
export function WarnBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-6 p-5 rounded-2xl bg-amber-50 border border-amber-200">
      <p className="text-xs font-bold text-amber-700 tracking-widest mb-2">⚠ 注意</p>
      <div className="text-sm text-amber-900 leading-relaxed">{children}</div>
    </div>
  )
}

// ── チェックリスト ────────────────────────────────────────────────
export function CheckList({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-4 space-y-2">
      {children}
    </div>
  )
}

export function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <span className="mt-0.5 w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-[10px] text-emerald-700">✓</span>
      <span className="text-gray-700 leading-relaxed">{children}</span>
    </div>
  )
}

// ── ツールへのCTAボックス ─────────────────────────────────────────
export function ToolCTA({ title, description, href, label }: {
  title: string
  description: string
  href: string
  label: string
}) {
  return (
    <div className="not-prose my-8 p-5 rounded-2xl bg-linear-to-br from-emerald-50 to-teal-50 border border-emerald-200">
      <p className="text-xs font-bold text-emerald-700 tracking-widest mb-1.5">☀️ UVlabo ツール</p>
      <p className="font-medium text-gray-900 mb-1">{title}</p>
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{description}</p>
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 transition-colors"
      >
        {label} →
      </Link>
    </div>
  )
}

// ── MDXコンポーネントのマッピング ─────────────────────────────────
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ProductCard,
    PointBox,
    WarnBox,
    CheckList,
    CheckItem,
    ToolCTA,

    h2: ({ className, children, id, ...props }) => (
      <h2
        id={id}
        className={cn(
          "text-xl font-bold text-gray-900 mt-12 mb-4 pb-3 border-b-2 border-emerald-200 flex items-center gap-2 scroll-mt-24 group",
          className
        )}
        {...props}
      >
        {children}
        {id && (
          <a
            href={`#${id}`}
            className="ml-2 text-sm text-muted-foreground no-underline opacity-0 transition-opacity group-hover:opacity-100"
            aria-label="見出しへのリンク"
          >
            #
          </a>
        )}
      </h2>
    ),

    h3: ({ className, children, id, ...props }) => (
      <h3
        id={id}
        className={cn(
          "text-base font-bold text-gray-900 mt-8 mb-3 pl-3 border-l-[3px] border-emerald-400 scroll-mt-24 group",
          className
        )}
        {...props}
      >
        {children}
        {id && (
          <a
            href={`#${id}`}
            className="ml-2 text-sm text-muted-foreground no-underline opacity-0 transition-opacity group-hover:opacity-100"
            aria-label="見出しへのリンク"
          >
            #
          </a>
        )}
      </h3>
    ),

    strong: ({ className, children, ...props }) => (
      <strong
        className={cn("font-bold text-emerald-800", className)}
        {...props}
      >
        {children}
      </strong>
    ),

    a: ({ href, className, children, ...props }) => (
      <a
        href={href}
        className={cn(
          "text-emerald-700 underline underline-offset-2 hover:text-emerald-800 transition-colors",
          className
        )}
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    ),

    blockquote: ({ className, children, ...props }) => (
      <blockquote
        className={cn(
          "my-6 pl-4 border-l-4 border-emerald-300 bg-emerald-50/50 py-3 pr-4 rounded-r-xl text-gray-700 text-sm leading-relaxed italic",
          className
        )}
        {...props}
      >
        {children}
      </blockquote>
    ),

    table: ({ className, children, ...props }) => (
      <div className="overflow-x-auto my-6">
        <table className={cn("w-full text-sm border-collapse", className)} {...props}>
          {children}
        </table>
      </div>
    ),

    th: ({ className, children, ...props }) => (
      <th
        className={cn("px-3 py-2.5 bg-emerald-700 text-white font-medium text-left text-xs", className)}
        {...props}
      >
        {children}
      </th>
    ),

    td: ({ className, children, ...props }) => (
      <td
        className={cn("px-3 py-2.5 border-b border-gray-100 text-gray-700", className)}
        {...props}
      >
        {children}
      </td>
    ),

    code: ({ className, children, ...props }) => (
      <code
        className={cn("px-1.5 py-0.5 rounded bg-gray-100 text-emerald-700 text-[13px] font-mono", className)}
        {...props}
      >
        {children}
      </code>
    ),

    ...components,
  }
}