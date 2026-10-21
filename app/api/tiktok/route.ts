export const runtime = "nodejs";

const SC = "https://api.scrapecreators.com";

// Find the first numeric value for any of these keys anywhere in a JSON object
function findNum(obj: any, keys: string[]): number | undefined {
  if (!obj || typeof obj !== "object") return;
  for (const k of keys) if (typeof obj[k] === "number") return obj[k];
  for (const v of Object.values(obj)) {
    const n = findNum(v, keys);
    if (n !== undefined) return n;
  }
}

// Find the first array of video-like objects (items that carry a play count)
function findVideos(obj: any): any[] {
  if (!obj || typeof obj !== "object") return [];
  if (Array.isArray(obj) && obj.some((v) => findNum(v, ["play_count", "playCount"]) !== undefined)) return obj;
  for (const v of Object.values(obj)) {
    const found = findVideos(v);
    if (found.length) return found;
  }
  return [];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username")?.replace("@", "").trim();
  if (!username) return Response.json({ error: "Username required" }, { status: 400 });

  if (!process.env.SCRAPECREATORS_API_KEY) {
    console.error("SCRAPECREATORS_API_KEY is not set");
    return Response.json({ error: "Failed to fetch TikTok data" }, { status: 500 });
  }
  const headers = { "x-api-key": process.env.SCRAPECREATORS_API_KEY };

  try {
    const profileRes = await fetch(`${SC}/v1/tiktok/profile?handle=${encodeURIComponent(username)}`, { headers });
    const profile = await profileRes.json().catch(() => null);
    const followers = findNum(profile, ["followerCount", "follower_count"]);
    if (!profileRes.ok || followers === undefined) {
      console.error("ScrapeCreators profile failed", profileRes.status, JSON.stringify(profile)?.slice(0, 300));
      return Response.json({ error: "Account not found or is private." }, { status: 404 });
    }
    const nickname = profile?.user?.nickname ?? profile?.nickname ?? username;

    const videosRes = await fetch(`${SC}/v3/tiktok/profile/videos?handle=${encodeURIComponent(username)}&region=US`, { headers });
    const videos = findVideos(await videosRes.json().catch(() => null)).slice(0, 20);

    let avgViews = 0;
    let engagementRate = 0;
    if (videos.length > 0) {
      // Read counts from the video's own stats object first, so we never pick up
      // a same-named number from a nested author/music object.
      const statsOf = (v: any) => v?.statistics ?? v?.stats ?? v?.stats_v2 ?? v;
      const sum = (keys: string[]) => videos.reduce((s, v) => s + (findNum(statsOf(v), keys) ?? 0), 0);
      const totalViews = sum(["play_count", "playCount"]);
      const totalInteractions =
        sum(["digg_count", "diggCount", "like_count", "likeCount"]) + sum(["comment_count", "commentCount"]) + sum(["share_count", "shareCount"]);
      avgViews = Math.round(totalViews / videos.length);
      // Engagement rate = (likes + comments + shares) / views, the standard TikTok metric.
      engagementRate = totalViews > 0 ? parseFloat(((totalInteractions / totalViews) * 100).toFixed(2)) : 0;
    }

    return Response.json({ followers, avgViews, engagementRate, nickname });
  } catch (e) {
    console.error("TikTok fetch error", e);
    return Response.json({ error: "Failed to fetch TikTok data" }, { status: 500 });
  }
}
