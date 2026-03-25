"use client"

import { cn } from "@/lib/utils"
import type {
  SkinType,
  UseScene,
  MakeupStyle,
  BudgetRange,
  TexturePreference,
  DiagnosisStep,
} from "@/lib/diagnosis/types"
import { TOTAL_STEPS } from "@/lib/diagnosis/types"

// ─── ステップバー ────────────────────────────────────────────────

export function StepBar({ current }: { current: DiagnosisStep }) {
  return (
    <div className="flex gap-1.5 mb-6">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((n) => (
        <div
          key={n}
          className={cn(
            "flex-1 h-1 rounded-full transition-all duration-300",
            n < current && "bg-emerald-500",
            n === current && "bg-emerald-700",
            n > current && "bg-secondary"
          )}
        />
      ))}
    </div>
  )
}

// ─── 選択カード（共通）──────────────────────────────────────────

type ChoiceCardProps = {
  emoji: string
  label: string
  description?: string
  selected: boolean
  onClick: () => void
}

export function ChoiceCard({
  emoji,
  label,
  description,
  selected,
  onClick,
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 p-4 rounded-xl border text-center",
        "transition-all duration-150 cursor-pointer w-full",
        "hover:border-emerald-400 hover:bg-emerald-50/60",
        selected
          ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600"
          : "border-border bg-card"
      )}
    >
      <span className="text-2xl leading-none">{emoji}</span>
      <span
        className={cn(
          "text-sm font-medium leading-tight",
          selected ? "text-emerald-800" : "text-foreground"
        )}
      >
        {label}
      </span>
      {description && (
        <span className="text-[11px] text-muted-foreground leading-snug">
          {description}
        </span>
      )}
    </button>
  )
}

// ─── 問いヘッダー ────────────────────────────────────────────────

type QuestionHeaderProps = {
  step: DiagnosisStep
  title: string
}

export function QuestionHeader({ step, title }: QuestionHeaderProps) {
  return (
    <div className="mb-5">
      <p className="text-[11px] font-medium text-emerald-700 tracking-widest mb-1.5">
        STEP {step} / {TOTAL_STEPS}
      </p>
      <h2 className="text-xl font-medium leading-snug tracking-tight text-foreground">
        {title}
      </h2>
    </div>
  )
}

// ─── ナビゲーションボタン ────────────────────────────────────────

type NavRowProps = {
  onBack?: () => void
  onNext: () => void
  nextLabel?: string
  disabled?: boolean
}

export function NavRow({
  onBack,
  onNext,
  nextLabel = "次へ",
  disabled = false,
}: NavRowProps) {
  return (
    <div className="flex gap-2.5 mt-6">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-xl border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors"
        >
          戻る
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={disabled}
        className={cn(
          "flex-1 py-3 rounded-xl text-sm font-medium transition-all",
          disabled
            ? "bg-secondary text-muted-foreground cursor-not-allowed"
            : "bg-emerald-700 text-white hover:bg-emerald-800 active:scale-[0.98]"
        )}
      >
        {nextLabel}
      </button>
    </div>
  )
}

// ─── Step1: 肌タイプ ─────────────────────────────────────────────

type Step1Props = {
  value: SkinType | null
  onChange: (v: SkinType) => void
  onNext: () => void
}

const SKIN_OPTIONS: { value: SkinType; emoji: string; label: string; desc: string }[] = [
  { value: "dry", emoji: "💧", label: "乾燥肌", desc: "つっぱり・粉ふきが気になる" },
  { value: "oily", emoji: "✨", label: "脂性肌", desc: "テカリ・毛穴が気になる" },
  { value: "combination", emoji: "🌿", label: "混合肌", desc: "Tゾーンはテカリ、頬は乾燥" },
  { value: "sensitive", emoji: "🌸", label: "敏感肌", desc: "刺激に弱く赤みが出やすい" },
  { value: "normal", emoji: "😊", label: "普通肌", desc: "特に気になる症状がない" },
]

export function Step1({ value, onChange, onNext }: Step1Props) {
  return (
    <>
      <QuestionHeader step={1} title={"あなたの肌タイプを\n教えてください"} />
      <div className="grid grid-cols-2 gap-2.5">
        {SKIN_OPTIONS.map((o) => (
          <ChoiceCard
            key={o.value}
            emoji={o.emoji}
            label={o.label}
            description={o.desc}
            selected={value === o.value}
            onClick={() => onChange(o.value)}
          />
        ))}
      </div>
      <NavRow onNext={onNext} disabled={!value} />
    </>
  )
}

// ─── Step2: シーン ───────────────────────────────────────────────

type Step2Props = {
  value: UseScene | null
  onChange: (v: UseScene) => void
  onNext: () => void
  onBack: () => void
}

