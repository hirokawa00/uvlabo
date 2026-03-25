import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記・広告表示",
  description: "UVlabの運営者情報・アフィリエイト表記・広告に関する表示です。",
  robots: { index: true, follow: false },
}

type TableRow = { label: string; value: string }

const OPERATOR_INFO: TableRow[] = [
  { label: "サービス名", value: "UVlab" },
  { label: "運営者", value: "個人運営（氏名はお問い合わせにて開示します）" },
  { label: "所在地", value: "お問い合わせにて開示します" },
  { label: "連絡先", value: "サービス内お問い合わせフォームよりご連絡ください" },
  { label: "サービス内容", value: "UV指数の表示・日焼け止め診断・事後ケアガイドの無料提供" },
  { label: "料金", value: "無料（一部機能は有料プランを予定）" },
  { label: "支払方法", value: "クレジットカード（Stripe経由、有料プラン開始時）" },
]

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← トップに戻る
          </Link>
          <span className="text-muted-foreground/40">|</span>
          <span className="text-sm font-medium">
            UV<span className="text-emerald-700">lab</span>
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 space-y-12">

        {/* 特定商取引法 */}
        <section>
          <h1 className="text-2xl font-medium mb-1.5">特定商取引法に基づく表記</h1>
          <p className="text-sm text-muted-foreground mb-6">
            特定商取引法第11条に基づき、以下の情報を開示します。
          </p>
          <div className="rounded-xl border border-border overflow-hidden">
            {OPERATOR_INFO.map((row, i) => (
              <div
                key={i}
                className="flex border-b border-border last:border-0"
              >
                <div className="w-40 shrink-0 px-4 py-3.5 bg-secondary/50 text-xs font-medium text-muted-foreground">
                  {row.label}
                </div>
                <div className="flex-1 px-4 py-3.5 text-sm text-foreground">
                  {row.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* アフィリエイト表記 */}
        <section>
          <h2 className="text-xl font-medium mb-4">広告・アフィリエイトに関する表示</h2>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <p className="font-medium text-amber-900 mb-1.5">
                当サービスはアフィリエイト広告を掲載しています
              </p>
              <p className="text-amber-800">
                本サービスの一部ページには、アフィリエイトリンクが含まれています。
                リンクを経由して商品をご購入いただいた場合、
                当サービスに紹介報酬が発生することがありますが、
                ユーザーへの追加費用は一切発生しません。
              </p>
            </div>

            <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-3">
              <p className="font-medium text-foreground">参加アフィリエイトプログラム</p>
              <ul className="space-y-2">
                {[
                  {
                    name: "Amazonアソシエイト",
                    detail: "Amazonが提供するアフィリエイトプログラムです。商品リンクを経由したご購入に対して、売上の一部が報酬として支払われます。",
                  },
                  {
                    name: "A8.net（ファンコミュニケーションズ）",
                    detail: "国内最大級のアフィリエイトサービスを通じた各種美容・スキンケア製品の紹介を行っています。",
                  },
                ].map((program, i) => (
                  <li key={i} className="border-b border-border/50 last:border-0 pb-3 last:pb-0">
                    <p className="text-sm font-medium text-foreground mb-0.5">{program.name}</p>
                    <p className="text-xs text-muted-foreground">{program.detail}</p>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs">
              掲載製品の選定にあたっては、アフィリエイト報酬の有無にかかわらず、
              ユーザーにとって有益な製品を選ぶことを原則としています。
              ただし、複数の製品が同程度に適合する場合、
              アフィリエイト案件のあるものを優先して表示することがあります。
            </p>
          </div>
        </section>

        {/* 免責 */}
        <section>
          <h2 className="text-xl font-medium mb-4">コンテンツの正確性について</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            当サービスが提供するUV指数・ケアアドバイス・製品情報は、
            一般的な情報提供を目的としたものであり、医療行為・医療アドバイスではありません。
            皮膚に関する症状・治療については、必ず皮膚科専門医にご相談ください。
            掲載情報の正確性・完全性について万全を期していますが、
            その内容を保証するものではありません。
          </p>
        </section>

        <div className="pt-6 border-t border-border flex gap-4 text-xs text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground transition-colors">プライバシーポリシー</Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">利用規約</Link>
          <Link href="/" className="hover:text-foreground transition-colors">トップ</Link>
        </div>
      </main>
    </div>
  )
}