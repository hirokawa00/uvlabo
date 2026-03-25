import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "UVlaboへのご質問・ご要望・不具合報告はこちらからどうぞ。",
  robots: { index: true, follow: false },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}