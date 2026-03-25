import type { Metadata, Viewport } from "next"
import { Noto_Sans_JP } from "next/font/google"
import "./globals.css"

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto",
})

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://uvlab.jp"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "UVlab | 紫外線ケアガイド・日焼け止め診断",
    template: "%s | UVlab",
  },
  description:
    "今日のUV指数を確認して、肌タイプ・シーン・予算に合った日焼け止めを診断。日焼けしてしまったときの事後ケア手順も分かる紫外線ケア特化サービスです。",
  keywords: [
    "紫外線", "UV指数", "日焼け止め", "日焼け止め診断", "SPF", "PA",
    "日焼けケア", "事後ケア", "シミ予防", "美白", "敏感肌",
  ],
  authors: [{ name: "UVlab" }],
  creator: "UVlab",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: BASE_URL,
    siteName: "UVlab",
    title: "UVlab | 紫外線ケアガイド・日焼け止め診断",
    description:
      "今日のUV指数を確認して、肌タイプ別に最適な日焼け止めを診断。日焼けあとのケア手順も分かります。",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "UVlab - 紫外線ケアガイド",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UVlab | 紫外線ケアガイド・日焼け止め診断",
    description:
      "今日のUV指数を確認して、肌タイプ別に最適な日焼け止めを診断。日焼けあとのケア手順も分かります。",
    images: ["/opengraph-image.png"],
    creator: "@uvlab_jp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <head>
        {/* PWA マニフェスト */}
        <link rel="manifest" href="/manifest.json" />
        {/* ファビコン */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${notoSansJP.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}