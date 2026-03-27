// ── 型定義 ────────────────────────────────────────────────────────

export type BlogCategory =
  | "uv-knowledge" // UV・紫外線の基礎知識
  | "sunscreen" // 日焼け止めの選び方
  | "aftercare" // 日焼けあとのケア
  | "seasonal" // 季節別UVケア
  | "skincare"; // スキンケア全般

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  tags: string[];
  publishedAt: string; // "2025-05-24"
  updatedAt?: string;
  readingTimeMin: number; // 読了時間（分）
  coverEmoji: string; // カバー画像の代わり（絵文字）
  coverColor: string; // カバー背景色（Tailwindクラス）
  featured?: boolean; // トップに大きく表示するか
};

// ── カテゴリ設定 ──────────────────────────────────────────────────

export const CATEGORY_CONFIG: Record<
  BlogCategory,
  {
    label: string;
    color: string; // Tailwind bg クラス
    textColor: string; // Tailwind text クラス
    emoji: string;
  }
> = {
  "uv-knowledge": {
    label: "UV基礎知識",
    color: "bg-amber-100",
    textColor: "text-amber-800",
    emoji: "☀️",
  },
  sunscreen: {
    label: "日焼け止めの選び方",
    color: "bg-emerald-100",
    textColor: "text-emerald-800",
    emoji: "🧴",
  },
  aftercare: {
    label: "日焼けあとのケア",
    color: "bg-orange-100",
    textColor: "text-orange-800",
    emoji: "🌊",
  },
  seasonal: {
    label: "季節別UVケア",
    color: "bg-sky-100",
    textColor: "text-sky-800",
    emoji: "🌸",
  },
  skincare: {
    label: "スキンケア",
    color: "bg-pink-100",
    textColor: "text-pink-800",
    emoji: "✨",
  },
};

// ── 記事メタデータ一覧（手動管理）───────────────────────────────
// MDXのfrontmatterは静的解析が必要なため、
// Cloudflare Workers環境ではここで一元管理するのが最も安定した方法

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "spf30-vs-spf50",
    title: "SPF30とSPF50の違いを計算で解説｜毎日使いに最適なのはどっち？",
    description:
      "SPF30とSPF50は実際どれくらい差があるの？計算式で比較しながら、毎日の通勤・お出かけ・アウトドアシーン別の最適な選び方を解説します。",
    category: "uv-knowledge",
    tags: ["SPF", "日焼け止め", "紫外線対策", "毎日使い"],
    publishedAt: "2026-03-24",
    readingTimeMin: 6,
    coverEmoji: "🔢",
    coverColor: "from-amber-50 to-yellow-100",
    featured: true,
  },
  {
    slug: "sensitive-skin-sunscreen-2025",
    title: "敏感肌向け日焼け止めおすすめ2025｜皮膚科医が推薦する成分を解説",
    description:
      "敏感肌でも安心して使える日焼け止めの選び方。ノンケミカル・無香料・パッチテスト済みの条件を満たしたおすすめ製品を厳選しました。",
    category: "sunscreen",
    tags: ["敏感肌", "日焼け止め", "ノンケミカル", "おすすめ"],
    publishedAt: "2026-03-25",
    readingTimeMin: 8,
    coverEmoji: "🌸",
    coverColor: "from-pink-50 to-rose-100",
    featured: true,
  },
  {
    slug: "sunburn-aftercare-72hours",
    title: "日焼け後72時間のケア完全ガイド｜シミにしないための正しい手順",
    description:
      "日焼けしてしまったら、最初の72時間が勝負です。冷却・保湿・美白ケアの正しい順序と、シミを防ぐために今すぐやるべき手順をわかりやすく解説します。",
    category: "aftercare",
    tags: ["日焼け後ケア", "シミ予防", "美白", "スキンケア", "紫外線対策"],
    publishedAt: "2026-03-26",
    readingTimeMin: 8,
    coverEmoji: "🌊",
    coverColor: "from-blue-50 to-cyan-100",
  },
  {
    slug: "pa-value-explained",
    title: "PA値とは？+〜++++の違いをわかりやすく解説｜SPFとの正しい使い分け",
    description:
      "PA値の意味・4段階の違い・SPFとの使い分けまで、初めて知る方にもわかりやすく解説します。",
    category: "uv-knowledge",
    tags: ["PA値", "UVA", "日焼け止め", "シミ予防"],
    publishedAt: "2026-03-27",
    readingTimeMin: 7,
    coverEmoji: "🔬",
    coverColor: "from-violet-50 to-purple-100",
  },
];

// ── ユーティリティ ────────────────────────────────────────────────

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.category === category);
}

export function getFeaturedPosts(): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.featured);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
