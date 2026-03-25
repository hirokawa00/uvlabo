import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "利用規約",
  description: "UVlabの利用規約です。",
  robots: { index: true, follow: false },
}

const LAST_UPDATED = "2025年5月1日"

export default function TermsPage() {
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

      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-medium mb-1.5">利用規約</h1>
        <p className="text-sm text-muted-foreground mb-10">最終更新日：{LAST_UPDATED}</p>

        <div className="space-y-10 text-sm leading-relaxed">

          <section>
            <h2 className="text-base font-medium mb-3">第1条（適用）</h2>
            <p className="text-muted-foreground">
              本規約は、UVlab（以下「当サービス」）の利用条件を定めるものです。
              ユーザーの皆さまには、本規約に従って当サービスをご利用いただきます。
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-3">第2条（免責事項）</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                当サービスが提供するUV指数は、気象庁の天気予報データをもとに
                推定した参考値です。実際の紫外線量と異なる場合があります。
                当サービスの情報を参考にした行動によって生じた損害について、
                運営者は責任を負いません。
              </p>
              <p>
                日焼け止め診断・事後ケアガイドの内容は一般的な情報提供を目的としており、
                医療行為・医療アドバイスではありません。症状が重い場合や心配な場合は、
                必ず皮膚科専門医にご相談ください。
              </p>
              <p>
                掲載している製品情報・価格は予告なく変更される場合があります。
                最新情報は各販売サイトにてご確認ください。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-medium mb-3">第3条（禁止事項）</h2>
            <ul className="space-y-2 text-muted-foreground">
              {[
                "当サービスのコンテンツを無断で転載・複製する行為",
                "当サービスのシステムに過度な負荷をかける行為",
                "当サービスを通じて虚偽の情報を流布する行為",
                "その他、運営者が不適切と判断する行為",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-muted-foreground/50 shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-base font-medium mb-3">第4条（サービスの変更・停止）</h2>
            <p className="text-muted-foreground">
              運営者は、ユーザーへの事前通知なく当サービスの内容を変更・停止することが
              あります。これによってユーザーに生じた損害について、運営者は責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-3">第5条（著作権）</h2>
            <p className="text-muted-foreground">
              当サービスに掲載されているコンテンツ（テキスト・画像・UI等）の著作権は
              運営者に帰属します。無断転載・二次利用を禁じます。
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-3">第6条（準拠法・管轄裁判所）</h2>
            <p className="text-muted-foreground">
              本規約の解釈にあたっては、日本法を準拠法とします。
              当サービスに関する紛争については、東京地方裁判所を専属的合意管轄とします。
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-3">第7条（規約の変更）</h2>
            <p className="text-muted-foreground">
              運営者は、必要と判断した場合には予告なく本規約を変更できるものとします。
              変更後の規約は本ページに掲載した時点で効力を生じます。
            </p>
          </section>

        </div>

        <div className="mt-12 pt-6 border-t border-border flex gap-4 text-xs text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground transition-colors">プライバシーポリシー</Link>
          <Link href="/legal" className="hover:text-foreground transition-colors">特定商取引法に基づく表記</Link>
          <Link href="/" className="hover:text-foreground transition-colors">トップ</Link>
        </div>
      </main>
    </div>
  )
}