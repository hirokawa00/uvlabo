import { Hono } from "hono"
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

const app = new Hono().basePath("/api")

app.use("*", cors())

// ─── GET /api/uv ─────────────────────────────────────────────────
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

    const office = findNearestOffice(lat, lng)
    const jmaUrl = `https://www.jma.go.jp/bosai/forecast/data/forecast/${office.code}.json`

    let forecastData: JMAForecastResponse
    try {
      const res = await fetch(jmaUrl, {
        headers: {
          "User-Agent": "UVlab/1.0 (personal weather app)",
          "Cache-Control": "max-age=3600",
        },
      })
      if (!res.ok) return c.json({ error: "気象庁APIの取得に失敗しました" }, 502)
      forecastData = await res.json()
    } catch {
      return c.json({ error: "気象庁APIへの接続に失敗しました" }, 502)
    }

    const timeSeries0 = forecastData[0]?.timeSeries?.[0]
    const timeSeries1 = forecastData[0]?.timeSeries?.[1]

    if (!timeSeries0?.areas?.[0]) {
      return c.json({ error: "予報データの解析に失敗しました" }, 500)
    }

    const area = timeSeries0.areas[0]
    const popArea = timeSeries1?.areas?.[0]

    const now = new Date()
    const month = now.getMonth() + 1
    const reportDatetime = forecastData[0].reportDatetime
    const forecastHours = [6, 8, 10, 12, 14, 16, 18]
    const weatherCode = area.weatherCodes?.[0] ?? "200"
    const weatherText = area.weathers?.[0] ?? "不明"

    const hourlyForecast: HourlyUVForecast[] = forecastHours.map((hour) => {
      const uv = estimateUVIndex(weatherCode, month, hour, lat)
      const pop = popArea
        ? (parseInt(popArea.pops?.[hour >= 12 ? 1 : 0] ?? "0") || 0)
        : 0
      const rainReduction = pop > 70 ? 0.5 : pop > 40 ? 0.8 : 1.0
      const adjustedUV = Math.round(uv * rainReduction * 10) / 10
      return {
        time: `${String(hour).padStart(2, "0")}:00`,
        uvIndex: adjustedUV,
        uvLevel: getUVLevel(adjustedUV),
        weatherCode,
        weather: weatherText,
        pop,
      }
    })

    const currentHour = now.getHours()
    const currentUV = estimateUVIndex(weatherCode, month, currentHour, lat)
    const peakEntry = hourlyForecast.reduce((a, b) =>
      a.uvIndex > b.uvIndex ? a : b
    )
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

// ─── GET /api/health ─────────────────────────────────────────────
app.get("/health", (c) => c.json({ status: "ok" }))

// ── Next.js App Router + Cloudflare Workers 両対応のエクスポート ──
// hono/vercel や hono/cloudflare-workers の handle は使わず
// app.fetch を直接渡す（どの環境でも動作する）
export const GET = (req: Request) => app.fetch(req)
export const POST = (req: Request) => app.fetch(req)