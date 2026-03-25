"use client"

import { useState, useCallback } from "react"
import type {
  DiagnosisInput,
  DiagnosisStep,
  SkinType,
  UseScene,
  MakeupStyle,
  BudgetRange,
  TexturePreference,
} from "@/lib/diagnosis/types"
import { runDiagnosis } from "@/lib/diagnosis/engine"
import { StepBar, Step1, Step2, Step3, Step4, Step5 } from "./DiagnosisSteps"
import { DiagnosisResult } from "./DiagnosisResult"

type Props = {
  /** UVCardから受け取るUV指数（任意） */
  uvIndex?: number
}

type State = {
  step: DiagnosisStep | "result" | "start"
  skinType: SkinType | null
  scene: UseScene | null
  makeupStyle: MakeupStyle | null
  budget: BudgetRange | null
  texture: TexturePreference | null
}

const INITIAL_STATE: State = {
  step: "start",
  skinType: null,
  scene: null,
  makeupStyle: null,
  budget: null,
  texture: null,
}

export function DiagnosisContainer({ uvIndex }: Props) {
  const [state, setState] = useState<State>(INITIAL_STATE)

  const update = useCallback(<K extends keyof State>(key: K, value: State[K]) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }, [])

  const goTo = useCallback((step: State["step"]) => {
    setState((prev) => ({ ...prev, step }))
    // スクロールをトップに戻す（モバイル対応）
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const handleRetry = useCallback(() => {
    setState(INITIAL_STATE)
  }, [])

  // ─── 開始画面 ─────────────────────────────────────────────────
  if (state.step === "start") {
    return (
      <div className="space-y-4">
        <div className="text-center py-6">
          <p className="text-3xl mb-3">🌞</p>
          <h2 className="text-lg font-medium mb-1.5">今日の日焼け止めを診断</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            5つの質問に答えるだけで<br />
            あなたに最適な日焼け止めが分かります
          </p>
        </div>
        <button
          type="button"
          onClick={() => goTo(1)}
          className="w-full py-4 rounded-xl bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 active:scale-[0.98] transition-all"
        >
          診断をはじめる →
        </button>
        {uvIndex !== undefined && (
          <p className="text-center text-xs text-muted-foreground">
            今日のUV指数 <span className="font-medium text-foreground">{uvIndex}</span> をもとに最適化します
          </p>
        )}
      </div>
    )
  }

  // ─── 結果画面 ─────────────────────────────────────────────────
  if (state.step === "result") {
    // 全項目が入力済みであることを確認
    if (
      !state.skinType ||
      !state.scene ||
      !state.makeupStyle ||
      !state.budget ||
      !state.texture
    ) {
      setState(INITIAL_STATE)
      return null
    }

    const input: DiagnosisInput = {
      skinType: state.skinType,
      scene: state.scene,
      makeupStyle: state.makeupStyle,
      budget: state.budget,
      texture: state.texture,
      uvIndex,
    }

    const result = runDiagnosis(input)

    return <DiagnosisResult result={result} onRetry={handleRetry} />
  }

  // ─── ステップ画面 ─────────────────────────────────────────────
  return (
    <div>
      <StepBar current={state.step as DiagnosisStep} />

      {state.step === 1 && (
        <Step1
          value={state.skinType}
          onChange={(v) => update("skinType", v)}
          onNext={() => goTo(2)}
        />
      )}

      {state.step === 2 && (
        <Step2
          value={state.scene}
          onChange={(v) => update("scene", v)}
          onNext={() => goTo(3)}
          onBack={() => goTo(1)}
        />
      )}

      {state.step === 3 && (
        <Step3
          value={state.makeupStyle}
          onChange={(v) => update("makeupStyle", v)}
          onNext={() => goTo(4)}
          onBack={() => goTo(2)}
        />
      )}

      {state.step === 4 && (
        <Step4
          value={state.budget}
          onChange={(v) => update("budget", v)}
          onNext={() => goTo(5)}
          onBack={() => goTo(3)}
        />
      )}

      {state.step === 5 && (
        <Step5
          value={state.texture}
          onChange={(v) => update("texture", v)}
          onNext={() => goTo("result")}
          onBack={() => goTo(4)}
        />
      )}
    </div>
  )
}