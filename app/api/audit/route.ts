import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

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
    const { userId } = await auth();
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
    }

    return Response.json({ data });
  } catch (err: unknown) {
    console.error("AUDIT_API_ERROR:", err);
    const e = err as { status?: number; message?: string };
    return Response.json({ error: "Audit failed", details: e?.message || "Unknown error" }, { status: e?.status || 500 });
  }
}
