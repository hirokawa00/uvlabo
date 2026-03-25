import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="text-6xl mb-6">☀️</p>
        <h1 className="text-2xl font-medium mb-2">ページが見つかりません</h1>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          お探しのページは移動・削除されたか、<br />
          URLが間違っている可能性があります。
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 transition-colors"
        >
          トップページへ戻る
        </Link>
      </div>
    </div>
  )
}