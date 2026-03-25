"use client"

import { useState, useCallback } from "react"
import type {
  BurnLevel,
  BurnArea,
  ElapsedTime,
  AfterCareStep,
  AfterCareInput,
} from "@/lib/aftercare/types"
import { buildAfterCareGuide } from "@/lib/aftercare/engine"
import {
  AfterCareStepBar,
  AfterCareStep1,
  AfterCareStep2,
  AfterCareStep3,
} from "./AfterCareSteps"
import { AfterCareGuideResult } from "./AfterCareGuideResult"

type State = {
  step: AfterCareStep | "start" | "result"
  burnLevel: BurnLevel | null
  areas: BurnArea[]
  elapsed: ElapsedTime | null
}

const INITIAL_STATE: State = {
  step: "start",
  burnLevel: null,
  areas: [],
  elapsed: null,
}

export function AfterCareContainer() {
  const [state, setState] = useState<State>(INITIAL_STATE)

  const goTo = useCallback((step: State["step"]) => {
    setState((prev) => ({ ...prev, step }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const handleRetry = useCallback(() => setState(INITIAL_STATE), [])

  // ── 開始画面 ──────────────────────────────────────────────────
  if (state.step === "start") {
    return (
      <div className="space-y-4">
        <div className="text-center py-6">
          <p className="text-3xl mb-3">🌊</p>
          <h2 className="text-lg font-medium mb-1.5">日焼けあとのケアガイド</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            焼けた程度・部位・経過時間を入力するだけで<br />
            今夜から始められるケア手順が分かります
          </p>
        </div>
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
          <p className="text-xs text-amber-800 leading-relaxed">
            💡 <strong>ポイント：</strong>日焼け後72時間以内のケアが
            シミ・色素沈着の予防に最も効果的です。
          </p>
        </div>
        <button
          type="button"
          onClick={() => goTo(1)}
          className="w-full py-4 rounded-xl bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 active:scale-[0.98] transition-all"
        >
          ケアガイドをはじめる →
        </button>
      </div>
    )
  }

  // ── 結果画面 ──────────────────────────────────────────────────
  if (state.step === "result") {
    if (!state.burnLevel || state.areas.length === 0 || !state.elapsed) {
      setState(INITIAL_STATE)
      return null
    }
    const input: AfterCareInput = {
      burnLevel: state.burnLevel,
      areas: state.areas,
      elapsed: state.elapsed,
    }
    const guide = buildAfterCareGuide(input)
    return <AfterCareGuideResult guide={guide} onRetry={handleRetry} />
  }

  // ── ステップ画面 ──────────────────────────────────────────────
  return (
    <div>
      <AfterCareStepBar current={state.step as AfterCareStep} />

      {state.step === 1 && (
        <AfterCareStep1
          value={state.burnLevel}
          onChange={(v) => setState((p) => ({ ...p, burnLevel: v }))}
          onNext={() => goTo(2)}
        />
      )}
      {state.step === 2 && (
        <AfterCareStep2
          value={state.areas}
          onChange={(v) => setState((p) => ({ ...p, areas: v }))}
          onNext={() => goTo(3)}
          onBack={() => goTo(1)}
        />
      )}
      {state.step === 3 && (
        <AfterCareStep3
          value={state.elapsed}
          onChange={(v) => setState((p) => ({ ...p, elapsed: v }))}
          onNext={() => goTo("result")}
          onBack={() => goTo(2)}
        />
      )}
    </div>
  )
}