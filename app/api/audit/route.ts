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

    // Server-side free audit limit enforcement
    if (userId) {
      const { count } = await supabase
        .from("audits")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      const client2 = await clerkClient();
      const userData = await client2.users.getUser(userId);
      const isPro = userData.publicMetadata?.is_pro === true;

      if (!isPro && (count ?? 0) >= 3) {
        return Response.json({ error: "You've used your 3 free audits. Upgrade to GhostOS Pro for unlimited audits." }, { status: 403 });
      }
    }
    if (!input || !Number.isFinite(input.followers) || !Number.isFinite(input.avgViews) || !Number.isFinite(input.engagementRate) || !input.niche || !input.audienceGeo) {
      return Response.json({ error: "Invalid input. Please fill all fields." }, { status: 400 });
    }

    const client = new OpenAI({ apiKey: key });

    // Check Supabase cache first — same inputs = same result
    const { data: cachedAudit } = await supabase
      .from("audits")
      .select("result")
      .eq("niche", input.niche)
      .eq("followers", input.followers)
      .eq("avg_views", input.avgViews)
      .eq("engagement_rate", input.engagementRate)
      .eq("audience_geo", input.audienceGeo)
      .not("result", "is", null)
      .limit(1)
      .maybeSingle();

    if (cachedAudit?.result) {
      // Save to user's history if logged in
      if (userId) {
        try { await supabase.from("audits").insert({
          user_id: userId,
          followers: input.followers,
          avg_views: input.avgViews,
          engagement_rate: input.engagementRate,
          niche: input.niche,
          audience_geo: input.audienceGeo,
          tiktok_handle: input.tiktokHandle || null,
          readiness_score: cachedAudit.result.readiness_score,
          deal_low: cachedAudit.result.estimated_first_deal_range_usd.low,
          deal_target: cachedAudit.result.estimated_first_deal_range_usd.target,
          deal_high: cachedAudit.result.estimated_first_deal_range_usd.high,
          result: cachedAudit.result,
        }); } catch (_) {}
      }
      return Response.json({ data: cachedAudit.result, cached: true });
    }

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

FIRST DEAL REALITY CHECK (apply these discounts for first-time deal seekers):
- Creators with no prior brand deal history: apply 0.6-0.7x to calculated rate (brands lowball first-timers)
- Creators with a media kit ready: apply 0.85x (slight discount, more credible)
- Creators with prior deals: apply full rate
- The "target" price in estimated_first_deal_range_usd should reflect what a first-time creator can ACTUALLY get, not what they deserve
- The "low" should be the floor a creator should never go below
- The "high" should be what they can achieve after 2-3 deals with negotiation experience

VIEWS-TO-FOLLOWERS RATIO INSIGHT:
- Above 100%: viral potential, commands premium rates
- 50-100%: solid reach, standard rates apply
- 20-50%: average reach, slight discount
- Below 20%: poor reach, brands will heavily discount or pass

ENGAGEMENT QUALITY NOTE:
- TikTok engagement of 3-6% is considered average (higher than Instagram baseline)
- Engagement above 8% on TikTok is exceptional and commands 1.5-2x premium
- Always factor in views-to-followers ratio alongside engagement rate

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
  "best_fit_brands": { "name": string, "url": string }[],
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
- For "top_gaps_to_fix_next_14_days": Be BRUTALLY SPECIFIC to this creator's actual numbers. Do NOT give generic advice like "make a media kit" or "optimize your profile". Instead, look at their actual stats and call out the real problem:
  * If engagement rate is low (under 4%): tell them EXACTLY what that means for their deal value and what content format to test
  * If views/followers ratio is low (under 30%): tell them their content isn't reaching beyond their audience and give a specific fix
  * If engagement is high but followers are low: tell them to prioritize follower growth before pitching
  * If niche is low-monetization (Music, Comedy): tell them how to reposition or add a secondary niche angle brands can use
  * If audience is international/mixed: tell them their US rate premium is being lost and what to do
  * Reference their actual numbers in the gaps (e.g. "Your 2.1% engagement rate is below the 4% threshold brands look for...")
  * Give ONE specific action per gap, not vague advice
