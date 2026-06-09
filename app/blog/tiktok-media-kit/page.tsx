import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Make a TikTok Media Kit in 2026 (Template + What Brands Want) | GhostOS",
  description: "A TikTok media kit is how you get brand deals. Here is exactly what to include, how to position yourself, and what brands actually want to see before they pay you.",
};

export default function BlogPost() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #04040a; font-family: 'DM Sans', sans-serif; color: rgba(255,255,255,0.9); -webkit-font-smoothing: antialiased; }
        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 clamp(20px,6vw,100px); height: 68px; background: rgba(4,4,10,0.95); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.06); }
        .nav-logo { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: rgba(255,255,255,0.9); display: flex; align-items: center; gap: 8px; text-decoration: none; }
        .nav-dot { width: 7px; height: 7px; border-radius: 50%; background: #a78bfa; box-shadow: 0 0 10px #a78bfa; }
        .nav-cta { padding: 10px 22px; border-radius: 99px; background: linear-gradient(135deg,#a78bfa,#818cf8); color: #fff; font-size: 14px; font-weight: 500; text-decoration: none; }
        .page { max-width: 720px; margin: 0 auto; padding: 108px 24px 80px; }
        .breadcrumb { font-size: 13px; color: rgba(255,255,255,0.25); margin-bottom: 28px; display: flex; align-items: center; gap: 8px; }
        .breadcrumb a { color: rgba(255,255,255,0.35); text-decoration: none; }
        .breadcrumb a:hover { color: #a78bfa; }
        .post-tag { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 10px; border-radius: 99px; background: rgba(167,139,250,0.1); color: #a78bfa; border: 1px solid rgba(167,139,250,0.2); margin-bottom: 16px; display: inline-block; }
        h1 { font-family: 'Playfair Display', serif; font-size: clamp(32px,5vw,48px); font-weight: 700; color: rgba(255,255,255,0.95); line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 16px; }
        .post-meta { font-size: 13px; color: rgba(255,255,255,0.25); margin-bottom: 48px; padding-bottom: 32px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .prose h2 { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: rgba(255,255,255,0.9); margin: 40px 0 16px; letter-spacing: -0.01em; }
        .prose h3 { font-size: 18px; font-weight: 600; color: rgba(255,255,255,0.8); margin: 28px 0 12px; }
        .prose p { font-size: 16px; color: rgba(255,255,255,0.6); line-height: 1.8; margin-bottom: 20px; }
        .prose strong { color: rgba(255,255,255,0.85); }
        .prose ul, .prose ol { padding-left: 24px; margin-bottom: 20px; }
        .prose li { font-size: 16px; color: rgba(255,255,255,0.6); line-height: 1.8; margin-bottom: 8px; }
        .prose table { width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 14px; }
        .prose th { text-align: left; padding: 10px 14px; background: rgba(167,139,250,0.08); color: rgba(255,255,255,0.6); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .prose td { padding: 12px 14px; border-bottom: 1px solid rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); }
        .prose tr:hover td { background: rgba(255,255,255,0.02); }
        .prose em { color: rgba(255,255,255,0.55); font-style: italic; }
        .cta-block { margin-top: 64px; background: linear-gradient(135deg, rgba(167,139,250,0.08), rgba(129,140,248,0.08)); border: 1px solid rgba(167,139,250,0.2); border-radius: 20px; padding: 36px; text-align: center; }
        .cta-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: rgba(255,255,255,0.93); margin-bottom: 10px; }
        .cta-sub { font-size: 15px; color: rgba(255,255,255,0.4); margin-bottom: 24px; line-height: 1.6; }
        .cta-btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 32px; border-radius: 12px; background: linear-gradient(135deg,#a78bfa,#818cf8); color: #fff; font-size: 15px; font-weight: 600; text-decoration: none; }
        .cta-btn:hover { transform: translateY(-1px); box-shadow: 0 12px 32px rgba(167,139,250,0.3); }
        .back-link { display: inline-flex; align-items: center; gap: 6px; margin-top: 48px; font-size: 13px; color: rgba(255,255,255,0.3); text-decoration: none; }
        .back-link:hover { color: #a78bfa; }
      `}</style>
      <nav>
        <Link href="/" className="nav-logo"><div className="nav-dot" />GhostOS</Link>
        <Link href="/audit" className="nav-cta">Run Free Audit →</Link>
      </nav>
      <div className="page">
        <div className="breadcrumb">
          <Link href="/blog">Blog</Link>
          <span>›</span>
          <span>How to Make a TikTok Media Kit in 2026 (...</span>
        </div>
        <div className="post-tag">Guide</div>
        <h1>How to Make a TikTok Media Kit in 2026 (Template + What Brands Want)</h1>
        <div className="post-meta">By GhostOS · 7 min read · Updated June 2026</div>
        <div className="prose" dangerouslySetInnerHTML={{__html: `<p>A media kit is your resume for brand deals. It is the first thing a brand sees when deciding whether to pay you — and most creator media kits are either missing entirely or so generic they get ignored.</p>

      <h2>What Is a TikTok Media Kit?</h2>
      <p>A TikTok media kit (also called a press kit or creator kit) is a document you send to brands that summarizes who you are, who your audience is, what you offer, and what you charge. It answers the one question every brand manager has: <em>Why should I pay this creator instead of someone else?</em></p>

      <h2>What to Include in Your TikTok Media Kit</h2>

      <h3>1. Your header</h3>
      <ul>
      <li>Name or handle</li>
      <li>Niche in one sentence</li>
      <li>Your core value proposition — not "lifestyle creator" but something specific like "I help millennial women build sustainable fitness habits"</li>
      </ul>

      <h3>2. Your key stats</h3>
      <ul>
      <li>Follower count</li>
      <li>Average views (last 30 days)</li>
      <li>Engagement rate</li>
      <li>Audience location breakdown (% US if applicable)</li>
      <li>Audience age and gender split</li>
      </ul>
      <p>Pull these from TikTok Analytics → Profile → Overview and Follower tabs.</p>

      <h3>3. Your audience profile</h3>
      <p>In 2–3 sentences: who watches your content, why they follow you, and what they buy. This is what brands actually care about.</p>
      <p>Example: <em>My audience is primarily 22–35 year old women in the US interested in fitness and wellness. They are active buyers — 68% have purchased a fitness product after seeing it recommended by a creator they follow.</em></p>

      <h3>4. Content samples</h3>
      <p>Include 3–5 screenshots or links to your best performing videos, especially any previous sponsored content.</p>

      <h3>5. Your rate card</h3>
      <ul>
      <li>Single TikTok video: $X</li>
      <li>3-video package: $X</li>
      <li>Monthly ambassador: $X</li>
      <li>Usage rights add-on: +$X</li>
      <li>Exclusivity add-on: +$X</li>
      </ul>

      <h2>Common Media Kit Mistakes</h2>
      <p><strong>Leading with follower count</strong> — brands care more about engagement and audience quality. Lead with your value proposition and engagement rate.</p>
      <p><strong>No rate card</strong> — some creators leave rates out to discuss them later, but this creates friction. Brands who cannot afford you will self-select out if you include rates.</p>
      <p><strong>Outdated stats</strong> — update your media kit monthly. Brands can tell when stats are stale.</p>
      <p><strong>Vague audience description</strong> — "my audience likes lifestyle content" tells a brand nothing. Be specific about demographics, interests, and buying behavior.</p>

      <h2>How to Position Yourself</h2>
      <p><strong>Weak positioning:</strong> "I am a fitness creator with 45K followers who posts workout videos and healthy recipes."</p>
      <p><strong>Strong positioning:</strong> "I turn fitness curiosity into buying decisions. My audience of 45K active women aged 22–34 has a 7.2% engagement rate and actively purchases fitness products — I have driven documented sales for three supplement and apparel brands."</p>
      <p>The second version answers the brand's real question: will this creator make us money?</p>

      <h2>What Brands Actually Look For</h2>
      <ul>
      <li><strong>Engagement rate above 4%</strong> — the baseline filter. Below 4% and many brands pass.</li>
      <li><strong>US audience majority</strong> — commands 20–30% higher rates.</li>
      <li><strong>Clear niche</strong> — easier to place, easier to justify to their marketing team.</li>
      <li><strong>Previous brand work</strong> — any documented sponsored content builds credibility.</li>
      <li><strong>Professional presentation</strong> — a poorly designed media kit signals someone who does not value their own work.</li>
      </ul>

      <h2>Get Your Media Kit Positioning Generated Automatically</h2>
      <p>GhostOS generates your media kit positioning statement and brand pitch bullets from your real stats. You get a one-paragraph positioning statement written for your specific niche, 3–5 pitch bullets that speak to brand ROI, your complete rate card, and the specific brands most likely to respond to your pitch.</p>`}} />
        <div className="cta-block">
          <div className="cta-title">Stop estimating. Know your exact rate.</div>
          <div className="cta-sub">GhostOS audits your TikTok profile and gives you your readiness score, full rate card, outreach templates, and 14-day action plan. Free. 30 seconds.</div>
          <Link href="/audit" className="cta-btn">Run Your Free Audit →</Link>
        </div>
        <Link href="/blog" className="back-link">← Back to all guides</Link>
      </div>
    </>
  );
}
