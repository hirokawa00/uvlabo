import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";

type Bindings = {
  RESEND_API_KEY: string;
  CONTACT_TO_EMAIL: string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");
app.use("*", cors());

// ── バリデーションスキーマ ────────────────────────────────────────
const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "お名前を入力してください")
    .max(50, "件名が大きすぎます"),
  email: z
    .string()
    .trim()
    .min(1, "メールアドレスを入力してください")
    .pipe(z.email("メールアドレスの形式が正しくありません")),
  category: z.enum(["service", "bug", "affiliation", "content", "other"]),
  message: z.string().trim().min(1, "お問い合わせ内容を入力してください"),
});

const CATEGORY_LABEL: Record<string, string> = {
  service: "サービスについて",
  bug: "不具合・エラーの報告",
  affiliation: "アフィリエイト・広告について",
  content: "コンテンツの誤りについて",
  other: "その他",
};

// ── POST /api/contact ─────────────────────────────────────────────
app.post("/contact", zValidator("json", contactSchema), async (c) => {
  const { name, email, category, message } = c.req.valid("json");

  const resendApiKey = c.env?.RESEND_API_KEY as string | undefined;
  const toEmail = c.env?.CONTACT_TO_EMAIL as string | undefined;

  // ── Resend未設定時はログのみ（開発環境対応）──────────────────
  if (!resendApiKey || !toEmail) {
    console.log("【お問い合わせ受信（Resend未設定）】", {
      name,
      email,
      category,
      message,
    });
    return c.json({ success: true, note: "dev_mode" });
  }

  // ── 管理者への通知メール ──────────────────────────────────────
  const adminMailBody = `
お問い合わせが届きました。

■ 種別: ${CATEGORY_LABEL[category]}
■ お名前: ${name}
■ メールアドレス: ${email}

■ 内容:
${message}

---
UVlabo お問い合わせフォーム
https://uvlabo.com/contact
    `.trim();

  // ── 自動返信メール ────────────────────────────────────────────
  const autoReplyBody = `
${name} 様

お問い合わせありがとうございます。
以下の内容でお問い合わせを受け付けました。

■ 種別: ${CATEGORY_LABEL[category]}
■ 内容:
${message}

内容を確認の上、3営業日以内にご返信いたします。
しばらくお待ちください。

---
UVlabo（紫外線ケアガイド）
https://uvlabo.com
    `.trim();

  try {
    // 管理者への通知と自動返信を並列送信
    const [adminRes, replyRes] = await Promise.all([
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "UVlabo <noreply@uvlabo.com>",
          to: [toEmail],
          subject: `【お問い合わせ】${CATEGORY_LABEL[category]} - ${name}様`,
          text: adminMailBody,
          reply_to: email,
        }),
      }),
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "UVlabo <noreply@uvlabo.com>",
          to: [email],
          subject: "【UVlabo】お問い合わせを受け付けました",
          text: autoReplyBody,
        }),
      }),
    ]);

    if (!adminRes.ok) {
      const err = await adminRes.json().catch(() => ({}));
      console.error("Resend送信失敗:", err);
      return c.json(
        {
          error: "メールの送信に失敗しました。時間をおいて再度お試しください。",
        },
        500,
      );
    }

    return c.json({ success: true });
  } catch (e) {
    console.error("Contact API error:", e);
    return c.json({ error: "送信中にエラーが発生しました。" }, 500);
  }
});

// ── Next.js App Router エクスポート ───────────────────────────────
export const POST = (req: Request) => app.fetch(req);
