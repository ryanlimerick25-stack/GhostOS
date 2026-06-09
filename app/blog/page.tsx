import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — TikTok Brand Deal Guides & Rate Data | GhostOS",
  description: "Real data on TikTok brand deal rates, sponsorship pricing, and how to land your first brand deal. Guides built for creators with 20k–200k followers.",
};

const posts = [
  {
    slug: "tiktok-brand-deal-calculator",
    title: "TikTok Brand Deal Calculator 2026 — Find Your Real Rate",
    description: "Calculate your exact TikTok sponsorship rate based on followers, engagement, and niche. Then get a full audit with rate card, outreach templates, and action plan.",
    tag: "Calculator",
    readTime: "6 min read",
  },
  {
    slug: "tiktok-brand-deal-rates-2026",
    title: "TikTok Brand Deal Rates 2026 — Complete Rate Card",
    description: "Real TikTok brand deal rates by follower tier, niche, and engagement rate. Find out exactly what brands are paying creators right now.",
    tag: "Data",
    readTime: "7 min read",
  },
  {
    slug: "how-much-to-charge-brands-tiktok",
    title: "How Much to Charge Brands on TikTok in 2026",
    description: "Stop guessing what to charge for TikTok brand deals. Here is exactly how to price your first sponsorship based on your real stats.",
    tag: "Guide",
    readTime: "6 min read",
  },
  {
    slug: "tiktok-sponsorship-rates",
    title: "TikTok Sponsorship Rates 2026 — What Brands Are Actually Paying",
    description: "Real TikTok sponsorship rates from 2026. See what brands are paying creators at every follower tier and how to negotiate above market rate.",
    tag: "Data",
    readTime: "6 min read",
  },
  {
    slug: "tiktok-media-kit",
    title: "How to Make a TikTok Media Kit in 2026",
    description: "A TikTok media kit is how you get brand deals. Here is exactly what to include, how to position yourself, and what brands actually want to see.",
    tag: "Guide",
    readTime: "7 min read",
  },
];

export default function BlogIndex() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #04040a; font-family: 'DM Sans', sans-serif; color: rgba(255,255,255,0.9); -webkit-font-smoothing: antialiased; }
        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 clamp(20px,6vw,100px); height: 68px; background: rgba(4,4,10,0.95); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.06); }
        .nav-logo { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: rgba(255,255,255,0.9); display: flex; align-items: center; gap: 8px; text-decoration: none; }
        .nav-dot { width: 7px; height: 7px; border-radius: 50%; background: #a78bfa; box-shadow: 0 0 10px #a78bfa; }
        .nav-cta { padding: 10px 22px; border-radius: 99px; background: linear-gradient(135deg,#a78bfa,#818cf8); color: #fff; font-size: 14px; font-weight: 500; text-decoration: none; }
        .page { max-width: 860px; margin: 0 auto; padding: 108px 24px 80px; }
        .page-label { font-size: 12px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #a78bfa; margin-bottom: 12px; }
        .page-title { font-family: 'Playfair Display', serif; font-size: clamp(36px,5vw,56px); font-weight: 700; color: rgba(255,255,255,0.93); line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 12px; }
        .page-sub { font-size: 18px; color: rgba(255,255,255,0.35); margin-bottom: 56px; }
        .posts { display: flex; flex-direction: column; gap: 2px; }
        .post-card { display: block; padding: 28px 32px; border-radius: 16px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); text-decoration: none; transition: all 0.2s; }
        .post-card:hover { background: rgba(255,255,255,0.04); border-color: rgba(167,139,250,0.2); transform: translateY(-1px); }
        .post-meta { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .post-tag { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 10px; border-radius: 99px; background: rgba(167,139,250,0.1); color: #a78bfa; border: 1px solid rgba(167,139,250,0.2); }
        .post-time { font-size: 12px; color: rgba(255,255,255,0.25); }
        .post-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 600; color: rgba(255,255,255,0.9); margin-bottom: 8px; line-height: 1.3; }
        .post-desc { font-size: 14px; color: rgba(255,255,255,0.4); line-height: 1.6; }
        .cta-block { margin-top: 64px; background: linear-gradient(135deg, rgba(167,139,250,0.08), rgba(129,140,248,0.08)); border: 1px solid rgba(167,139,250,0.2); border-radius: 20px; padding: 36px; text-align: center; }
        .cta-title { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: rgba(255,255,255,0.93); margin-bottom: 10px; }
        .cta-sub { font-size: 15px; color: rgba(255,255,255,0.4); margin-bottom: 24px; }
        .cta-btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 32px; border-radius: 12px; background: linear-gradient(135deg,#a78bfa,#818cf8); color: #fff; font-size: 15px; font-weight: 600; text-decoration: none; }
      `}</style>
      <nav>
        <Link href="/" className="nav-logo"><div className="nav-dot" />GhostOS</Link>
        <Link href="/audit" className="nav-cta">Run Free Audit →</Link>
      </nav>
      <div className="page">
        <div className="page-label">Blog</div>
        <h1 className="page-title">TikTok Brand Deal Guides</h1>
        <p className="page-sub">Real data on rates, pricing, and how to land your first deal.</p>
        <div className="posts">
          {posts.map(p => (
            <Link key={p.slug} href={"/blog/" + p.slug} className="post-card">
              <div className="post-meta">
                <span className="post-tag">{p.tag}</span>
                <span className="post-time">{p.readTime}</span>
              </div>
              <div className="post-title">{p.title}</div>
              <div className="post-desc">{p.description}</div>
            </Link>
          ))}
        </div>
        <div className="cta-block">
          <div className="cta-title">Know your number before you negotiate.</div>
          <div className="cta-sub">Get your readiness score, rate card, and outreach templates in 30 seconds.</div>
          <Link href="/audit" className="cta-btn">Run Your Free Audit →</Link>
        </div>
      </div>
    </>
  );
}
