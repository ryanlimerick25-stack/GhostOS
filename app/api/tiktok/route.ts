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
    // Fetch user profile and recent posts in parallel
    const [profileRes, postsRes] = await Promise.all([
      fetch(`https://tiktok-scraper7.p.rapidapi.com/user/info?unique_id=${username}`, { headers }),
      fetch(`https://tiktok-scraper7.p.rapidapi.com/user/posts?unique_id=${username}&count=30`, { headers }),
    ]);

    const profileData = await profileRes.json();
    const postsData = await postsRes.json();

    const user = profileData?.data?.user;
    const stats = profileData?.data?.stats;
    if (!user || !stats) return Response.json({ error: "Account not found or is private. Please enter your stats manually." }, { status: 404 });

    const followers = stats.followerCount ?? 0;
    const videos = stats.videoCount ?? 0;

    // Calculate real avg views from recent posts
    const posts = postsData?.data?.videos ?? [];
    let avgViews = 0;
    let engagementRate = 0;

    if (posts.length > 0) {
      const totalViews = posts.reduce((sum: number, v: {stats?: {playCount?: number}}) => sum + (v.stats?.playCount ?? 0), 0);
      const totalLikes = posts.reduce((sum: number, v: {stats?: {diggCount?: number}}) => sum + (v.stats?.diggCount ?? 0), 0);
      const totalComments = posts.reduce((sum: number, v: {stats?: {commentCount?: number}}) => sum + (v.stats?.commentCount ?? 0), 0);
      avgViews = Math.round(totalViews / posts.length);
      engagementRate = followers > 0 && totalViews > 0
        ? parseFloat((((totalLikes + totalComments) / posts.length / followers) * 100).toFixed(2))
        : 0;
    } else {
      // Fallback to hearts/videos estimate
      const hearts = stats.heartCount ?? 0;
      avgViews = videos > 0 ? Math.round(hearts / videos) : 0;
      engagementRate = followers > 0 && videos > 0 ? parseFloat(((hearts / videos / followers) * 100).toFixed(2)) : 0;
    }

    return Response.json({ followers, avgViews, engagementRate, nickname: user.nickname });
  } catch {
    return Response.json({ error: "Failed to fetch TikTok data" }, { status: 500 });
  }
}
