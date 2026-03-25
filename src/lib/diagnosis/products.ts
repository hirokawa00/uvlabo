import type { Product } from "./types"

/**
 * 製品データベース
 *
 * 優先順位:
 *   1. ETVOS    - EPC:211 / 確定率99% / A8掲載 → 最優先
 *   2. オルビス  - EPC:47 / 確定率93% / A8掲載 → 第2優先
 *   3. HOLO BELL - EPC:13 / 確定率100% / A8掲載 → 第3優先
 *   4. アロベビー - 確定率100% / 子育てシーンで差別化
 *   5. Amazon汎用 - カバレッジ補完用
 *
 * ※ affiliate.url は本番時に実際のトラッキングURLに差し替えること
 */
export const PRODUCTS: Product[] = [
  // ─── ETVOS ─────────────────────────────────────────────────────
  {
    id: "etvos-mineral-uv",
    name: "ミネラルUVホワイトニング",
    brand: "ETVOS（エトヴォス）",
    price: 2860,
    spf: 50,
    pa: "++++",
    tags: ["ノンケミカル", "下地兼用", "石けんオフ", "白浮きしにくい", "SPF50+"],
    description: "ミネラルだけで作ったUV下地。毛穴カバーも叶える",
    emoji: "🌿",
    affiliate: [
      {
        source: "a8",
        url: "https://px.a8.net/svt/ejp?a8mat=XXXXX", // 本番で差し替え
      },
      {
        source: "amazon",
        url: "https://www.amazon.co.jp/dp/B0XXXXX?tag=uvlab-22",
      },
    ],
    priorityASP: true,
    suitableFor: {
      skinTypes: ["sensitive", "dry", "normal", "combination"],
      scenes: ["commute", "outing", "indoor"],
      makeupStyles: ["with_makeup"],
      budgetRanges: ["mid", "premium"],
      textures: ["moist", "any"],
    },
  },

  // ─── オルビス ───────────────────────────────────────────────────
  {
    id: "orbis-uv-white",
    name: "UVホワイトクリーム",
    brand: "ORBIS（オルビス）",
    price: 1760,
    spf: 50,
    pa: "++++",
    tags: ["石けんオフ", "無香料", "さっぱり", "白浮きしにくい", "SPF50+"],
    description: "毛穴レス仕上がり。サラッとした使用感が続く",
    emoji: "☁️",
    affiliate: [
      {
        source: "a8",
        url: "https://px.a8.net/svt/ejp?a8mat=YYYYY", // 本番で差し替え
      },
      {
        source: "amazon",
        url: "https://www.amazon.co.jp/dp/B0YYYYY?tag=uvlab-22",
      },
    ],
    priorityASP: true,
    suitableFor: {
      skinTypes: ["oily", "combination", "normal"],
      scenes: ["commute", "outing", "indoor"],
      makeupStyles: ["with_makeup", "no_makeup"],
      budgetRanges: ["budget", "mid"],
      textures: ["light", "any"],
    },
  },

  // ─── HOLO BELL ─────────────────────────────────────────────────
  {
    id: "holo-bell-uv",
    name: "プロテクト保湿UV",
    brand: "HOLO BELL",
    price: 2200,
    spf: 50,
    pa: "+++",
    tags: ["ノンケミカル", "敏感肌向け", "石けんオフ", "しっとり"],
    description: "ノンケミカルで敏感肌にやさしく、保湿力も高い",
    emoji: "🫧",
    affiliate: [
      {
        source: "a8",
        url: "https://px.a8.net/svt/ejp?a8mat=ZZZZZ", // 本番で差し替え
      },
      {
        source: "amazon",
        url: "https://www.amazon.co.jp/dp/B0ZZZZZ?tag=uvlab-22",
      },
    ],
    priorityASP: true,
    suitableFor: {
      skinTypes: ["sensitive", "dry"],
      scenes: ["commute", "outing", "indoor"],
      makeupStyles: ["no_makeup", "with_makeup"],
      budgetRanges: ["mid"],
      textures: ["moist", "any"],
    },
  },

  // ─── アロベビー（子ども・屋外シーン差別化）─────────────────────
  {
    id: "alobaby-uv",
    name: "UV＆アウトドアミスト",
    brand: "ALOBABY（アロベビー）",
    price: 2090,
    spf: 28,
    pa: "+++",
    tags: ["オーガニック", "敏感肌向け", "ノンケミカル", "ウォータープルーフ"],
    description: "赤ちゃんにも使えるオーガニック処方。アウトドア向け",
    emoji: "🌱",
    affiliate: [
      {
        source: "a8",
        url: "https://px.a8.net/svt/ejp?a8mat=AAAAA", // 本番で差し替え
      },
      {
        source: "amazon",
        url: "https://www.amazon.co.jp/dp/B0AAAAA?tag=uvlab-22",
      },
    ],
    priorityASP: true,
    suitableFor: {
      skinTypes: ["sensitive", "dry", "normal"],
      scenes: ["outdoor"],
      makeupStyles: ["no_makeup"],
      budgetRanges: ["mid"],
      textures: ["light", "any"],
    },
  },

  // ─── NULL ウォータープルーフ（男性・屋外向け）──────────────────
  {
    id: "null-waterproof",
    name: "ウォータープルーフ日焼け止めジェル",
    brand: "NULL メンズ",
    price: 2530,
    spf: 50,
    pa: "++++",
    tags: ["ウォータープルーフ", "さっぱり", "SPF50+"],
    description: "汗・水に強いジェルタイプ。スポーツ時に最適",
    emoji: "💧",
    affiliate: [
      {
        source: "a8",
        url: "https://px.a8.net/svt/ejp?a8mat=BBBBB", // 本番で差し替え
      },
      {
        source: "amazon",
        url: "https://www.amazon.co.jp/dp/B0BBBBB?tag=uvlab-22",
      },
    ],
    priorityASP: false,
    suitableFor: {
      skinTypes: ["oily", "normal", "combination"],
      scenes: ["outdoor"],
      makeupStyles: ["no_makeup"],
      budgetRanges: ["mid", "premium"],
      textures: ["light", "any"],
    },
  },

  // ─── KISO ハイドロキノン（美白・事後ケア差別化）────────────────
  {
    id: "kiso-hydroquinone",
    name: "純ハイドロキノン8%配合クリーム",
    brand: "KISO",
    price: 2750,
    spf: 0, // SPFなし（事後ケア製品）
    pa: "",
    tags: ["敏感肌向け", "しっとり"],
    description: "楽天1位の美白ケア。日焼け後の集中ケアに",
    emoji: "🔬",
    affiliate: [
      {
        source: "a8",
        url: "https://px.a8.net/svt/ejp?a8mat=CCCCC", // 本番で差し替え
      },
      {
        source: "amazon",
        url: "https://www.amazon.co.jp/dp/B0CCCCC?tag=uvlab-22",
      },
    ],
    priorityASP: true,
    suitableFor: {
      skinTypes: ["sensitive", "dry", "normal", "combination", "oily"],
      scenes: ["commute", "outing", "indoor", "outdoor"],
      makeupStyles: ["with_makeup", "no_makeup"],
      budgetRanges: ["mid", "premium"],
      textures: ["moist", "any"],
    },
  },
]