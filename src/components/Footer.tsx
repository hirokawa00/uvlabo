import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border mt-16 bg-background">
      <div className="max-w-lg mx-auto px-4 py-8">

        {/* ロゴ */}
        <div className="flex items-center gap-1.5 mb-4">
          <span>☀️</span>
          <span className="text-sm font-medium">
            UV<span className="text-emerald-700">lab</span>
          </span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed mb-6">
          UV指数の確認から日焼け止め選び・事後ケアまで、
          紫外線ケアをトータルでサポートするサービスです。
        </p>

        {/* 注意書き */}
        <div className="p-3 rounded-lg bg-secondary/50 border border-border mb-6">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            ※ 掲載しているUV指数は気象庁データをもとにした推定値です。
            本サービスの情報は医療アドバイスではありません。
            症状が重い場合は皮膚科専門医にご相談ください。
            本サービスにはアフィリエイト広告が含まれます。
          </p>
        </div>

        {/* リンク */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground mb-6">
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            プライバシーポリシー
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            利用規約
          </Link>
          <Link href="/legal" className="hover:text-foreground transition-colors">
            特定商取引法に基づく表記
          </Link>
        </div>

        <p className="text-[11px] text-muted-foreground">
          © {currentYear} UVlab. All rights reserved.
        </p>
      </div>
    </footer>
  )
}