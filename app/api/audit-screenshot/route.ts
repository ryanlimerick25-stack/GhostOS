"use server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("screenshots") as File[];

    if (!files || files.length === 0) {
      return Response.json({ error: "No screenshots provided" }, { status: 400 });
    }

    // Convert files to base64
    const imageMessages = await Promise.all(
      files.map(async (file) => {
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const mimeType = file.type || "image/jpeg";
        return {
          type: "image_url" as const,
          image_url: {
            url: `data:${mimeType};base64,${base64}`,
            detail: "high" as const,
          },
        };
      })
    );

    const systemPrompt = `You are an expert TikTok creator brand deal analyst. You will be given screenshots of a TikTok account (profile page and/or analytics). Extract every metric you can see and generate a comprehensive brand deal readiness audit.

Extract from screenshots:
- Username/handle
- Follower count
- Total likes
- Average views per video (from analytics if visible)
- Engagement rate (from analytics if visible, or estimate from likes/followers ratio)
- Niche/content category (infer from bio, username, content visible)
- Audience geography (if visible in analytics)
- Posting frequency (if visible)
- Any other relevant metrics

Then generate a complete audit result as JSON. If a metric is not visible, make a reasonable estimate based on what you can see and note it.

Return ONLY valid JSON with this exact structure:
{
  "extracted_metrics": {
    "handle": string,
    "followers": number,
    "avg_views": number,
    "engagement_rate": number,
    "niche": string,
    "audience_geo": string,
    "notes": string
  },
  "readiness_score": number (0-100),
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
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            ...imageMessages,
            {
              type: "text",
              text: "Analyze these TikTok screenshots and generate a complete brand deal readiness audit. Return only valid JSON.",
            },
          ],
        },
      ],
      max_tokens: 4000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No response from AI");

    const parsed = JSON.parse(content);

    // Save to Supabase if user is logged in
    const { userId } = await auth();
    if (userId) {
      const metrics = parsed.extracted_metrics || {};
      await supabase.from("audits").insert({
        user_id: userId,
        niche: metrics.niche || "Unknown",
        followers: metrics.followers || 0,
        avg_views: metrics.avg_views || 0,
        engagement_rate: metrics.engagement_rate || 0,
        readiness_score: parsed.readiness_score || 0,
        deal_low: parsed.estimated_first_deal_range_usd?.low || 0,
        deal_target: parsed.estimated_first_deal_range_usd?.target || 0,
        deal_high: parsed.estimated_first_deal_range_usd?.high || 0,
        tiktok_handle: metrics.handle || "",
        result: parsed,
      });
    }

    return Response.json({ data: parsed, source: "screenshot" });
  } catch (error: any) {
    console.error("Screenshot audit error:", error);
    return Response.json({ error: error.message || "Failed to analyze screenshots" }, { status: 500 });
  }
}
