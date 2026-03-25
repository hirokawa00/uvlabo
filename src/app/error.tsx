"use client"

import { useEffect } from "react"

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    // エラーログ（本番では Sentry 等に送信）
    console.error("App Error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="text-5xl mb-5">⛅</p>
        <h2 className="text-xl font-medium mb-2">データの取得に失敗しました</h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          気象庁APIへの接続に問題が発生しました。<br />
          しばらく待ってから再度お試しください。
        </p>
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={reset}
            className="w-full py-3 rounded-xl bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 transition-colors"
          >
            再試行する
          </button>
          <a
            href="/"
            className="w-full py-3 rounded-xl border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors text-center"
          >
            トップページへ戻る
          </a>
        </div>
      </div>
    </div>
  )
}