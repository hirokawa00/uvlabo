"use client"

import type { DiagnosisResult } from "@/lib/diagnosis/types"
import {
  SKIN_TYPE_LABEL,
  SCENE_LABEL,
  MAKEUP_LABEL,
} from "@/lib/diagnosis/engine"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, RefreshCw, Bell } from "lucide-react"

type Props = {
  result: DiagnosisResult
  onRetry: () => void
}

export function DiagnosisResult({ result, onRetry }: Props) {
  const { input, recommended, skinAdvice, sceneAdvice, reapplyTip } = result

  return (
    <div className="space-y-4">
      {/* プロフィールサマリー */}
      <div className="bg-secondary/60 rounded-xl px-4 py-3">
        <p className="text-xs text-muted-foreground mb-1.5">あなたの診断プロフィール</p>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="text-xs">
            {SKIN_TYPE_LABEL[input.skinType]}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {SCENE_LABEL[input.scene]}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {MAKEUP_LABEL[input.makeupStyle]}
          </Badge>
          {input.uvIndex !== undefined && (
            <Badge variant="secondary" className="text-xs">
              今日のUV指数 {input.uvIndex}
            </Badge>
          )}
        </div>
      </div>

      {/* 製品リスト */}
      <div>
        <p className="text-xs font-medium text-muted-foreground tracking-wider mb-2.5">
          おすすめ製品 3選
        </p>
        <div className="space-y-2.5">
          {recommended.map((product) => (
            <Card
              key={product.id}
              className={
                product.rank === 1
                  ? "border-emerald-500 border-[1.5px]"
                  : "border-border"
              }
            >
              <CardContent className="pt-3.5 pb-3.5">
                <div className="flex gap-3">
                  {/* サムネイル */}
                  <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center text-2xl shrink-0 border border-border">
                    {product.emoji}
                  </div>

                  {/* 情報 */}
                  <div className="flex-1 min-w-0">
                    {/* バッジ */}
                    {product.rank === 1 && (
                      <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium mb-1">
                        編集部おすすめ No.1
                      </span>
                    )}

                    <p className="text-sm font-medium leading-tight truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground mb-1.5">
                      {product.brand}
                    </p>

                    {/* タグ */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {product.spf > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                          SPF{product.spf}{product.pa ? ` / PA${product.pa}` : ""}
                        </span>
                      )}
                      {product.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* マッチ理由 */}
                    <p className="text-[11px] text-emerald-700 mb-2.5">
                      ✓ {product.matchReason}
                    </p>

                    {/* 価格＋購入ボタン */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        ¥{product.price.toLocaleString()}
                      </span>
                      <a
                        href={product.affiliate[0].url}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-medium hover:bg-emerald-800 transition-colors"
                      >
                        Amazonで見る
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 塗り直しリマインダーCTA */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 items-start">
        <Bell className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-amber-900 mb-0.5">
            塗り直しリマインダー
          </p>
          <p className="text-xs text-amber-800 leading-relaxed">{reapplyTip}</p>
        </div>
      </div>

      {/* アドバイスセクション */}
      <div className="space-y-3">
        <AdviceCard title="肌タイプ別アドバイス" body={skinAdvice} />
        <AdviceCard title="シーン別のポイント" body={sceneAdvice} />
      </div>

      {/* アフィリエイト表記 */}
      <p className="text-[10px] text-muted-foreground">
        ※ 本ページにはアフィリエイトリンクが含まれています。
        掲載製品はスコアリングに基づく自動選定です。
      </p>

      {/* やり直しボタン */}
      <button
        type="button"
        onClick={onRetry}
        className="w-full py-3 rounded-xl border border-border text-sm text-muted-foreground flex items-center justify-center gap-1.5 hover:bg-secondary transition-colors"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        診断をやり直す
      </button>
    </div>
  )
}

// ─── アドバイスカード ────────────────────────────────────────────

function AdviceCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <p className="text-xs font-medium text-muted-foreground mb-1.5">{title}</p>
      <p className="text-sm leading-relaxed text-foreground">{body}</p>
    </div>
  )
}