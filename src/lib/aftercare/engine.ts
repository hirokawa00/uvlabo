import type {
    AfterCareInput,
    AfterCareGuide,
    AfterCareProduct,
    BurnArea,
    CareStep,
    CarePhase,
  } from "./types"
  
  // ─── アフィリエイト製品DB（事後ケア特化）────────────────────────
  
  const AFTERCARE_PRODUCTS: AfterCareProduct[] = [
    {
      id: "kiso-hydroquinone",
      name: "純ハイドロキノン8%配合クリーム",
      brand: "KISO",
      price: 2750,
      emoji: "🔬",
      description: "楽天ランキング1位の美白ケア。シミ・色素沈着の集中ケアに",
      useCase: "日焼け後3日目〜の美白ケアに",
      affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=CCCCC",
      source: "a8",
    },
    {
      id: "siBody-mineral-shine",
      name: "ミネラルボディシャインジェル",
      brand: "SiBody（シーボディ）",
      price: 1500,
      emoji: "💎",
      description: "日焼けあと・黒ずみに特化したボディジェル",
      useCase: "腕・脚の日焼けあとケアに",
      affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=DDDDD",
      source: "a8",
    },
    {
      id: "siBody-uv-care-set",
      name: "徹底UVケアセット",
      brand: "SiBody（シーボディ）",
      price: 1000,
      emoji: "🌊",
      description: "全身の日焼けあと・黒ずみに対応したセット",
      useCase: "全身の日焼けあとケアに",
      affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=EEEEE",
      source: "a8",
    },
    {
      id: "amazon-aloe-gel",
      name: "アロエベラジェル100%",
      brand: "汎用おすすめ",
      price: 980,
      emoji: "🌿",
      description: "日焼け直後の冷却・鎮静に。100%アロエジェル",
      useCase: "日焼け直後の冷却・鎮静に",
      affiliateUrl: "https://www.amazon.co.jp/s?k=アロエジェル+日焼け&tag=uvlab-22",
      source: "amazon",
    },
    {
      id: "amazon-lotion-mild",
      name: "無香料・低刺激化粧水",
      brand: "汎用おすすめ",
      price: 1200,
      emoji: "🧴",
      description: "日焼け後の敏感になった肌への保湿化粧水",
      useCase: "日焼け後の保湿・鎮静に",
      affiliateUrl: "https://www.amazon.co.jp/s?k=無香料+化粧水+日焼け後&tag=uvlab-22",
      source: "amazon",
    },
  ]
  
  // ─── ケアフェーズ別テンプレート ──────────────────────────────────
  
  type StepTemplate = Omit<CareStep, "id" | "phase">
  
  const TONIGHT_STEPS: Record<string, StepTemplate> = {
    cool_water: {
      order: 1,
      title: "まず流水で冷やす",
      detail: "患部を15〜20分間、流水（20℃前後）で冷やしてください。氷や保冷剤を直接当てるのはNGです。",
      duration: "15〜20分",
      caution: "氷・保冷剤の直接接触はNG。タオルで包んで使用してください",
    },
    cool_towel: {
      order: 1,
      title: "冷やしたタオルで冷却",
      detail: "水で濡らして絞ったタオルを患部に当てて冷却します。15〜20分を目安に繰り返してください。",
      duration: "15〜20分",
      caution: "こすらずそっと当てるだけ",
    },
    gentle_cleansing: {
      order: 2,
      title: "ぬるま湯でやさしく洗顔",
      detail: "38℃前後のぬるま湯でやさしく洗い流します。洗顔料は使わないか、泡立てた泡のみで摩擦を最小限に。",
      caution: "お湯が熱いと炎症が悪化します。ぬるま湯を徹底してください",
    },
    aloe_gel: {
      order: 3,
      title: "アロエジェルで鎮静",
      detail: "冷やしたアロエベラジェルを患部にたっぷりのせて、なじませます。こすらずパッティングで。",
      productIds: ["amazon-aloe-gel"],
    },
    hydration: {
      order: 4,
      title: "化粧水でたっぷり保湿",
      detail: "無香料・アルコールフリーの化粧水を手のひらで押さえるようにして浸透させます。コットンでのパッティングはこの時期は避けましょう。",
      productIds: ["amazon-lotion-mild"],
    },
    moisturize: {
      order: 5,
      title: "乳液・クリームで蓋をする",
      detail: "化粧水の後に保湿クリームでしっかり蓋をします。セラミド配合や無香料タイプが肌に優しいです。",
    },
    no_bath: {
      order: 6,
      title: "今夜はシャワーのみ",
      detail: "入浴は炎症を悪化させる可能性があるため、ぬるめのシャワーだけにとどめましょう。サウナ・岩盤浴は厳禁です。",
      caution: "熱いシャワーは炎症を悪化させます",
    },
    rest: {
      order: 7,
      title: "十分な睡眠をとる",
      detail: "皮膚の修復は睡眠中に行われます。できるだけ早めに就寝し、7〜8時間の睡眠を確保しましょう。",
    },
  }
  
  const DAY1_3_STEPS: Record<string, StepTemplate> = {
    uv_avoidance: {
      order: 1,
      title: "紫外線を徹底的に避ける",
      detail: "日焼けした翌日からの数日間は、肌が最も紫外線の影響を受けやすい状態です。外出時はUV服・帽子・日傘で物理的に遮断し、日焼け止めも必ず使用してください。",
      productIds: [],
    },
    continue_hydration: {
      order: 2,
      title: "保湿を1日3〜4回続ける",
      detail: "日焼け後の肌は水分を失いやすい状態です。化粧水 → 乳液 → クリームのスキンケアを1日3〜4回行い、乾燥させないことがシミ予防の鍵です。",
      productIds: ["amazon-lotion-mild"],
    },
    vitamin_c: {
      order: 3,
      title: "ビタミンC・Eを内側から補給",
      detail: "食事からビタミンC（レモン・キウイ・パプリカ）とビタミンE（アーモンド・アボカド）を積極的に摂取しましょう。メラニン生成の抑制を内側からサポートします。",
    },
    no_exfoliation: {
      order: 4,
      title: "スクラブ・ピーリングはNG",
      detail: "炎症が残っている間は、スクラブや角質ケアは絶対に避けてください。傷んだ肌をさらに傷め、色素沈着の原因になります。",
      caution: "酵素洗顔・ピーリング・レチノール系は1週間以上休止",
    },
    sunscreen_even_indoor: {
      order: 5,
      title: "室内でも日焼け止めを塗る",
      detail: "窓から入るUVAは普通のガラスを透過します。在宅日でもSPF15〜30の日焼け止めを朝に塗布してください。",
    },
  }
  
  const DAY4_PLUS_STEPS: Record<string, StepTemplate> = {
    whitening_care: {
      order: 1,
      title: "美白ケアを開始する",
      detail: "炎症が落ち着いた4日目頃から、ハイドロキノンやビタミンC誘導体配合の美白アイテムを導入します。メラニンが定着する前にケアを始めることが重要です。",
      productIds: ["kiso-hydroquinone"],
    },
    body_care: {
      order: 2,
      title: "ボディの黒ずみケアを開始",
      detail: "腕・脚・デコルテの日焼けあとには、美白成分配合のボディジェルやクリームを毎日塗布します。シャワー後の肌が柔らかい状態でのケアが効果的です。",
      productIds: ["siBody-mineral-shine", "siBody-uv-care-set"],
    },
    uv_resume: {
      order: 3,
      title: "通常のスキンケアに戻す",
      detail: "1週間程度で皮膚のバリア機能が回復します。普段のスクラブや角質ケアも徐々に再開してOKです。ただし日焼け止めとUV対策は継続してください。",
    },
    dermatologist: {
      order: 4,
      title: "2週間以上改善しない場合は皮膚科へ",
      detail: "赤みや色素沈着が2週間以上改善しない場合は、皮膚科でのトレチノインやハイドロキノン処方を検討しましょう。",
      caution: "自己判断での長期使用は避け、専門医に相談してください",
    },
  }
  
  // ─── やってはいけないことリスト ──────────────────────────────────
  
  const AVOID_LIST_BASE = [
    "熱いお風呂・サウナ（炎症が悪化する）",
    "保冷剤・氷の直接接触（凍傷リスク）",
    "患部をこする・強く押さえる",
    "アルコール入りの化粧水・収れん化粧水",
  ]
  
  const AVOID_LIST_FACE = [
    "スクラブ・ピーリング洗顔（1週間以上休止）",
    "レチノール・AHA・BHA系のケア",
    "ファンデーションで患部を厚塗りする",
  ]
  
  const AVOID_LIST_SEVERE = [
    "水ぶくれを自分でつぶす（感染リスク）",
    "市販薬だけで対処する（まず皮膚科へ）",
  ]
  
  // ─── 緊急度メッセージ生成 ────────────────────────────────────────
  
  function buildUrgencyMessage(
    level: "mild" | "moderate" | "severe",
    elapsed: "within3h" | "within12h" | "next_day"
  ): string {
    if (level === "severe") {
      return "⚠️ 症状が重度です。水ぶくれや強い痛みがある場合は、皮膚科への受診を優先してください。"
    }
    if (level === "moderate" && elapsed === "within3h") {
      return "🧊 ヒリヒリが続いている場合は、まず冷却が最優先です。下のケア手順を今すぐ始めましょう。"
    }
    if (level === "mild") {
      return "✅ 軽度の日焼けです。今夜の保湿ケアをしっかり行えば、シミになるリスクを大幅に抑えられます。"
    }
    return "🌿 今夜から正しいケアを始めることで、色素沈着を最小限に抑えられます。"
  }
  
  // ─── ステップ生成 ────────────────────────────────────────────────
  
  function buildTonightSteps(
    level: "mild" | "moderate" | "severe",
    areas: BurnArea[],
    elapsed: "within3h" | "within12h" | "next_day"
  ): CareStep[] {
    const steps: StepTemplate[] = []
  
    // 冷却ステップ（経過時間・重度で分岐）
    if (elapsed === "within3h") {
      steps.push(level === "severe" ? TONIGHT_STEPS.cool_towel : TONIGHT_STEPS.cool_water)
    }
  
    // 洗顔（顔が含まれる場合）
    if (areas.includes("face")) {
      steps.push(TONIGHT_STEPS.gentle_cleansing)
    }
  
    // アロエ鎮静（重度以外）
    if (level !== "severe") {
      steps.push(TONIGHT_STEPS.aloe_gel)
    }
  
    steps.push(TONIGHT_STEPS.hydration)
    steps.push(TONIGHT_STEPS.moisturize)
    steps.push(TONIGHT_STEPS.no_bath)
    steps.push(TONIGHT_STEPS.rest)
  
    return steps.map((s, i) => ({
      ...s,
      id: `tonight-${i}`,
      phase: "tonight" as CarePhase,
      order: i + 1,
    }))
  }
  
  function buildDay1_3Steps(areas: BurnArea[]): CareStep[] {
    const steps: StepTemplate[] = [
      DAY1_3_STEPS.uv_avoidance,
      DAY1_3_STEPS.continue_hydration,
      DAY1_3_STEPS.vitamin_c,
      DAY1_3_STEPS.no_exfoliation,
      DAY1_3_STEPS.sunscreen_even_indoor,
    ]
  
    return steps.map((s, i) => ({
      ...s,
      id: `day1_3-${i}`,
      phase: "day1_3" as CarePhase,
      order: i + 1,
    }))
  }
  
  function buildDay4PlusSteps(areas: BurnArea[]): CareStep[] {
    const steps: StepTemplate[] = [DAY4_PLUS_STEPS.whitening_care]
  
    // ボディが含まれる場合のみ追加
    const bodyAreas: BurnArea[] = ["arms", "legs", "back", "neck"]
    if (areas.some((a) => bodyAreas.includes(a))) {
      steps.push(DAY4_PLUS_STEPS.body_care)
    }
  
    steps.push(DAY4_PLUS_STEPS.uv_resume)
    steps.push(DAY4_PLUS_STEPS.dermatologist)
  
    return steps.map((s, i) => ({
      ...s,
      id: `day4-${i}`,
      phase: "day4_plus" as CarePhase,
      order: i + 1,
    }))
  }
  
  // ─── 製品レコメンド生成 ──────────────────────────────────────────
  
  function buildRecommendedProducts(
    level: "mild" | "moderate" | "severe",
    areas: BurnArea[],
    elapsed: "within3h" | "within12h" | "next_day"
  ): AfterCareProduct[] {
    const products: AfterCareProduct[] = []
  
    // 全員 → アロエジェル + 保湿化粧水
    if (level !== "severe") {
      products.push(
        AFTERCARE_PRODUCTS.find((p) => p.id === "amazon-aloe-gel")!,
        AFTERCARE_PRODUCTS.find((p) => p.id === "amazon-lotion-mild")!
      )
    }
  
    // 中度・重度 → ハイドロキノン（4日目以降向けとして表示）
    if (level !== "mild") {
      products.push(AFTERCARE_PRODUCTS.find((p) => p.id === "kiso-hydroquinone")!)
    } else {
      products.push(AFTERCARE_PRODUCTS.find((p) => p.id === "kiso-hydroquinone")!)
    }
  
    // ボディ部位 → シーボディ
    const bodyAreas: BurnArea[] = ["arms", "legs", "back", "neck"]
    if (areas.some((a) => bodyAreas.includes(a))) {
      products.push(AFTERCARE_PRODUCTS.find((p) => p.id === "siBody-mineral-shine")!)
    }
  
    return products.filter(Boolean).slice(0, 4)
  }
  
  // ─── メイン関数 ──────────────────────────────────────────────────
  
  export function buildAfterCareGuide(input: AfterCareInput): AfterCareGuide {
    const { burnLevel, areas, elapsed } = input
  
    const shouldSeeDoctor =
      burnLevel === "severe" ||
      (burnLevel === "moderate" && elapsed === "within3h")
  
    return {
      input,
      urgencyMessage: buildUrgencyMessage(burnLevel, elapsed),
      shouldSeeDoctor,
      phases: [
        {
          phase: "tonight",
          label: elapsed === "next_day" ? "まず今夜やること" : "今すぐやること",
          steps: buildTonightSteps(burnLevel, areas, elapsed),
        },
        {
          phase: "day1_3",
          label: "翌日〜3日間のケア",
          steps: buildDay1_3Steps(areas),
        },
        {
          phase: "day4_plus",
          label: "4日目〜の美白ケア",
          steps: buildDay4PlusSteps(areas),
        },
      ],
      recommendedProducts: buildRecommendedProducts(burnLevel, areas, elapsed),
      avoidList: [
        ...AVOID_LIST_BASE,
        ...(areas.includes("face") ? AVOID_LIST_FACE : []),
        ...(burnLevel === "severe" ? AVOID_LIST_SEVERE : []),
      ],
    }
  }