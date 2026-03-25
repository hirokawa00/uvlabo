import type {
    DiagnosisInput,
    DiagnosisResult,
    RankedProduct,
    SkinType,
    UseScene,
    MakeupStyle,
    BudgetRange,
    TexturePreference,
  } from "./types"
  import { PRODUCTS } from "./products"
  import type { Product } from "./types"
  
  // ─── スコアリング ────────────────────────────────────────────────
  
  /**
   * 1製品のマッチスコアを計算する（0〜100点）
   *
   * 重み付け:
   *   肌タイプ   : 30点
   *   シーン     : 25点
   *   メイク有無 : 20点
   *   予算       : 15点
   *   テクスチャ : 10点
   *   A8優先     : +5点ボーナス
   */
  function scoreProduct(product: Product, input: DiagnosisInput): number {
    let score = 0
  
    if (product.suitableFor.skinTypes.includes(input.skinType)) score += 30
    if (product.suitableFor.scenes.includes(input.scene)) score += 25
    if (product.suitableFor.makeupStyles.includes(input.makeupStyle)) score += 20
    if (product.suitableFor.budgetRanges.includes(input.budget)) score += 15
    if (
      input.texture === "any" ||
      product.suitableFor.textures.includes(input.texture) ||
      product.suitableFor.textures.includes("any")
    ) {
      score += 10
    }
    if (product.priorityASP) score += 5
  
    // UV指数が高い（8以上）かつ SPFが低い製品はペナルティ
    if (input.uvIndex && input.uvIndex >= 8 && product.spf > 0 && product.spf < 50) {
      score -= 15
    }
  
    // 事後ケア製品（SPF=0）はアウトドアシーン以外には出さない
    if (product.spf === 0 && input.scene !== "outdoor") {
      score -= 50
    }
  
    return Math.max(0, score)
  }
  
  /** マッチ理由の一言生成 */
  function buildMatchReason(product: Product, input: DiagnosisInput): string {
    const reasons: string[] = []
  
    const skinTypeLabel: Record<SkinType, string> = {
      dry: "乾燥肌",
      oily: "脂性肌",
      combination: "混合肌",
      sensitive: "敏感肌",
      normal: "普通肌",
    }
    const sceneLabel: Record<UseScene, string> = {
      commute: "通勤・通学",
      outing: "お出かけ",
      outdoor: "アウトドア",
      indoor: "在宅",
    }
  
    if (product.suitableFor.skinTypes.includes(input.skinType)) {
      reasons.push(`${skinTypeLabel[input.skinType]}に適した処方`)
    }
    if (product.suitableFor.scenes.includes(input.scene)) {
      reasons.push(`${sceneLabel[input.scene]}シーンにぴったり`)
    }
    if (input.makeupStyle === "with_makeup" && product.tags.includes("下地兼用")) {
      reasons.push("化粧下地として使えてステップ削減")
    }
    if (product.tags.includes("ノンケミカル") && input.skinType === "sensitive") {
      reasons.push("紫外線吸収剤不使用で肌負担が少ない")
    }
    if (product.tags.includes("ウォータープルーフ") && input.scene === "outdoor") {
      reasons.push("汗・水に強くアクティブシーンに対応")
    }
  
    return reasons[0] ?? "あなたの条件と高いマッチ率"
  }
  
  // ─── アドバイス生成 ──────────────────────────────────────────────
  
  function buildSkinAdvice(skinType: SkinType): string {
    const advice: Record<SkinType, string> = {
      dry: "乾燥肌には保湿成分入りのクリームタイプが最適。朝のスキンケア後にたっぷり塗ることで、日中の乾燥を防げます。",
      oily: "脂性肌にはさっぱりしたジェルまたはミルクタイプを。塗り直しはティッシュで皮脂を抑えてからスプレータイプで重ねるのがおすすめです。",
      combination: "混合肌はTゾーンと頬で使い分けがベスト。軽いテクスチャで皮脂コントロールできるタイプを選びましょう。",
      sensitive: "敏感肌には紫外線吸収剤不使用のノンケミカルタイプを。パッチテスト済み・アレルギーテスト済みの表記も確認してください。",
      normal: "普通肌はSPF値と使用感の好みで選べます。日常使いはSPF30〜50、屋外活動はSPF50+を使い分けると肌への負担を減らせます。",
    }
    return advice[skinType]
  }
  
  function buildSceneAdvice(scene: UseScene): string {
    const advice: Record<UseScene, string> = {
      commute: "通勤時は帰宅後に落としやすい石けんオフタイプがおすすめ。電車内の窓ガラスからも紫外線は透過するため、座席側の腕・手にも塗布を忘れずに。",
      outing: "お出かけ時は携帯しやすいスプレーやスティックタイプも活用して、2〜3時間ごとに塗り直しを。ランチ後にも一度塗り直すと安心です。",
      outdoor: "アウトドアでは汗・水に強いウォータープルーフタイプを選び、90分〜2時間ごとに必ず塗り直してください。帽子・サングラスと組み合わせると防御力が大幅にアップします。",
      indoor: "室内でも窓際の紫外線（UVA）は防ぐ必要があります。SPF15〜30程度の軽いタイプを朝1回塗るだけで十分です。",
    }
    return advice[scene]
  }
  
  function buildReapplyTip(uvIndex?: number): string {
    if (!uvIndex || uvIndex <= 2) {
      return "今日のUV指数は低めです。朝の塗布1回で十分ですが、長時間外出する場合は昼過ぎに1回塗り直しましょう。"
    }
    if (uvIndex <= 5) {
      return "UV指数が中程度です。外出から3時間後を目安に塗り直してください。汗をかいた後は早めに追加塗布を。"
    }
    if (uvIndex <= 7) {
      return "UV指数が強い状態です。2時間ごとの塗り直しを心がけましょう。汗・皮脂でSPF効果が低下するため、こまめなケアが大切です。"
    }
    return "UV指数が非常に強い状態です。90分〜2時間ごとに塗り直しが必要です。外出時は日傘・帽子との組み合わせを強くおすすめします。"
  }
  
  // ─── メイン診断関数 ──────────────────────────────────────────────
  
  export function runDiagnosis(input: DiagnosisInput): DiagnosisResult {
    // 全製品をスコアリング
    const scored = PRODUCTS
      .filter((p) => p.spf > 0) // 事後ケア製品は除外（別途表示）
      .map((p) => ({
        ...p,
        score: scoreProduct(p, input),
        matchReason: buildMatchReason(p, input),
      }))
      .sort((a, b) => {
        // スコアが同じ場合はA8優先案件を上位に
        if (b.score === a.score) {
          return (b.priorityASP ? 1 : 0) - (a.priorityASP ? 1 : 0)
        }
        return b.score - a.score
      })
      .slice(0, 3)
      .map((p, i) => ({ ...p, rank: (i + 1) as 1 | 2 | 3 })) satisfies RankedProduct[]
  
    return {
      input,
      recommended: scored,
      skinAdvice: buildSkinAdvice(input.skinType),
      sceneAdvice: buildSceneAdvice(input.scene),
      reapplyTip: buildReapplyTip(input.uvIndex),
    }
  }
  
  // ─── ラベル変換ユーティリティ（UI表示用）────────────────────────
  
  export const SKIN_TYPE_LABEL: Record<SkinType, string> = {
    dry: "乾燥肌",
    oily: "脂性肌",
    combination: "混合肌",
    sensitive: "敏感肌",
    normal: "普通肌",
  }
  
  export const SCENE_LABEL: Record<UseScene, string> = {
    commute: "通勤・通学",
    outing: "お出かけ",
    outdoor: "アウトドア",
    indoor: "在宅・室内",
  }
  
  export const MAKEUP_LABEL: Record<MakeupStyle, string> = {
    with_makeup: "メイクあり",
    no_makeup: "スキンケアのみ",
  }
  
  export const BUDGET_LABEL: Record<BudgetRange, string> = {
    budget: "〜¥1,500",
    mid: "〜¥3,000",
    premium: "¥3,000〜",
  }
  
  export const TEXTURE_LABEL: Record<TexturePreference, string> = {
    light: "さっぱり系",
    moist: "しっとり系",
    any: "こだわらない",
  }