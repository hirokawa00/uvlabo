import type { UVLevel } from "./jma/types"

/**
 * 気象庁 weatherCode の先頭1桁で雲量カテゴリを判定し UV低減係数を返す
 *
 * 気象庁 weatherCode 体系:
 *   1xx = 晴れ系, 2xx = くもり系, 3xx = 雨系, 4xx = 雪系
 *
 * 参考: WHO UV Index scale
 *   0-2: Low, 3-5: Moderate, 6-7: High, 8-10: Very High, 11+: Extreme
 */

// 月別クリアスカイUV指数の基準値 (東京 lat≈35°N 相当)
// 出典: 環境省「紫外線環境保健マニュアル2020」を参考にした近似値
const MONTHLY_CLEAR_UV: Record<number, number> = {
  1: 2.0,
  2: 3.0,
  3: 5.0,
  4: 6.5,
  5: 8.0,
  6: 9.5,
  7: 11.0,
  8: 10.0,
  9: 7.5,
  10: 5.0,
  11: 3.0,
  12: 2.0,
}

// weatherCode先頭1桁 → 雲量による UV低減係数
const WEATHER_CODE_UV_FACTOR: Record<string, number> = {
  "1": 1.0,   // 晴れ（快晴〜晴れ）
  "2": 0.5,   // くもり
  "3": 0.25,  // 雨
  "4": 0.15,  // 雪
}

// 緯度による補正係数（緯度が低いほどUV強い）
function latitudeFactor(lat: number): number {
  // 35°N (東京) を基準1.0とし、沖縄(26°N)≈1.2、北海道(43°N)≈0.85
  return 1.0 + (35 - lat) * 0.02
}

// 時刻による正弦カーブ補正（正午をピークとする）
// hour: 0-23 (JST)
function solarFactor(hour: number): number {
  // 日本の日照時間: 6時〜18時を有効とする
  if (hour < 6 || hour > 18) return 0
  const angle = ((hour - 6) / 12) * Math.PI
  return Math.sin(angle)
}

/**
 * UV指数を推定する
 *
 * @param weatherCode 気象庁の天気コード (3桁文字列)
 * @param month       月 (1-12)
 * @param hour        時 (0-23, JST)
 * @param lat         緯度
 */
export function estimateUVIndex(
  weatherCode: string,
  month: number,
  hour: number,
  lat: number
): number {
  const baseUV = MONTHLY_CLEAR_UV[month] ?? 5.0
  const weatherFactor = WEATHER_CODE_UV_FACTOR[weatherCode[0]] ?? 0.5
  const latFactor = latitudeFactor(lat)
  const solar = solarFactor(hour)

  const uv = baseUV * weatherFactor * latFactor * solar
  return Math.round(uv * 10) / 10  // 小数第1位で丸め
}

/** UV指数 → レベル文字列 */
export function getUVLevel(uv: number): UVLevel {
  if (uv <= 2) return "低い"
  if (uv <= 5) return "中程度"
  if (uv <= 7) return "強い"
  if (uv <= 10) return "非常に強い"
  return "極端に強い"
}

/** UV指数 → 推奨SPF値 */
export function getRecommendedSPF(uv: number): number {
  if (uv <= 2) return 15
  if (uv <= 5) return 30
  if (uv <= 7) return 50
  return 50 // SPF50+
}

/**
 * UV指数と肌タイプから塗り直し推奨間隔(分)を計算
 *
 * 計算式: MED(最小紅斑量) / UV指数 × 60 の近似
 * 肌タイプ別MED (スキンタイプII=日本人平均相当)
 *
 * @param uvIndex UV指数
 * @param spf     使用するSPF値
 */
export function calcReapplyInterval(uvIndex: number, spf: number): number {
  if (uvIndex === 0) return 240 // 夜間など

  // MED(Skin Type II, 日本人平均) ≈ 200 J/m² 相当
  // UV強度は UV指数 × 25 mW/m² の近似
  // 基本時間 = MED / (UV強度 / 1000) ÷ 60 sec → 分に変換
  const baseMED = 200 // J/m²
  const uvIntensity = uvIndex * 25 // mW/m²
  const baseMinutes = (baseMED / (uvIntensity / 1000)) / 60

  // SPF補正（SPF値の約40-50%が実使用効果とする）
  const effectiveSPF = spf * 0.4
  const withSPF = Math.min(baseMinutes * effectiveSPF, 240) // 最大4時間

  return Math.round(withSPF / 30) * 30  // 30分単位で丸め
}