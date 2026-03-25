import { Hono } from "hono"
import { handle } from "hono/vercel"
import { cors } from "hono/cors"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import { findNearestOffice } from "@/lib/jma/area-codes"
import {
  estimateUVIndex,
  getUVLevel,
  getRecommendedSPF,
  calcReapplyInterval,
} from "@/lib/uv-calculator"
import type {
  JMAForecastResponse,
  HourlyUVForecast,
  UVResponse,
} from "@/lib/jma/types"

export const runtime = "edge"

const app = new Hono().basePath("/api")

app.use("*", cors())

// ─── GET /api/uv?lat=35.7&lng=139.7 ────────────────────────────────────────
const uvQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  spf: z.coerce.number().min(15).max(100).optional().default(50),
})

app.get(
  "/uv",
  zValidator("query", uvQuerySchema),
  async (c) => {
    const { lat, lng, spf } = c.req.valid("query")

    // 1. 最近傍の気象庁オフィスを特定
    const office = findNearestOffice(lat, lng)

    // 2. 気象庁APIから天気予報を取得
    const jmaUrl = `https://www.jma.go.jp/bosai/forecast/data/forecast/${office.code}.json`

    let forecastData: JMAForecastResponse
    try {
      const res = await fetch(jmaUrl, {
        headers: { "User-Agent": "UVlab/1.0 (personal weather app)" },
        // Edge環境でのキャッシュ: 1時間
        next: { revalidate: 3600 },
      } as RequestInit)

      if (!res.ok) {
        return c.json({ error: "気象庁APIの取得に失敗しました" }, 502)
      }
      forecastData = await res.json()
    } catch {
      return c.json({ error: "気象庁APIへの接続に失敗しました" }, 502)
    }

    // 3. timeSeries[0] = 天気コード・天気概況
    const timeSeries0 = forecastData[0]?.timeSeries?.[0]
    const timeSeries1 = forecastData[0]?.timeSeries?.[1] // 降水確率

    if (!timeSeries0?.areas?.[0]) {
      return c.json({ error: "予報データの解析に失敗しました" }, 500)
    }

    const area = timeSeries0.areas[0]
    const popArea = timeSeries1?.areas?.[0]

    // 4. 時間別UV推定を生成
    // 気象庁の予報は6時間区切りが基本のため、1時間単位に展開する
    const now = new Date()
    const month = now.getMonth() + 1  // 1-12
    const reportDatetime = forecastData[0].reportDatetime

    const hourlyForecast: HourlyUVForecast[] = []

    // 当日 6:00〜18:00 の時間別予報を生成
    const forecastHours = [6, 8, 10, 12, 14, 16, 18]
    const weatherCode = area.weatherCodes?.[0] ?? "200"  // 今日の天気コード
    const weatherText = area.weathers?.[0] ?? "不明"

    for (const hour of forecastHours) {
      const uv = estimateUVIndex(weatherCode, month, hour, lat)
      const pop = popArea
        ? (parseInt(popArea.pops?.[hour >= 12 ? 1 : 0] ?? "0") || 0)
        : 0

      // 雨の確率が高い場合はUVをさらに低減
      const rainReduction = pop > 70 ? 0.5 : pop > 40 ? 0.8 : 1.0

      const adjustedUV = Math.round(uv * rainReduction * 10) / 10

      hourlyForecast.push({
        time: `${String(hour).padStart(2, "0")}:00`,
        uvIndex: adjustedUV,
        uvLevel: getUVLevel(adjustedUV),
        weatherCode,
        weather: weatherText,
        pop,
      })
    }

    // 5. 現在時刻のUV・ピーク値を計算
    const currentHour = now.getHours()
    const currentUV = estimateUVIndex(weatherCode, month, currentHour, lat)
    const peakEntry = hourlyForecast.reduce((a, b) =>
      a.uvIndex > b.uvIndex ? a : b
    )

    // 6. 明日のピークUV推定（今日と同じ天気コードで近似）
    const tomorrowWeatherCode = area.weatherCodes?.[1] ?? weatherCode
    const tomorrowPeakUV = estimateUVIndex(tomorrowWeatherCode, month, 12, lat)

    const response: UVResponse = {
      areaName: area.area.name,
      reportDatetime,
      currentUV: Math.round(currentUV * 10) / 10,
      currentLevel: getUVLevel(currentUV),
      peakUV: peakEntry.uvIndex,
      peakTime: peakEntry.time,
      reapplyIntervalMin: calcReapplyInterval(peakEntry.uvIndex, spf),
      spfRecommended: getRecommendedSPF(currentUV),
      hourlyForecast,
      tomorrowPeakUV: Math.round(tomorrowPeakUV * 10) / 10,
    }

    return c.json(response)
  }
)

// ─── GET /api/health ─────────────────────────────────────────────────────────
app.get("/health", (c) => c.json({ status: "ok" }))

export const GET = handle(app)
export const POST = handle(app)