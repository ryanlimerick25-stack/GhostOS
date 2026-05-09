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
    const hearts = stats.heartCount ?? 0;

    // Try multiple possible field names for posts array
    const posts = postsData?.data?.videos 
      ?? postsData?.data?.list 
      ?? postsData?.data?.items
      ?? postsData?.data
      ?? [];

    let avgViews = 0;
    let engagementRate = 0;

    if (Array.isArray(posts) && posts.length > 0) {
      const totalViews = posts.reduce((sum: number, v: {stats?: {playCount?: number}, play_count?: number}) => sum + (v.stats?.playCount ?? v.play_count ?? 0), 0);
      const totalLikes = posts.reduce((sum: number, v: {stats?: {diggCount?: number}, digg_count?: number}) => sum + (v.stats?.diggCount ?? v.digg_count ?? 0), 0);
      const totalComments = posts.reduce((sum: number, v: {stats?: {commentCount?: number}, comment_count?: number}) => sum + (v.stats?.commentCount ?? v.comment_count ?? 0), 0);
      avgViews = Math.round(totalViews / posts.length);
      engagementRate = followers > 0 && totalViews > 0
        ? parseFloat((((totalLikes + totalComments) / posts.length / followers) * 100).toFixed(2))
        : 0;
    } else {
      avgViews = videos > 0 ? Math.round(hearts / videos) : 0;
      engagementRate = followers > 0 && videos > 0 ? parseFloat(((hearts / videos / followers) * 100).toFixed(2)) : 0;
    }

    return Response.json({ followers, avgViews, engagementRate, nickname: user.nickname, debug_posts_count: Array.isArray(posts) ? posts.length : "not array" });
  } catch (e) {
    return Response.json({ error: "Failed to fetch TikTok data", details: String(e) }, { status: 500 });
  }
}
