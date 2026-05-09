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
    console.log("RapidAPI response:", JSON.stringify(data).slice(0, 500));
    const user = data?.data?.user;
    if (!user) return Response.json({ error: "User not found", debug: JSON.stringify(data).slice(0, 300) }, { status: 404 });

    const followers = user.followerCount ?? 0;
    const hearts = user.heartCount ?? 0;
    const videos = user.videoCount ?? 0;
    const avgViews = videos > 0 ? Math.round(hearts / videos) : 0;
    const engagementRate = followers > 0 ? parseFloat(((hearts / videos / followers) * 100).toFixed(2)) : 0;

    return Response.json({ followers, avgViews, engagementRate, nickname: user.nickname });
  } catch {
    return Response.json({ error: "Failed to fetch TikTok data" }, { status: 500 });
  }
}
