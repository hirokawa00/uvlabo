// ─── 入力の型 ────────────────────────────────────────────────────

/** 日焼けの程度 */
export type BurnLevel =
  | "mild"    // 軽度: 少し赤い・ほんのり熱い
  | "moderate" // 中度: はっきり赤い・ヒリヒリする
  | "severe"  // 重度: 強い痛み・水ぶくれの可能性

/** 日焼けした部位（複数選択可） */
export type BurnArea =
  | "face"     // 顔
  | "arms"     // 腕・手
  | "neck"     // 首・デコルテ
  | "legs"     // 脚
  | "back"     // 背中・肩

/** 日焼けからの経過時間 */
export type ElapsedTime =
  | "within3h"   // 3時間以内
  | "within12h"  // 3〜12時間
  | "next_day"   // 翌日以降

export type AfterCareInput = {
  burnLevel: BurnLevel
  areas: BurnArea[]
  elapsed: ElapsedTime
}

// ─── ケアガイドの型 ──────────────────────────────────────────────

export type CarePhase = "tonight" | "day1_3" | "day4_plus"

export type CareStep = {
  id: string
  phase: CarePhase
  order: number
  title: string
  detail: string
  duration?: string       // 例: "5〜10分"
  caution?: string        // 注意事項
  productIds?: string[]   // 関連製品ID（products.tsと連携）
}

export type AfterCareProduct = {
  id: string
  name: string
  brand: string
  price: number
  emoji: string
  description: string
  useCase: string         // 「日焼け直後の冷却に」など
  affiliateUrl: string
  source: "amazon" | "a8"
}

export type AfterCareGuide = {
  input: AfterCareInput
  urgencyMessage: string          // 最上部に表示する緊急度メッセージ
  shouldSeeDoctor: boolean        // 受診推奨フラグ
  phases: {
    phase: CarePhase
    label: string                 // 「今夜やること」など
    steps: CareStep[]
  }[]
  recommendedProducts: AfterCareProduct[]
  avoidList: string[]             // やってはいけないこと
}

// ─── ステップ管理 ────────────────────────────────────────────────

export type AfterCareStep = 1 | 2 | 3
export const AFTERCARE_TOTAL_STEPS = 3

export const BURN_LEVEL_LABEL: Record<BurnLevel, string> = {
  mild: "軽度（少し赤い）",
  moderate: "中度（ヒリヒリする）",
  severe: "重度（強い痛み）",
}

export const AREA_LABEL: Record<BurnArea, string> = {
  face: "顔",
  arms: "腕・手",
  neck: "首・デコルテ",
  legs: "脚",
  back: "背中・肩",
}

export const ELAPSED_LABEL: Record<ElapsedTime, string> = {
  within3h: "3時間以内",
  within12h: "3〜12時間",
  next_day: "翌日以降",
}