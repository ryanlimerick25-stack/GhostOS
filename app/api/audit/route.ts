import OpenAI from "openai";

export const runtime = "nodejs";

type AuditInput = {
  followers: number;
  avgViews: number;
  engagementRate: number;
  niche: string;
  audienceGeo: string;
};

export async function POST(req: Request) {
  try {
    // 1) Confirm env is loaded
    const key = process.env.OPENAI_API_KEY;
    if (!key || key.includes("PASTE_YOUR_KEY_HERE")) {
      return Response.json(
        { error: "OPENAI_API_KEY is missing or still placeholder in .env.local" },
        { status: 500 }
      );
    }

    const input = (await req.json()) as AuditInput;

    if (
      !input ||
      !Number.isFinite(input.followers) ||
      !Number.isFinite(input.avgViews) ||
      !Number.isFinite(input.engagementRate) ||
      !input.niche ||
      !input.audienceGeo
    ) {
      return Response.json(
        { error: "Invalid input. Please fill all fields." },
        { status: 400 }
      );
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
- Return ONLY valid JSON.
- No markdown.
- No explanation text.
- Make rate card numbers realistic for a first brand deal.
- Outreach templates should be short, confident, and niche-specific.
- Lists should contain 3–6 items max.
`;
    const resp = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const text = (resp.output_text || "").trim();

    let jsonStr = text;
    if (!text.startsWith("{")) {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) jsonStr = match[0];
    }

    const data = JSON.parse(jsonStr);

    return Response.json({ data });
  } catch (err: any) {
    // 2) Print the real error to terminal
    console.error("AUDIT_API_ERROR:", err);

    // 3) Return the real error details to the browser (for debugging)
    const status = err?.status || err?.response?.status || 500;
    const message =
      err?.message ||
      err?.response?.data?.error?.message ||
      err?.error?.message ||
      "Unknown error";

    return Response.json(      {
        error: "Audit failed",
        details: message,
        status,
      },
      { status: 500 }
    );
  }
}
