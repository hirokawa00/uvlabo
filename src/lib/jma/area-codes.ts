import type { OfficeEntry } from "./types"

// 各都道府県の代表座標と気象庁オフィスコード
// 出典: 気象庁 area.json より抽出
export const JMA_OFFICES: OfficeEntry[] = [
  { code: "011000", name: "宗谷地方", lat: 45.4, lng: 141.7 },
  { code: "012000", name: "上川・留萌地方", lat: 43.8, lng: 142.4 },
  { code: "013000", name: "網走・北見・紋別地方", lat: 44.0, lng: 143.9 },
  { code: "014030", name: "釧路・根室地方", lat: 43.0, lng: 144.4 },
  { code: "014100", name: "十勝地方", lat: 42.9, lng: 143.2 },
  { code: "015000", name: "胆振・日高地方", lat: 42.5, lng: 141.8 },
  { code: "016000", name: "石狩・空知・後志地方", lat: 43.1, lng: 141.3 },
  { code: "017000", name: "渡島・檜山地方", lat: 41.8, lng: 140.7 },
  { code: "020000", name: "青森県", lat: 40.8, lng: 140.7 },
  { code: "030000", name: "岩手県", lat: 39.7, lng: 141.1 },
  { code: "040000", name: "宮城県", lat: 38.3, lng: 140.9 },
  { code: "050000", name: "秋田県", lat: 39.7, lng: 140.1 },
  { code: "060000", name: "山形県", lat: 38.2, lng: 140.4 },
  { code: "070000", name: "福島県", lat: 37.8, lng: 140.5 },
  { code: "080000", name: "茨城県", lat: 36.3, lng: 140.4 },
  { code: "090000", name: "栃木県", lat: 36.6, lng: 139.9 },
  { code: "100000", name: "群馬県", lat: 36.4, lng: 139.1 },
  { code: "110000", name: "埼玉県", lat: 35.9, lng: 139.6 },
  { code: "120000", name: "千葉県", lat: 35.6, lng: 140.1 },
  { code: "130000", name: "東京都", lat: 35.7, lng: 139.7 },
  { code: "140000", name: "神奈川県", lat: 35.4, lng: 139.4 },
  { code: "150000", name: "新潟県", lat: 37.9, lng: 139.0 },
  { code: "160000", name: "富山県", lat: 36.7, lng: 137.2 },
  { code: "170000", name: "石川県", lat: 36.6, lng: 136.6 },
  { code: "180000", name: "福井県", lat: 36.1, lng: 136.2 },
  { code: "190000", name: "山梨県", lat: 35.7, lng: 138.6 },
  { code: "200000", name: "長野県", lat: 36.7, lng: 138.2 },
  { code: "210000", name: "岐阜県", lat: 35.4, lng: 136.7 },
  { code: "220000", name: "静岡県", lat: 34.9, lng: 138.4 },
  { code: "230000", name: "愛知県", lat: 35.2, lng: 136.9 },
  { code: "240000", name: "三重県", lat: 34.7, lng: 136.5 },
  { code: "250000", name: "滋賀県", lat: 35.0, lng: 135.9 },
  { code: "260000", name: "京都府", lat: 35.0, lng: 135.8 },
  { code: "270000", name: "大阪府", lat: 34.7, lng: 135.5 },
  { code: "280000", name: "兵庫県", lat: 34.7, lng: 135.2 },
  { code: "290000", name: "奈良県", lat: 34.7, lng: 135.8 },
  { code: "300000", name: "和歌山県", lat: 34.2, lng: 135.2 },
  { code: "310000", name: "鳥取県", lat: 35.5, lng: 134.2 },
  { code: "320000", name: "島根県", lat: 35.5, lng: 133.0 },
  { code: "330000", name: "岡山県", lat: 34.7, lng: 133.9 },
  { code: "340000", name: "広島県", lat: 34.4, lng: 132.5 },
  { code: "350000", name: "山口県", lat: 34.2, lng: 131.5 },
  { code: "360000", name: "徳島県", lat: 34.1, lng: 134.6 },
  { code: "370000", name: "香川県", lat: 34.3, lng: 134.0 },
  { code: "380000", name: "愛媛県", lat: 33.8, lng: 132.8 },
  { code: "390000", name: "高知県", lat: 33.6, lng: 133.5 },
  { code: "400000", name: "福岡県", lat: 33.6, lng: 130.4 },
  { code: "410000", name: "佐賀県", lat: 33.2, lng: 130.3 },
  { code: "420000", name: "長崎県", lat: 32.7, lng: 129.9 },
  { code: "430000", name: "熊本県", lat: 32.8, lng: 130.7 },
  { code: "440000", name: "大分県", lat: 33.2, lng: 131.6 },
  { code: "450000", name: "宮崎県", lat: 31.9, lng: 131.4 },
  { code: "460100", name: "鹿児島県", lat: 31.6, lng: 130.6 },
  { code: "471000", name: "沖縄本島地方", lat: 26.2, lng: 127.7 },
  { code: "472000", name: "大東島地方", lat: 25.8, lng: 131.2 },
  { code: "473000", name: "宮古島地方", lat: 24.8, lng: 125.3 },
  { code: "474000", name: "八重山地方", lat: 24.4, lng: 124.2 },
]

/**
 * 緯度経度からハversine距離で最近傍の気象庁オフィスコードを返す
 */
export function findNearestOffice(lat: number, lng: number): OfficeEntry {
  let nearest = JMA_OFFICES[0]
  let minDist = Infinity

  for (const office of JMA_OFFICES) {
    const dLat = toRad(lat - office.lat)
    const dLng = toRad(lng - office.lng)
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat)) * Math.cos(toRad(office.lat)) * Math.sin(dLng / 2) ** 2
    const dist = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    if (dist < minDist) {
      minDist = dist
      nearest = office
    }
  }

  return nearest
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}