"use client"

import { cn } from "@/lib/utils"
import type {
  BurnLevel,
  BurnArea,
  ElapsedTime,
  AfterCareStep,
} from "@/lib/aftercare/types"
import {
  BURN_LEVEL_LABEL,
  AREA_LABEL,
  ELAPSED_LABEL,
  AFTERCARE_TOTAL_STEPS,
} from "@/lib/aftercare/types"

// ─── ステップバー ────────────────────────────────────────────────

export function AfterCareStepBar({ current }: { current: AfterCareStep }) {
  return (
    <div className="flex gap-1.5 mb-6">
      {Array.from({ length: AFTERCARE_TOTAL_STEPS }, (_, i) => i + 1).map((n) => (
        <div
          key={n}
          className={cn(
            "flex-1 h-1 rounded-full transition-all duration-300",
            n < current && "bg-orange-400",
            n === current && "bg-orange-600",
            n > current && "bg-secondary"
          )}
        />
      ))}
    </div>
  )
}

// ─── 共通ChoiceCard ──────────────────────────────────────────────

type ChoiceCardProps = {
  emoji: string
  label: string
  description?: string
  selected: boolean
  onClick: () => void
  accentColor?: "orange" | "emerald"
}

function ChoiceCard({
  emoji, label, description, selected, onClick, accentColor = "orange",
}: ChoiceCardProps) {
  const accent =
    accentColor === "orange"
      ? "hover:border-orange-400 hover:bg-orange-50/50 selected:border-orange-600"
      : "hover:border-emerald-400 hover:bg-emerald-50/50"
  const selectedClass =
    accentColor === "orange"
      ? "border-orange-600 bg-orange-50 ring-1 ring-orange-500"
      : "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600"

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 p-4 rounded-xl border text-center w-full",
        "transition-all duration-150 cursor-pointer",
        "hover:border-orange-400 hover:bg-orange-50/40",
        selected ? selectedClass : "border-border bg-card"
      )}
    >
      <span className="text-2xl leading-none">{emoji}</span>
      <span className={cn("text-sm font-medium leading-tight",
        selected ? (accentColor === "orange" ? "text-orange-900" : "text-emerald-900") : "text-foreground"
      )}>
        {label}
      </span>
      {description && (
        <span className="text-[11px] text-muted-foreground leading-snug">{description}</span>
      )}
    </button>
  )
}

// ─── チェックボックスカード（複数選択用）────────────────────────

type CheckCardProps = {
  emoji: string
  label: string
  checked: boolean
  onClick: () => void
}

function CheckCard({ emoji, label, checked, onClick }: CheckCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left w-full",
        "transition-all duration-150 cursor-pointer",
        "hover:border-orange-400 hover:bg-orange-50/40",
        checked
          ? "border-orange-500 bg-orange-50 ring-1 ring-orange-400"
          : "border-border bg-card"
      )}
    >
      <span className="text-xl leading-none">{emoji}</span>
      <span className={cn("text-sm font-medium flex-1",
        checked ? "text-orange-900" : "text-foreground"
      )}>
        {label}
      </span>
      <div className={cn(
        "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0",
        checked ? "bg-orange-500 border-orange-500" : "border-border"
      )}>
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
            <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
    </button>
  )
}

// ─── NavRow ──────────────────────────────────────────────────────

type NavRowProps = {
  onBack?: () => void
  onNext: () => void
  nextLabel?: string
  disabled?: boolean
}

function NavRow({ onBack, onNext, nextLabel = "次へ", disabled = false }: NavRowProps) {
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
            : "bg-orange-600 text-white hover:bg-orange-700 active:scale-[0.98]"
        )}
      >
        {nextLabel}
      </button>
    </div>
  )
}

// ─── Step1: 日焼けの程度 ─────────────────────────────────────────

const BURN_OPTIONS: {
  value: BurnLevel; emoji: string; desc: string; color: string
}[] = [
  { value: "mild",     emoji: "🟡", desc: "少し赤い・ほんのり熱い程度", color: "text-yellow-700" },
  { value: "moderate", emoji: "🟠", desc: "はっきり赤い・ヒリヒリ痛い", color: "text-orange-600" },
  { value: "severe",   emoji: "🔴", desc: "強い痛み・水ぶくれの可能性", color: "text-red-600" },
]

type Step1Props = {
  value: BurnLevel | null
  onChange: (v: BurnLevel) => void
  onNext: () => void
}

