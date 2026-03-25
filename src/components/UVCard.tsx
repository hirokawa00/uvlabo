"use client"

import { useUVData, uvIndexToColor, uvIndexToBarWidth } from "@/hooks/useUVData"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, MapPin, AlertTriangle } from "lucide-react"

type Props = {
  spf?: number
}

export function UVCard({ spf = 50 }: Props) {
  const { state, refresh } = useUVData(spf)

  // ── ローディング状態 ───────────────────────────────────────────
  if (state.status === "idle" || state.status === "locating") {
    return (
      <Card>
        <CardContent className="pt-5 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (state.status === "loading") {
    return (
      <Card>
        <CardContent className="pt-5 space-y-3">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" /> 位置情報を取得中...
          </p>
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    )
  }

  // ── エラー状態 ────────────────────────────────────────────────
  if (state.status === "error") {
    return (
      <Card className="border-orange-200">
        <CardContent className="pt-5">
          <div className="flex items-start gap-2 text-orange-700 mb-3">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <p className="text-sm">{state.message}</p>
          </div>
          <Button variant="outline" size="sm" onClick={refresh} className="w-full">
            <RefreshCw className="w-3 h-3 mr-1" /> 再試行
          </Button>
        </CardContent>
      </Card>
    )
  }

  // ── 成功状態 ──────────────────────────────────────────────────
  const { data } = state
  const colors = uvIndexToColor(data.currentUV)

  return (
    <div className="space-y-3">
      {/* メインUVカード */}
      <Card className={`border ${colors.border}`}>
        <CardContent className="pt-4 pb-4">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {data.areaName}
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={refresh}
              aria-label="更新"
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>

          {/* UV指数メイン表示 */}
          <div className="flex items-end gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">現在のUV指数</p>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-5xl font-semibold tabular-nums ${colors.text}`}>
                  {data.currentUV}
                </span>
                <Badge
                  variant="secondary"
                  className={`text-xs ${colors.text} ${colors.bg}`}
                >
                  {data.currentLevel}
                </Badge>
              </div>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs text-muted-foreground">今日のピーク</p>
              <p className="text-xl font-semibold tabular-nums">
                {data.peakUV}
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  ({data.peakTime})
                </span>
              </p>
            </div>
          </div>

          {/* アドバイスバッジ */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            <Badge variant="outline" className="text-xs">
              推奨SPF {data.spfRecommended}{data.spfRecommended === 50 ? "+" : ""}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {data.reapplyIntervalMin}分ごとに塗り直し
            </Badge>
            <Badge variant="outline" className="text-xs">
              明日のピーク {data.tomorrowPeakUV}
            </Badge>
          </div>

          {/* 時間別予報バー */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">時間別UV予報</p>
            <div className="grid grid-cols-7 gap-1">
              {data.hourlyForecast.map((h) => {
                const c = uvIndexToColor(h.uvIndex)
                const barW = uvIndexToBarWidth(h.uvIndex)
                return (
                  <div key={h.time} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">{h.time.slice(0, 2)}時</span>
                    {/* 縦バー */}
                    <div className="relative w-full h-12 bg-secondary rounded-sm overflow-hidden flex items-end">
                      <div
                        className={`w-full rounded-sm transition-all ${c.bg}`}
                        style={{ height: `${barW}%` }}
                      />
                    </div>
                    <span className={`text-[11px] font-medium tabular-nums ${c.text}`}>
                      {h.uvIndex}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 注意書き */}
      <p className="text-[10px] text-muted-foreground px-1">
        ※ UV指数は気象庁の天気予報データをもとに推定した値です。
        実際の値と異なる場合があります。
      </p>
    </div>
  )
}