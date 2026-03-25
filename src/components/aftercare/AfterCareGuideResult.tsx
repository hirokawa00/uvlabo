"use client"

import { useState } from "react"
import type { AfterCareGuide, CarePhase, CareStep } from "@/lib/aftercare/types"
import { BURN_LEVEL_LABEL, AREA_LABEL } from "@/lib/aftercare/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, RefreshCw, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  guide: AfterCareGuide
  onRetry: () => void
}

const PHASE_COLOR: Record<CarePhase, { bg: string; text: string; border: string; badge: string }> = {
  tonight:    { bg: "bg-orange-50",  text: "text-orange-800", border: "border-orange-200", badge: "bg-orange-100 text-orange-800" },
  day1_3:     { bg: "bg-amber-50",   text: "text-amber-800",  border: "border-amber-200",  badge: "bg-amber-100 text-amber-800"  },
  day4_plus:  { bg: "bg-emerald-50", text: "text-emerald-800",border: "border-emerald-200",badge: "bg-emerald-100 text-emerald-800" },
}

const PHASE_ICON: Record<CarePhase, string> = {
  tonight:   "🌙",
  day1_3:    "🌤️",
  day4_plus: "✨",
}

export function AfterCareGuideResult({ guide, onRetry }: Props) {
  const [openPhase, setOpenPhase] = useState<CarePhase>("tonight")

  return (
    <div className="space-y-4">
      {/* 緊急度メッセージ */}
      <div className={cn(
        "rounded-xl px-4 py-3.5 border",
        guide.shouldSeeDoctor
          ? "bg-red-50 border-red-200"
          : "bg-orange-50 border-orange-200"
      )}>
        <p className={cn(
          "text-sm leading-relaxed",
          guide.shouldSeeDoctor ? "text-red-800" : "text-orange-900"
        )}>
          {guide.urgencyMessage}
        </p>
      </div>

      {/* 入力サマリー */}
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="secondary" className="text-xs">
          {BURN_LEVEL_LABEL[guide.input.burnLevel]}
        </Badge>
        {guide.input.areas.map((a) => (
          <Badge key={a} variant="secondary" className="text-xs">
            {AREA_LABEL[a]}
          </Badge>
        ))}
      </div>

      {/* 受診推奨バナー */}
      {guide.shouldSeeDoctor && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
          <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800 mb-0.5">皮膚科への受診を推奨します</p>
            <p className="text-xs text-red-700 leading-relaxed">
              重度の日焼けや水ぶくれがある場合は、自己処置より先に皮膚科を受診してください。
              適切な処置で回復を早めることができます。
            </p>
          </div>
        </div>
      )}

      {/* フェーズ別アコーディオン */}
      <div>
        <p className="text-xs font-medium text-muted-foreground tracking-wider mb-2.5">
          ケアスケジュール
        </p>
        <div className="space-y-2">
          {guide.phases.map(({ phase, label, steps }) => {
            const color = PHASE_COLOR[phase]
            const isOpen = openPhase === phase
            return (
              <div key={phase} className={cn("rounded-xl border overflow-hidden", color.border)}>
                {/* アコーディオンヘッダー */}
                <button
                  type="button"
                  onClick={() => setOpenPhase(isOpen ? phase : phase)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3.5 text-left",
                    isOpen ? color.bg : "bg-card hover:bg-secondary/50"
                  )}
                >
                  <span className="text-lg leading-none">{PHASE_ICON[phase]}</span>
                  <span className={cn(
                    "text-sm font-medium flex-1",
                    isOpen ? color.text : "text-foreground"
                  )}>
                    {label}
                  </span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full", color.badge)}>
                    {steps.length}ステップ
                  </span>
                  {isOpen
                    ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  }
                </button>

                {/* ステップ一覧 */}
                {isOpen && (
                  <div className={cn("border-t", color.border)}>
                    {steps.map((step, idx) => (
                      <CareStepRow
                        key={step.id}
                        step={step}
                        index={idx}
                        total={steps.length}
                        accentColor={phase === "tonight" ? "orange" : phase === "day1_3" ? "amber" : "emerald"}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* やってはいけないこと */}
      <Card className="border-red-100">
        <CardContent className="pt-4 pb-4">
          <p className="text-xs font-medium text-red-700 mb-2.5">
            ⛔ やってはいけないこと
          </p>
          <ul className="space-y-1.5">
            {guide.avoidList.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                <span className="text-red-400 mt-0.5 shrink-0">✕</span>
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* おすすめ製品 */}
      <div>
        <p className="text-xs font-medium text-muted-foreground tracking-wider mb-2.5">
          ケアにおすすめの製品
        </p>
        <div className="space-y-2.5">
          {guide.recommendedProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card"
            >
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl shrink-0">
                {product.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground mb-0.5">{product.useCase}</p>
                <p className="text-sm font-medium leading-tight truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.brand}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-sm font-medium">¥{product.price.toLocaleString()}</span>
                <a
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
                >
                  見る <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* アフィリエイト表記 */}
      <p className="text-[10px] text-muted-foreground">
        ※ 本ページにはアフィリエイトリンクが含まれています。医療的な判断は必ず専門家にご相談ください。
      </p>

      {/* やり直し */}
      <button
        type="button"
        onClick={onRetry}
        className="w-full py-3 rounded-xl border border-border text-sm text-muted-foreground flex items-center justify-center gap-1.5 hover:bg-secondary transition-colors"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        もう一度最初から
      </button>
    </div>
  )
}

// ─── ケアステップ1行 ─────────────────────────────────────────────

type CareStepRowProps = {
  step: CareStep
  index: number
  total: number
  accentColor: "orange" | "amber" | "emerald"
}

function CareStepRow({ step, index, total, accentColor }: CareStepRowProps) {
  const [expanded, setExpanded] = useState(index === 0)

  const lineColor = {
    orange:  "bg-orange-300",
    amber:   "bg-amber-300",
    emerald: "bg-emerald-400",
  }[accentColor]

  const numColor = {
    orange:  "bg-orange-500 text-white",
    amber:   "bg-amber-500 text-white",
    emerald: "bg-emerald-600 text-white",
  }[accentColor]

  return (
    <div className="px-4 py-3 border-b border-border/50 last:border-0">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-start gap-3 w-full text-left"
      >
        {/* ステップ番号 + 縦線 */}
        <div className="flex flex-col items-center shrink-0">
          <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium", numColor)}>
            {step.order}
          </div>
          {index < total - 1 && (
            <div className={cn("w-0.5 h-4 mt-1", lineColor)} />
          )}
        </div>

        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium leading-tight">{step.title}</p>
            <div className="flex items-center gap-1.5 shrink-0">
              {step.duration && (
                <span className="text-[10px] text-muted-foreground">{step.duration}</span>
              )}
              {expanded
                ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              }
            </div>
          </div>
        </div>
      </button>

      {/* 展開コンテンツ */}
      {expanded && (
        <div className="mt-2 ml-9 space-y-2">
          <p className="text-xs text-muted-foreground leading-relaxed">{step.detail}</p>
          {step.caution && (
            <div className="flex items-start gap-1.5 p-2 rounded-lg bg-amber-50 border border-amber-100">
              <span className="text-amber-500 text-xs shrink-0 mt-0.5">⚠</span>
              <p className="text-xs text-amber-800">{step.caution}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}