import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: Request) {
  try {
    const authResult = await auth().catch(() => ({ userId: null }));
    const userId = authResult?.userId;
    const key = process.env.OPENAI_API_KEY;
    if (!key) return Response.json({ error: "OPENAI_API_KEY missing" }, { status: 500 });

    const body = await req.json();
    const { brandName, deliverables, offeredRate, usageRights, exclusivity, exclusivityDuration, deadline, notes, creatorProfile } = body;

    if (!brandName || !deliverables || !offeredRate) {
      return Response.json({ error: "Please fill in all required fields." }, { status: 400 });
    }

    const client = new OpenAI({ apiKey: key });

    const prompt = `
You are a sharp talent manager and brand deal negotiation expert for TikTok creators.
Analyze this brand deal offer and give a brutally honest assessment.

CREATOR PROFILE:
${creatorProfile ? `
- Followers: ${creatorProfile.followers}
- Avg Views: ${creatorProfile.avgViews}
- Engagement Rate: ${creatorProfile.engagementRate}%
- Niche: ${creatorProfile.niche}
- Audience Geo: ${creatorProfile.audienceGeo}
- Readiness Score: ${creatorProfile.readinessScore}/100
` : "- No profile data provided (use general market rates)"}

BRAND OFFER:
- Brand: ${brandName}
- Deliverables: ${deliverables}
- Offered Rate: $${offeredRate}
- Usage Rights: ${usageRights || "Not mentioned"}
- Exclusivity: ${exclusivity ? `Yes — ${exclusivityDuration || "duration not specified"}` : "No"}
- Deadline: ${deadline || "Not specified"}
- Additional Notes: ${notes || "None"}

MARKET RATE BENCHMARKS (2025-2026):
- 20k-50k followers: $100-500/post (median $250)
- 50k-100k followers: $300-1,200/post (median $600)
- 100k-200k followers: $800-4,000/post (median $2,000)
- Usage rights (30-90 days): +25% to base rate
- Usage rights (6+ months): +50-100% to base rate
- Exclusivity: +25-50% to base rate
- Finance niche: 3-4x multiplier
- Beauty/Tech: 2-3x multiplier
- Fitness/Fashion: 1.5-2x multiplier
- Food/Gaming: 1.3-1.5x multiplier
- Music/Comedy: 0.8-1x multiplier
- US audience: 1.3x multiplier

Analyze the deal and return ONLY valid JSON:
{
  "verdict": "Lowball" | "Below Market" | "Fair" | "Strong" | "Great",
  "verdict_color": "red" | "orange" | "yellow" | "green" | "purple",
  "fair_value_low": number,
  "fair_value_high": number,
  "offered_vs_market_percent": number,
  "summary": string,
  "what_youre_missing": string[],
  "red_flags": string[],
  "strengths": string[],
  "counter_offer_amount": number,
  "negotiation_script": string,
  "should_take_it": boolean,
  "final_recommendation": string
}

Rules:
- offered_vs_market_percent: negative means underpaid (e.g. -40 means 40% below market), positive means above market
- fair_value_low and fair_value_high: what this deal SHOULD be worth based on their profile
- counter_offer_amount: what they should counter with
- negotiation_script: 3-4 sentences they can send directly to the brand, professional but confident
- what_youre_missing: terms not mentioned that should be in the contract (usage rights, revision limits, approval process, kill fee, etc.)
- red_flags: anything suspicious or unfair about this offer
- strengths: what's good about this offer
- Be specific — reference the actual numbers, brand name, and deliverables
- Return ONLY valid JSON, no markdown
`;

    const resp = await client.responses.create({ model: "gpt-4.1-mini", input: prompt });
    const text = (resp.output_text || "").trim();
    let jsonStr = text;
    if (!text.startsWith("{")) { const match = text.match(/\{[\s\S]*\}/); if (match) jsonStr = match[0]; }
    const data = JSON.parse(jsonStr);

    // Track usage in Supabase
    if (userId) {
      try {
        await supabase.from("deal_analyses").insert({
          user_id: userId,
          brand_name: brandName,
          offered_rate: Number(offeredRate),
          verdict: data.verdict,
          fair_value_low: data.fair_value_low,
          fair_value_high: data.fair_value_high,
          result: data,
        });
      } catch (_) {}
    }

    return Response.json({ data });
  } catch (err: unknown) {
    console.error("DEAL_ANALYZER_ERROR:", err);
    const e = err as { message?: string };
    return Response.json({ error: "Analysis failed", details: e?.message }, { status: 500 });
  }
}
