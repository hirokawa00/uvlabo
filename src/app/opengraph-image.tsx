import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "UVlab - 紫外線ケアガイド・日焼け止め診断"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f0fdf4",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* 背景装飾 */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(16, 185, 129, 0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(251, 191, 36, 0.1)",
          }}
        />

        {/* ロゴ */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "32px",
          }}
        >
          <span style={{ fontSize: 56 }}>☀️</span>
          <span
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: "#064e3b",
              letterSpacing: "-2px",
            }}
          >
            UV
            <span style={{ color: "#059669" }}>lab</span>
          </span>
        </div>

        {/* キャッチコピー */}
        <h1
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: "#064e3b",
            textAlign: "center",
            lineHeight: 1.4,
            margin: "0 0 16px",
            letterSpacing: "-1px",
          }}
        >
          紫外線ケアガイド
        </h1>

        <p
          style={{
            fontSize: 24,
            color: "#065f46",
            textAlign: "center",
            margin: "0 0 48px",
            opacity: 0.8,
          }}
        >
          UV指数 × 日焼け止め診断 × 事後ケア
        </p>

        {/* 3機能バッジ */}
        <div
          style={{
            display: "flex",
            gap: "16px",
          }}
        >
          {[
            { emoji: "☀️", label: "UV指数" },
            { emoji: "🔍", label: "日焼け止め診断" },
            { emoji: "🌊", label: "事後ケア" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                background: "white",
                borderRadius: "48px",
                border: "1.5px solid #d1fae5",
                fontSize: 20,
                color: "#065f46",
                fontWeight: 500,
              }}
            >
              <span>{item.emoji}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* URL */}
        <p
          style={{
            position: "absolute",
            bottom: 36,
            right: 60,
            fontSize: 18,
            color: "#6ee7b7",
          }}
        >
          uvlab.jp
        </p>
      </div>
    ),
    { ...size }
  )
}