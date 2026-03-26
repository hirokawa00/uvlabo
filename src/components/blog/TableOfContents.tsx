"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { List } from "lucide-react"

export type TocItem = {
  id: string
  text: string
  level: 2 | 3
}

type Props = {
  items: TocItem[]
}

export function TableOfContents({ items }: Props) {
  const [activeId, setActiveId] = useState<string>("")
  const [isOpen, setIsOpen] = useState(false)  // モバイル用折りたたみ
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (items.length === 0) return

    // 各見出しの表示状態を追跡
    const headingMap = new Map<string, boolean>()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          headingMap.set(entry.target.id, entry.isIntersecting)
        })

        // 現在表示中の見出しのうち最上位のものをアクティブに
        const visible = items
          .map((item) => item.id)
          .filter((id) => headingMap.get(id))

        if (visible.length > 0) {
          setActiveId(visible[0])
        }
      },
      {
        // 上から20%〜80%の範囲に入ったときに検知
        rootMargin: "-10% 0px -60% 0px",
        threshold: 0,
      }
    )

    // 全見出し要素を監視対象に追加
    items.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [items])

  if (items.length < 2) return null

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    // ヘッダー固定分のオフセット
    const offset = 70
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: "smooth" })
    setActiveId(id)
    setIsOpen(false)  // モバイルでは閉じる
  }

  return (
    <nav
      aria-label="目次"
      className="rounded-2xl border border-border bg-secondary/30 overflow-hidden"
    >
      {/* ヘッダー（モバイルでタップして開閉） */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left md:cursor-default"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          <List className="w-4 h-4 text-emerald-600" />
          目次
        </span>
        <span className="text-xs text-muted-foreground md:hidden">
          {isOpen ? "閉じる ▲" : "開く ▼"}
        </span>
      </button>

      {/* 目次リスト */}
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        "md:block",                           // PCは常に表示
        isOpen ? "max-h-[500px]" : "max-h-0 md:max-h-none"  // モバイルは折りたたみ
      )}>
        <ol className="px-4 pb-4 space-y-0.5">
          {items.map((item, i) => {
            const isActive = activeId === item.id
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleClick(item.id)}
                  className={cn(
                    "w-full text-left text-sm py-1.5 px-3 rounded-lg transition-all duration-200",
                    "flex items-start gap-2 leading-snug",
                    item.level === 3 && "pl-6 text-xs",
                    isActive
                      ? "bg-emerald-100 text-emerald-800 font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {/* アクティブインジケーター */}
                  <span className={cn(
                    "mt-1.5 w-1 h-1 rounded-full shrink-0 transition-all",
                    isActive
                      ? "bg-emerald-600 scale-125"
                      : item.level === 2
                        ? "bg-muted-foreground/40"
                        : "bg-muted-foreground/20"
                  )} />
                  <span>
                    <span className="text-[10px] text-muted-foreground/60 mr-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.text}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}

// ── 記事本文からTocItemを抽出するユーティリティ ──────────────────
// サーバーサイドでHTMLをパースして目次を生成する

export function extractTocItems(htmlContent?: string): TocItem[] {
  if (!htmlContent || typeof window !== "undefined") return []

  // 簡易的なh2/h3の抽出（rehype-slugがid付与済みの前提）
  const h2Regex = /<h2[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g
  const h3Regex = /<h3[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h3>/g

  const items: (TocItem & { index: number })[] = []

  let match: RegExpExecArray | null

  while ((match = h2Regex.exec(htmlContent)) !== null) {
    items.push({
      id: match[1],
      text: match[2].replace(/<[^>]+>/g, ""),
      level: 2,
      index: match.index,
    })
  }

  while ((match = h3Regex.exec(htmlContent)) !== null) {
    items.push({
      id: match[1],
      text: match[2].replace(/<[^>]+>/g, ""),
      level: 3,
      index: match.index,
    })
  }

  return items.sort((a, b) => a.index - b.index).map(({ index, ...item }) => item)
}