const SCENE_OPTIONS: { value: UseScene; emoji: string; label: string; desc: string }[] = [
  { value: "commute", emoji: "🚃", label: "通勤・通学", desc: "外出は移動メイン" },
  { value: "outing", emoji: "🛍️", label: "お出かけ", desc: "買い物・街歩きなど" },
  { value: "outdoor", emoji: "⛅", label: "アウトドア", desc: "スポーツ・公園・海" },
  { value: "indoor", emoji: "🏠", label: "在宅・室内", desc: "ほぼ外出しない" },
]

export function Step2({ value, onChange, onNext, onBack }: Step2Props) {
  return (
    <>
      <QuestionHeader step={2} title={"今日のメインシーンは\nどちらですか？"} />
      <div className="grid grid-cols-2 gap-2.5">
        {SCENE_OPTIONS.map((o) => (
          <ChoiceCard
            key={o.value}
            emoji={o.emoji}
            label={o.label}
            description={o.desc}
            selected={value === o.value}
            onClick={() => onChange(o.value)}
          />
        ))}
      </div>
      <NavRow onBack={onBack} onNext={onNext} disabled={!value} />
    </>
  )
}

// ─── Step3: メイク有無 ───────────────────────────────────────────

type Step3Props = {
  value: MakeupStyle | null
  onChange: (v: MakeupStyle) => void
  onNext: () => void
  onBack: () => void
}

export function Step3({ value, onChange, onNext, onBack }: Step3Props) {
  return (
    <>
      <QuestionHeader step={3} title={"今日はメイクを\nしますか？"} />
      <div className="flex flex-col gap-2.5">
        <ChoiceCard
          emoji="💄"
          label="する（ベースメイクあり）"
          description="化粧下地・ファンデを使用"
          selected={value === "with_makeup"}
          onClick={() => onChange("with_makeup")}
        />
        <ChoiceCard
          emoji="🧴"
          label="しない（スキンケアのみ）"
          description="日焼け止めのみ使用"
          selected={value === "no_makeup"}
          onClick={() => onChange("no_makeup")}
        />
      </div>
      <NavRow onBack={onBack} onNext={onNext} disabled={!value} />
    </>
  )
}

// ─── Step4: 予算 ─────────────────────────────────────────────────

type Step4Props = {
  value: BudgetRange | null
  onChange: (v: BudgetRange) => void
  onNext: () => void
  onBack: () => void
}

const BUDGET_OPTIONS: { value: BudgetRange; emoji: string; label: string; desc: string }[] = [
  { value: "budget", emoji: "💴", label: "〜¥1,500", desc: "プチプラ" },
  { value: "mid", emoji: "💳", label: "〜¥3,000", desc: "ミドル" },
  { value: "premium", emoji: "🎁", label: "¥3,000〜", desc: "プレミアム" },
]

export function Step4({ value, onChange, onNext, onBack }: Step4Props) {
  return (
    <>
      <QuestionHeader step={4} title={"日焼け止めの\nご予算は？"} />
      <div className="grid grid-cols-3 gap-2.5">
        {BUDGET_OPTIONS.map((o) => (
          <ChoiceCard
            key={o.value}
            emoji={o.emoji}
            label={o.label}
            description={o.desc}
            selected={value === o.value}
            onClick={() => onChange(o.value)}
          />
        ))}
      </div>
      <NavRow onBack={onBack} onNext={onNext} disabled={!value} />
    </>
  )
}

// ─── Step5: テクスチャ ───────────────────────────────────────────

type Step5Props = {
  value: TexturePreference | null
  onChange: (v: TexturePreference) => void
  onNext: () => void
  onBack: () => void
}

const TEXTURE_OPTIONS: { value: TexturePreference; emoji: string; label: string; desc: string }[] = [
  { value: "light", emoji: "🍃", label: "さっぱり系", desc: "べたつかずサラッとしたい" },
  { value: "moist", emoji: "🫐", label: "しっとり系", desc: "保湿感があるタイプが好き" },
  { value: "any", emoji: "🤍", label: "こだわらない", desc: "使用感は気にしない" },
]

export function Step5({ value, onChange, onNext, onBack }: Step5Props) {
  return (
    <>
      <QuestionHeader step={5} title={"テクスチャの\n好みを教えてください"} />
      <div className="flex flex-col gap-2.5">
        {TEXTURE_OPTIONS.map((o) => (
          <ChoiceCard
            key={o.value}
            emoji={o.emoji}
            label={o.label}
            description={o.desc}
            selected={value === o.value}
            onClick={() => onChange(o.value)}
          />
        ))}
      </div>
      <NavRow
        onBack={onBack}
        onNext={onNext}
        nextLabel="診断結果を見る →"
        disabled={!value}
      />
    </>
  )
}