export function AfterCareStep1({ value, onChange, onNext }: Step1Props) {
  return (
    <>
      <div className="mb-5">
        <p className="text-[11px] font-medium text-orange-700 tracking-widest mb-1.5">
          STEP 1 / {AFTERCARE_TOTAL_STEPS}
        </p>
        <h2 className="text-xl font-medium leading-snug tracking-tight">
          日焼けの程度を<br />教えてください
        </h2>
      </div>
      <div className="flex flex-col gap-2.5">
        {BURN_OPTIONS.map((o) => (
          <ChoiceCard
            key={o.value}
            emoji={o.emoji}
            label={BURN_LEVEL_LABEL[o.value]}
            description={o.desc}
            selected={value === o.value}
            onClick={() => onChange(o.value)}
          />
        ))}
      </div>
      {/* 重度の場合の受診警告 */}
      {value === "severe" && (
        <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200">
          <p className="text-xs text-red-700 leading-relaxed">
            ⚠️ 症状が重い場合は、まず皮膚科への受診を優先してください。
            水ぶくれがある場合は自己処置を避けてください。
          </p>
        </div>
      )}
      <NavRow onNext={onNext} disabled={!value} />
    </>
  )
}

// ─── Step2: 日焼けした部位 ──────────────────────────────────────

const AREA_OPTIONS: { value: BurnArea; emoji: string }[] = [
  { value: "face",  emoji: "😊" },
  { value: "neck",  emoji: "🪷" },
  { value: "arms",  emoji: "💪" },
  { value: "legs",  emoji: "🦵" },
  { value: "back",  emoji: "🔙" },
]

type Step2Props = {
  value: BurnArea[]
  onChange: (v: BurnArea[]) => void
  onNext: () => void
  onBack: () => void
}

export function AfterCareStep2({ value, onChange, onNext, onBack }: Step2Props) {
  const toggle = (area: BurnArea) => {
    onChange(
      value.includes(area) ? value.filter((a) => a !== area) : [...value, area]
    )
  }

  return (
    <>
      <div className="mb-5">
        <p className="text-[11px] font-medium text-orange-700 tracking-widest mb-1.5">
          STEP 2 / {AFTERCARE_TOTAL_STEPS}
        </p>
        <h2 className="text-xl font-medium leading-snug tracking-tight">
          日焼けした部位を<br />選んでください（複数可）
        </h2>
      </div>
      <div className="flex flex-col gap-2">
        {AREA_OPTIONS.map((o) => (
          <CheckCard
            key={o.value}
            emoji={o.emoji}
            label={AREA_LABEL[o.value]}
            checked={value.includes(o.value)}
            onClick={() => toggle(o.value)}
          />
        ))}
      </div>
      <NavRow onBack={onBack} onNext={onNext} disabled={value.length === 0} />
    </>
  )
}

// ─── Step3: 経過時間 ─────────────────────────────────────────────

const ELAPSED_OPTIONS: { value: ElapsedTime; emoji: string; desc: string }[] = [
  { value: "within3h",  emoji: "⚡", desc: "まだ肌が熱い・赤みが出はじめ" },
  { value: "within12h", emoji: "🕐", desc: "赤みが定着・ヒリヒリが続いている" },
  { value: "next_day",  emoji: "📅", desc: "翌日〜数日後の対処" },
]

type Step3Props = {
  value: ElapsedTime | null
  onChange: (v: ElapsedTime) => void
  onNext: () => void
  onBack: () => void
}

export function AfterCareStep3({ value, onChange, onNext, onBack }: Step3Props) {
  return (
    <>
      <div className="mb-5">
        <p className="text-[11px] font-medium text-orange-700 tracking-widest mb-1.5">
          STEP 3 / {AFTERCARE_TOTAL_STEPS}
        </p>
        <h2 className="text-xl font-medium leading-snug tracking-tight">
          日焼けしてから<br />どれくらい経ちますか？
        </h2>
      </div>
      <div className="flex flex-col gap-2.5">
        {ELAPSED_OPTIONS.map((o) => (
          <ChoiceCard
            key={o.value}
            emoji={o.emoji}
            label={ELAPSED_LABEL[o.value]}
            description={o.desc}
            selected={value === o.value}
            onClick={() => onChange(o.value)}
          />
        ))}
      </div>
      <NavRow
        onBack={onBack}
        onNext={onNext}
        nextLabel="ケアガイドを見る →"
        disabled={!value}
      />
    </>
  )
}