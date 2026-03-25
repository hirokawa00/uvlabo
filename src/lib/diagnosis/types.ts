// ─── 診断入力の型 ───────────────────────────────────────────────

export type SkinType = "dry" | "oily" | "combination" | "sensitive" | "normal"
export type UseScene = "commute" | "outing" | "outdoor" | "indoor"
export type MakeupStyle = "with_makeup" | "no_makeup"
export type BudgetRange = "budget" | "mid" | "premium"
export type TexturePreference = "light" | "moist" | "any"

export type DiagnosisInput = {
  skinType: SkinType
  scene: UseScene
  makeupStyle: MakeupStyle
  budget: BudgetRange
  texture: TexturePreference
  uvIndex?: number  // UV Cardから引き継ぐ（任意）
}

// ─── 製品の型 ───────────────────────────────────────────────────

export type ProductTag =
  | "石けんオフ"
  | "ノンケミカル"
  | "下地兼用"
  | "敏感肌向け"
  | "ウォータープルーフ"
  | "無香料"
  | "オーガニック"
  | "白浮きしにくい"
  | "さっぱり"
  | "しっとり"
  | "プチプラ"
  | "SPF50+"

export type AffiliateSource = "amazon" | "rakuten" | "a8"

export type Product = {
  id: string
  name: string
  brand: string
  price: number           // 税込参考価格（円）
  spf: number
  pa: "+" | "++" | "+++" | "++++"
  tags: ProductTag[]
  description: string     // 40字以内の一言説明
  emoji: string           // サムネイル代わりの絵文字
  affiliate: {
    source: AffiliateSource
    url: string           // アフィリエイトリンク（本番で差し替え）
  }[]
  // 適合スコアリング用の属性
  suitableFor: {
    skinTypes: SkinType[]
    scenes: UseScene[]
    makeupStyles: MakeupStyle[]
    budgetRanges: BudgetRange[]
    textures: TexturePreference[]
  }
  // A8掲載案件は優先度を上げる
  priorityASP: boolean
}

// ─── 診断結果の型 ────────────────────────────────────────────────

export type DiagnosisResult = {
  input: DiagnosisInput
  recommended: RankedProduct[]   // 最大3件
  skinAdvice: string             // 肌タイプ別のアドバイス
  sceneAdvice: string            // シーン別のアドバイス
  reapplyTip: string             // 塗り直しTips
}

export type RankedProduct = Product & {
  rank: 1 | 2 | 3
  matchReason: string   // 「なぜこれか」の一言
  score: number
}

// ─── ステップ管理の型 ────────────────────────────────────────────

export type DiagnosisStep = 1 | 2 | 3 | 4 | 5
export const TOTAL_STEPS: DiagnosisStep = 5