- For "best_fit_brands": Return 6-8 SPECIFIC, REAL brand names (not categories) that realistically work with creators at this exact follower tier and niche. Scale appropriately:
  * 20k-50k followers: indie/DTC brands, emerging brands, small-mid size companies (e.g. Bloom Nutrition, GHOST energy, Cuts Clothing, Fabletics, Obagi, Tactix, BPN)
  * 50k-100k followers: mid-tier brands actively running influencer campaigns (e.g. Gymshark, Morphe, MVMT, Honey, Athletic Greens, Liquid IV)
  * 100k-200k followers: established brands with creator programs (e.g. NordVPN, Squarespace, Fashion Nova, Shein, BetterHelp, HelloFresh)
  * NEVER suggest Nike, Adidas, Apple, Amazon, Netflix, Google, or other mega-brands for creators under 500k — they do not work with micro-creators.
  * Match brands specifically to the niche. A fitness creator should get supplement/apparel brands. A beauty creator should get skincare/makeup brands. Do not mix unrelated brands.
  * Only include brands that actively run influencer/creator campaigns in 2025-2026.
- For each brand in "best_fit_brands", include its real website URL (e.g. {"name": "Gymshark", "url": "https://www.gymshark.com"}). Use the brand's actual homepage URL, not a search link.
`;

    const resp = await client.responses.create({ model: "gpt-4.1-mini", input: prompt, temperature: 0.2 });
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
            from: "GhostOS <hello@ghostos.live>",
            to: email,
            subject: `Your audit is ready — you scored ${score}/100`,
            html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#04040a;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#04040a;">
  <tr><td align="center" style="padding:48px 24px;">
    <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">
      <tr><td style="padding-bottom:40px;">
        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color:#a78bfa;margin-right:6px;vertical-align:middle;"></span>
        <span style="font-size:20px;font-weight:700;color:#ffffff;vertical-align:middle;">GhostOS</span>
      </td></tr>
      <tr><td style="padding-bottom:12px;">
        <h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;line-height:1.2;letter-spacing:-0.02em;">${name}, your audit results are in.</h1>
      </td></tr>
      <tr><td style="padding-bottom:24px;">
        <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.55);line-height:1.7;">We just finished analyzing <span style="color:rgba(255,255,255,0.85);">${handle}</span>. Here&#39;s the summary:</p>
      </td></tr>
      <tr><td style="padding-bottom:16px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#1a1130;border:1px solid rgba(167,139,250,0.25);border-radius:16px;">
          <tr><td align="center" style="padding:32px 24px;">
            <div style="font-size:72px;font-weight:700;color:#a78bfa;line-height:1;margin-bottom:10px;">${score}</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.35);letter-spacing:0.12em;text-transform:uppercase;">Brand Deal Readiness Score</div>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding-bottom:24px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0d0d14;border:1px solid rgba(255,255,255,0.08);border-radius:12px;">
          <tr><td style="padding:18px 22px;">
            <div style="font-size:12px;color:rgba(255,255,255,0.4);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:6px;">Estimated First Deal Range</div>
            <div style="font-size:22px;font-weight:600;color:#ffffff;">$${low} &#8211; $${high}</div>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding-bottom:24px;">
        <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.55);line-height:1.7;">Your full results include your <span style="color:rgba(255,255,255,0.8);">rate card</span>, <span style="color:rgba(255,255,255,0.8);">cold outreach templates</span>, <span style="color:rgba(255,255,255,0.8);">media kit positioning</span>, and a <span style="color:rgba(255,255,255,0.8);">14-day action plan</span>. Log in to view everything.</p>
      </td></tr>
      <tr><td style="padding-bottom:40px;">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr><td align="center" style="border-radius:12px;background-color:#8b5cf6;">
            <a href="https://ghostos.live/dashboard" style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;">View Full Results &#8594;</a>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="border-top:1px solid rgba(255,255,255,0.07);padding-top:28px;">
        <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.2);line-height:1.7;">You&#39;re receiving this because you ran an audit at ghostos.live.<br>
        <a href="https://ghostos.live" style="color:rgba(167,139,250,0.6);text-decoration:none;">ghostos.live</a> &middot; Questions? Reply to this email.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
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
