export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username")?.replace("@", "");
  if (!username) return Response.json({ error: "Username required" }, { status: 400 });

  const headers = {
    "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
    "x-rapidapi-host": "tiktok-scraper7.p.rapidapi.com",
  };

  try {
    const profileRes = await fetch(`https://tiktok-scraper7.p.rapidapi.com/user/info?unique_id=${username}`, { headers });
    const profileData = await profileRes.json();
    const user = profileData?.data?.user;
    const stats = profileData?.data?.stats;
    if (!user || !stats) return Response.json({ error: "Account not found or is private." }, { status: 404 });

    const followers = stats.followerCount ?? 0;
    const videos = stats.videoCount ?? 0;
    const hearts = stats.heartCount ?? stats.heart ?? 0;

    const postsRes = await fetch(`https://tiktok-scraper7.p.rapidapi.com/user/posts?user_id=${user.id}&count=30`, { headers });
    const postsData = await postsRes.json();
    const posts = postsData?.data?.videos ?? postsData?.data?.list ?? (Array.isArray(postsData?.data) ? postsData.data : []);

    let avgViews = 0;
    let engagementRate = 0;

    if (Array.isArray(posts) && posts.length > 0) {
      const totalViews = posts.reduce((sum: number, v: {stats?: {playCount?: number}}) => sum + (v.stats?.playCount ?? 0), 0);
      const totalLikes = posts.reduce((sum: number, v: {stats?: {diggCount?: number}}) => sum + (v.stats?.diggCount ?? 0), 0);
      const totalComments = posts.reduce((sum: number, v: {stats?: {commentCount?: number}}) => sum + (v.stats?.commentCount ?? 0), 0);
      avgViews = Math.round(totalViews / posts.length);
      engagementRate = followers > 0 && avgViews > 0 ? parseFloat((((totalLikes + totalComments) / posts.length / followers) * 100).toFixed(2)) : 0;
    } else if (videos > 0 && hearts > 0) {
      avgViews = Math.round(hearts / videos);
      engagementRate = parseFloat(((hearts / videos / followers) * 100).toFixed(2));
    }

    return Response.json({ followers, avgViews, engagementRate, nickname: user.nickname });
  } catch {
    return Response.json({ error: "Failed to fetch TikTok data" }, { status: 500 });
  }
}
