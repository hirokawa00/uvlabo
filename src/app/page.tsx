"use client"

import { useState } from "react"
import { UVCard } from "@/components/UVCard"
import { DiagnosisContainer } from "@/components/diagnosis/DiagnosisContainer"
import { AfterCareContainer } from "@/components/aftercare/AfterCareContainer"
import { Footer } from "@/components/Footer"

type Tab = "uv" | "diagnosis" | "aftercare"

const TABS: { key: Tab; label: string; emoji: string }[] = [
  { key: "uv",        label: "UV指数",       emoji: "☀️" },
  { key: "diagnosis", label: "日焼け止め診断", emoji: "🔍" },
  { key: "aftercare", label: "事後ケア",      emoji: "🌊" },
]

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("uv")
  const [currentUV, setCurrentUV] = useState<number | undefined>(undefined)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">☀️</span>
            <span className="text-base font-medium tracking-tight">
              UV<span className="text-emerald-700">lab</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground">紫外線ケアガイド</p>
        </div>
        <div className="max-w-lg mx-auto px-4">
          <div className="flex">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={[
                  "flex-1 py-2.5 text-xs transition-all border-b-2 flex items-center justify-center gap-1",
                  activeTab === tab.key
                    ? tab.key === "aftercare"
                      ? "border-orange-600 text-orange-700 font-medium"
                      : "border-emerald-700 text-emerald-700 font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                <span className="text-sm leading-none">{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5">
        {activeTab === "uv" && (
          <div className="space-y-4">
            <UVCard spf={50} onUVLoaded={(uv) => setCurrentUV(uv)} />
            <button
              type="button"
              onClick={() => setActiveTab("diagnosis")}
              className="w-full py-3.5 rounded-xl bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 active:scale-[0.98] transition-all"
            >
              今日の日焼け止めを診断する →
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("aftercare")}
              className="w-full py-3 rounded-xl border border-orange-300 text-orange-700 text-sm font-medium hover:bg-orange-50 transition-all"
            >
              日焼けしてしまったら →
            </button>
          </div>
        )}
        {activeTab === "diagnosis" && <DiagnosisContainer uvIndex={currentUV} />}
        {activeTab === "aftercare" && <AfterCareContainer />}
      </main>

      <Footer />
    </div>
  )
}