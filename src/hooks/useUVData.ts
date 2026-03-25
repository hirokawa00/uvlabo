"use client"

import { useState, useEffect, useCallback } from "react"
import type { UVResponse } from "@/lib/jma/types"

type GeolocationState =
  | { status: "idle" }
  | { status: "locating" }
  | { status: "loading"; lat: number; lng: number }
  | { status: "success"; data: UVResponse; lat: number; lng: number }
  | { status: "error"; message: string }

/**
 * ブラウザのGeolocation API → Hono APIへリクエスト → UVデータを返すフック
 *
 * @param spf 使用中のSPF値（塗り直し計算に使用）
 */
export function useUVData(spf = 50) {
  const [state, setState] = useState<GeolocationState>({ status: "idle" })

  const fetchUVData = useCallback(
    async (lat: number, lng: number) => {
      setState({ status: "loading", lat, lng })
      try {
        const res = await fetch(
          `/api/uv?lat=${lat}&lng=${lng}&spf=${spf}`
        )
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error((err as { error?: string }).error ?? "データ取得に失敗しました")
        }
        const data: UVResponse = await res.json()
        setState({ status: "success", data, lat, lng })
      } catch (e) {
        setState({
          status: "error",
          message: e instanceof Error ? e.message : "不明なエラーが発生しました",
        })
      }
    },
    [spf]
  )

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({ status: "error", message: "位置情報がサポートされていません" })
      return
    }

    setState({ status: "locating" })

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchUVData(pos.coords.latitude, pos.coords.longitude)
      },
      (err) => {
        // 位置情報拒否時は東京のデフォルト座標にフォールバック
        console.warn("位置情報取得失敗、東京デフォルトを使用:", err.message)
        fetchUVData(35.6895, 139.6917)
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000, // 5分キャッシュ
      }
    )
  }, [fetchUVData])

  // マウント時に自動取得
  useEffect(() => {
    requestLocation()
  }, [requestLocation])

  return { state, refresh: requestLocation }
}

/** UV指数 → 表示用カラー (Tailwind クラス) */
export function uvIndexToColor(uv: number): {
  text: string
  bg: string
  border: string
} {
  if (uv <= 2) return { text: "text-green-700", bg: "bg-green-50", border: "border-green-300" }
  if (uv <= 5) return { text: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-300" }
  if (uv <= 7) return { text: "text-orange-600", bg: "bg-orange-50", border: "border-orange-300" }
  if (uv <= 10) return { text: "text-red-600", bg: "bg-red-50", border: "border-red-300" }
  return { text: "text-purple-700", bg: "bg-purple-50", border: "border-purple-300" }
}

/** UV指数 → バーの幅 (%) */
export function uvIndexToBarWidth(uv: number): number {
  return Math.min(Math.round((uv / 13) * 100), 100)
}