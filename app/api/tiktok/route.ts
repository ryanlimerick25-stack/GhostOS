export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username")?.replace("@", "");
  if (!username) return Response.json({ error: "Username required" }, { status: 400 });

  const headers = {
    "Authorization": `Bearer ${process.env.TIKTOK_API_KEY}`,
  };

  try {
    // Get profile info
    const profileRes = await fetch(`https://tiktokapi.store/api/v1/user/info?unique_id=${username}`, { headers });
    const profileData = await profileRes.json();
    if (profileData.code !== 0 || !profileData.data?.user) {
      return Response.json({ error: "Account not found or is private." }, { status: 404 });
    }

    const user = profileData.data.user;
    const stats = profileData.data.stats;
    const followers = stats?.followerCount ?? 0;

    // Get recent posts
    const postsRes = await fetch(`https://tiktokapi.store/api/v1/user/posts?unique_id=${username}&count=20`, { headers });
    const postsData = await postsRes.json();
    const videos = postsData?.data?.videos ?? [];

    let avgViews = 0;
    let engagementRate = 0;

    if (Array.isArray(videos) && videos.length > 0) {
      const totalViews = videos.reduce((sum: number, v: any) => sum + (v.play_count ?? 0), 0);
      const totalLikes = videos.reduce((sum: number, v: any) => sum + (v.like_count ?? v.digg_count ?? 0), 0);
      const totalComments = videos.reduce((sum: number, v: any) => sum + (v.comment_count ?? 0), 0);
      const totalShares = videos.reduce((sum: number, v: any) => sum + (v.share_count ?? 0), 0);
      avgViews = Math.round(totalViews / videos.length);
      // Engagement rate = (likes + comments + shares) / views — the standard TikTok metric.
      // The old formula divided by followers, which inflated the number to 30-60% for
      // creators whose reach exceeds their follower count (exactly our target creators).
      engagementRate = totalViews > 0
        ? parseFloat((((totalLikes + totalComments + totalShares) / totalViews) * 100).toFixed(2))
        : 0;
    }

    return Response.json({ followers, avgViews, engagementRate, nickname: user.nickname });
  } catch {
    return Response.json({ error: "Failed to fetch TikTok data" }, { status: 500 });
  }
}
