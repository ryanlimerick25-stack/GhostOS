import OpenAI from "openai";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

type AuditInput = {
  followers: number;
  avgViews: number;
  engagementRate: number;
  niche: string;
  audienceGeo: string;
  tiktokHandle?: string;
};

export async function POST(req: Request) {
  try {
    const authResult = await auth().catch(() => ({ userId: null }));
    const userId = authResult?.userId;
    const key = process.env.OPENAI_API_KEY;
    if (!key) return Response.json({ error: "OPENAI_API_KEY missing" }, { status: 500 });

    const input = (await req.json()) as AuditInput;
    if (!input || !Number.isFinite(input.followers) || !Number.isFinite(input.avgViews) || !Number.isFinite(input.engagementRate) || !input.niche || !input.audienceGeo) {
      return Response.json({ error: "Invalid input. Please fill all fields." }, { status: 400 });
    }

    const client = new OpenAI({ apiKey: key });

    const prompt = `
You are a sharp, realistic talent manager who helps TikTok creators (20k–200k followers) land their FIRST brand deal.
Be practical. Be strategic. No fluff.

Use these REAL market benchmarks when calculating rates and scores:

TIKTOK PLATFORM PAYOUTS (Creator Rewards Program):
- $0.40–$1.00 per 1,000 views (RPM)
- 1M views = roughly $400–$1,000 from TikTok directly
- Creators need 10k+ followers and 100k+ views/30 days to qualify

BRAND DEAL RATES BY TIER (sourced from 2025-2026 market data):
- 20k–50k followers: $100–$500 per post (median $250)
- 50k–100k followers: $300–$1,200 per post (median $600)
- 100k–150k followers: $800–$4,000 per post (median $2,000)
- 150k–200k followers: $1,500–$6,000 per post (median $3,000)

NICHE MULTIPLIERS (apply to base rate):
- Finance & Money: 3-4x multiplier (highest advertiser spend, $2,000-10,000 CLV)
- Tech & Gadgets: 2-3x multiplier
- Beauty & Skincare: 2-2.5x multiplier (strongest purchase driver)
- Fashion & Style: 1.8-2x multiplier
- Fitness & Health: 1.5-2x multiplier
- Food & Cooking: 1.3-1.5x multiplier
- Gaming: 1.3-1.5x multiplier
- Education: 1.5-2x multiplier
- Travel & Lifestyle: 1.2-1.5x multiplier
- Music & Dance: 0.8-1x multiplier (lower brand ROI, harder to monetize)
- Comedy & Entertainment: 0.8-1x multiplier
- All other niches: 1x multiplier (use base rate)

ENGAGEMENT MULTIPLIERS:
- 10%+ engagement: multiply rate by 1.5
- 6-10% engagement: multiply rate by 1.25
- 3-6% engagement: multiply rate by 1.0
- Below 3% engagement: multiply rate by 0.7

AUDIENCE MULTIPLIERS:
- US-majority audience: multiply rate by 1.3
- US + UK mixed: multiply rate by 1.2
- International/mixed: multiply rate by 0.8

PACKAGE PRICING:
- 3-post package: 2.5x single post rate
- Monthly ambassador: 3.5x single post rate
- Usage rights add-on (30-90 days): +25% to base rate
- Extended usage rights (6+ months): +50-100% to base rate
- Exclusivity add-on: +25-50% to base rate

OTHER REVENUE STREAMS:
- TikTok Shop affiliate commissions: 5-20% per sale
- TikTok Creator Rewards: $0.40-$1.00 per 1,000 views
- Live gifts: $20-$300+ per livestream

SCORING GUIDE:
- Engagement rate above 6% = strong signal (+15 points)
- Engagement rate 3–6% = average (0 points)
- Engagement rate below 3% = weak (-10 points)
- Views/followers ratio above 50% = excellent (+10 points)
- US-heavy audience = brand premium (+10 points)
- Clear niche = easier to place (+10 points)

Creator stats:
- Followers: ${input.followers}
- Avg views (last 10 vids): ${input.avgViews}
- Engagement rate (%): ${input.engagementRate}
- Niche: ${input.niche}
- Audience geography: ${input.audienceGeo}
${input.tiktokHandle ? `- TikTok handle: ${input.tiktokHandle}` : ""}

Output STRICTLY as valid JSON with this schema:
{
  "readiness_score": number,
  "estimated_first_deal_range_usd": { "low": number, "target": number, "high": number },
  "best_fit_brand_categories": string[],
  "why_brands_would_pay": string[],
  "top_gaps_to_fix_next_14_days": string[],
  "next_actions": { "today": string[], "this_week": string[], "this_month": string[] },
  "media_kit_positioning": string,
  "media_kit_brand_pitch_bullets": string[],
  "rate_card_usd": {
    "single_post": number,
    "three_post_package": number,
    "monthly_ambassador": number,
    "usage_rights_addon": number,
    "exclusivity_addon": number
  },
  "cold_outreach_templates": {
    "direct_brand": string,
    "agency": string,
    "follow_up": string
  }
}
Rules:
- Return ONLY valid JSON. No markdown. No explanation.
- Make rate card numbers realistic for a first brand deal.
- Outreach templates should be short, confident, and niche-specific.
- Lists should contain 3–6 items max.
`;

    const resp = await client.responses.create({ model: "gpt-4.1-mini", input: prompt });
    const text = (resp.output_text || "").trim();
    let jsonStr = text;
    if (!text.startsWith("{")) { const match = text.match(/\{[\s\S]*\}/); if (match) jsonStr = match[0]; }
    const data = JSON.parse(jsonStr);

    if (userId) {
      await supabase.from("audits").insert({
        user_id: userId,
        followers: input.followers,
        avg_views: input.avgViews,
        engagement_rate: input.engagementRate,
        niche: input.niche,
        audience_geo: input.audienceGeo,
        tiktok_handle: input.tiktokHandle || null,
        readiness_score: data.readiness_score,
        deal_low: data.estimated_first_deal_range_usd.low,
        deal_target: data.estimated_first_deal_range_usd.target,
        deal_high: data.estimated_first_deal_range_usd.high,
        result: data,
      });

      // Send post-audit email
      try {
        const clerk = await clerkClient();
        const user = await clerk.users.getUser(userId);
        const email = user.emailAddresses?.[0]?.emailAddress;
        const name = user.firstName || "Creator";
        const score = data.readiness_score;
        const low = data.estimated_first_deal_range_usd.low;
        const high = data.estimated_first_deal_range_usd.high;
        const handle = input.tiktokHandle ? `@${input.tiktokHandle}` : "your account";

        if (email) {
          await resend.emails.send({
            from: "GhostOS <onboarding@resend.dev>",
            to: email,
            subject: `Your audit is ready — you scored ${score}/100`,
            html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>
  body { margin: 0; padding: 0; background: #04040a; font-family: 'Helvetica Neue', Arial, sans-serif; color: #e8e6e1; }
  .wrap { max-width: 560px; margin: 0 auto; padding: 48px 24px; }
  .logo { font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 40px; }
  .dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #a78bfa; margin-right: 6px; }
  h1 { font-size: 28px; font-weight: 700; color: #fff; line-height: 1.2; margin: 0 0 16px; letter-spacing: -0.02em; }
  p { font-size: 15px; color: rgba(255,255,255,0.55); line-height: 1.7; margin: 0 0 16px; }
  .highlight { color: rgba(255,255,255,0.85); }
  .score-box { background: rgba(167,139,250,0.08); border: 1px solid rgba(167,139,250,0.2); border-radius: 16px; padding: 28px; margin: 28px 0; text-align: center; }
  .score-num { font-size: 64px; font-weight: 700; color: #a78bfa; line-height: 1; margin-bottom: 8px; }
  .score-label { font-size: 13px; color: rgba(255,255,255,0.35); letter-spacing: 0.1em; text-transform: uppercase; }
  .rate-row { display: flex; justify-content: space-between; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 18px 22px; margin: 16px 0; }
  .rate-label { font-size: 13px; color: rgba(255,255,255,0.4); }
  .rate-value { font-size: 18px; font-weight: 600; color: #fff; }
  .btn { display: inline-block; margin: 24px 0; padding: 14px 32px; background: linear-gradient(135deg,#a78bfa,#818cf8); color: #fff; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 15px; }
  .divider { height: 1px; background: rgba(255,255,255,0.06); margin: 32px 0; }
  .footer { font-size: 12px; color: rgba(255,255,255,0.2); line-height: 1.6; }
  .footer a { color: rgba(167,139,250,0.6); text-decoration: none; }
</style></head>
<body>
<div class="wrap">
  <div class="logo"><span class="dot"></span>GhostOS</div>
  <h1>${name}, your audit results are in.</h1>
  <p>We just finished analyzing <span class="highlight">${handle}</span>. Here's the summary:</p>

  <div class="score-box">
    <div class="score-num">${score}</div>
    <div class="score-label">Brand Deal Readiness Score</div>
  </div>

  <div class="rate-row">
    <div>
      <div class="rate-label">Estimated First Deal Range</div>
      <div class="rate-value">$${low.toLocaleString()} – $${high.toLocaleString()}</div>
    </div>
  </div>

  <p>Your full results include your rate card, cold outreach templates, media kit positioning, and a 14-day action plan. Log in to view everything.</p>

  <a href="https://ghostos.live/dashboard" class="btn">View Full Results →</a>

  <div class="divider"></div>
  <div class="footer">
    You're receiving this because you ran an audit at ghostos.live.<br>
    <a href="https://ghostos.live">ghostos.live</a> · Questions? Reply to this email.
  </div>
</div>
</body>
</html>`,
          });
        }
      } catch (emailErr) {
        // Don't fail the audit if email fails
        console.error("POST_AUDIT_EMAIL_ERROR:", emailErr);
      }
    }

    return Response.json({ data });
  } catch (err: unknown) {
    console.error("AUDIT_API_ERROR:", err);
    const e = err as { status?: number; message?: string };
    return Response.json({ error: "Audit failed", details: e?.message || "Unknown error" }, { status: e?.status || 500 });
  }
}
