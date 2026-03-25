import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "UVlabのプライバシーポリシーです。位置情報の取得・利用方法についてご確認ください。",
  robots: { index: true, follow: false },
}

const LAST_UPDATED = "2025年5月1日"

export default function PrivacyPage() {
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
        <h1 className="text-2xl font-medium mb-1.5">プライバシーポリシー</h1>
        <p className="text-sm text-muted-foreground mb-10">最終更新日：{LAST_UPDATED}</p>

        <div className="space-y-10 text-sm leading-relaxed">

          <section>
            <h2 className="text-base font-medium mb-3">1. はじめに</h2>
            <p className="text-muted-foreground">
              UVlab（以下「当サービス」）は、ユーザーのプライバシーを尊重し、
              個人情報の保護に努めます。本ポリシーは、当サービスが収集・利用する
              情報の種類と目的を説明します。
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-3">2. 取得する情報</h2>
            <div className="space-y-4 text-muted-foreground">
              <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                <p className="font-medium text-foreground mb-1.5">位置情報（緯度・経度）</p>
                <p>
                  UV指数の取得・表示のためにブラウザのGeolocation APIを使用します。
                  位置情報の取得には事前に許可を求め、取得した情報はサーバーに
                  保存されません。UV指数の取得のみに使用し、処理後は破棄されます。
                </p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                <p className="font-medium text-foreground mb-1.5">診断入力情報</p>
                <p>
                  日焼け止め診断・事後ケアガイドで入力いただく肌タイプ・シーン・
                  予算等の情報は、ブラウザ上での結果表示のみに使用します。
                  サーバーへの送信・保存は行いません。
                </p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                <p className="font-medium text-foreground mb-1.5">アクセス解析情報</p>
                <p>
                  サービス改善のためGoogle Analytics 4を使用する場合があります。
                  収集されるデータはIPアドレス・ページビュー・利用デバイス等の
                  統計情報のみで、個人を特定するものではありません。
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-medium mb-3">3. Cookieの使用</h2>
            <p className="text-muted-foreground">
              当サービスはGoogle Analytics、およびアフィリエイトプログラム
              （Amazonアソシエイト・A8.net等）のためにCookieを使用する場合があります。
              ブラウザの設定からCookieを無効化することができますが、
              一部の機能が正常に動作しない可能性があります。
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-3">4. アフィリエイトについて</h2>
            <p className="text-muted-foreground">
              当サービスはAmazonアソシエイト・A8.net等のアフィリエイトプログラムに
              参加しています。製品リンクを経由してご購入いただいた場合、
              当サービスに紹介報酬が発生することがあります。
              ユーザーへの追加費用は一切発生しません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-3">5. 第三者への提供</h2>
            <p className="text-muted-foreground">
              取得した情報を法令に基づく場合を除き、第三者に提供することはありません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-3">6. 未成年の利用</h2>
            <p className="text-muted-foreground">
              当サービスは13歳未満の方を対象としたサービスではありません。
              13歳未満の方の個人情報を意図的に収集することはありません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-3">7. ポリシーの変更</h2>
            <p className="text-muted-foreground">
              本ポリシーは予告なく変更される場合があります。
              変更後のポリシーは本ページに掲載した時点で効力を生じます。
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium mb-3">8. お問い合わせ</h2>
            <p className="text-muted-foreground">
              本ポリシーに関するお問い合わせは、サービス内のお問い合わせフォームより
              ご連絡ください。
            </p>
          </section>

        </div>

        <div className="mt-12 pt-6 border-t border-border flex gap-4 text-xs text-muted-foreground">
          <Link href="/terms" className="hover:text-foreground transition-colors">利用規約</Link>
          <Link href="/legal" className="hover:text-foreground transition-colors">特定商取引法に基づく表記</Link>
          <Link href="/" className="hover:text-foreground transition-colors">トップ</Link>
        </div>
      </main>
    </div>
  )
}