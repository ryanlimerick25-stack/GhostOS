export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username")?.replace("@", "");
  
  if (!username) return Response.json({ error: "Username required" }, { status: 400 });

  try {
    const res = await fetch(
      `https://tiktok-scraper7.p.rapidapi.com/user/info?unique_id=${username}`,
      {
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
          "x-rapidapi-host": "tiktok-scraper7.p.rapidapi.com",
        },
      }
    );
    const data = await res.json();
    const user = data?.data?.user;
    const stats = data?.data?.stats;
    if (!user || !stats) return Response.json({ error: "User not found" }, { status: 404 });

    const followers = stats.followerCount ?? 0;
    const hearts = stats.heartCount ?? 0;
    const videos = stats.videoCount ?? 0;
    const avgViews = videos > 0 ? Math.round(hearts / videos) : 0;
    const engagementRate = followers > 0 ? parseFloat(((hearts / videos / followers) * 100).toFixed(2)) : 0;

    return Response.json({ followers, avgViews, engagementRate, nickname: user.nickname });
  } catch {
    return Response.json({ error: "Failed to fetch TikTok data" }, { status: 500 });
  }
}
