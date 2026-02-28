"use client";
import { useUser, useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Audit = {
  id: string;
  created_at: string;
  niche: string;
  followers: number;
  avg_views: number;
  engagement_rate: number;
  readiness_score: number;
  deal_low: number;
  deal_target: number;
  deal_high: number;
  tiktok_handle: string;
};

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [audits, setAudits] = useState<Audit[]>([]);
  const [isPro, setIsPro] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) { router.push("/sign-in"); return; }
    fetch("/api/audits")
      .then(r => r.json())
      .then(d => { setAudits(d.audits || []); setLoading(false); });
  }, [isLoaded, user]);

  async function handleUpgrade() {
    setUpgrading(true);
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setUpgrading(false);
  }

  async function handlePortal() {
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  function scoreColor(s: number) {
    if (s >= 75) return "#4ade80";
    if (s >= 50) return "#facc15";
    return "#f87171";
  }

  function scoreLabel(s: number) {
    if (s >= 75) return "Brand Ready";
    if (s >= 50) return "Getting There";
    return "Needs Work";
  }

  if (!isLoaded || loading) return (
    <div style={{ minHeight: "100vh", background: "#04040a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "rgba(255,255,255,0.3)", fontFamily: "DM Sans, sans-serif" }}>Loading...</div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #04040a; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; color: rgba(255,255,255,0.9); }
        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; height: 64px; background: rgba(4,4,10,0.8); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .nav-logo { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: rgba(255,255,255,0.9); display: flex; align-items: center; gap: 8px; text-decoration: none; }
        .nav-dot { width: 7px; height: 7px; border-radius: 50%; background: #a78bfa; box-shadow: 0 0 10px #a78bfa; animation: pulse 2s ease infinite; flex-shrink: 0; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        .nav-right { display: flex; align-items: center; gap: 12px; }
        .nav-user { font-size: 13px; color: rgba(255,255,255,0.4); }
        .nav-btn { padding: 8px 18px; border-radius: 99px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; text-decoration: none; display: inline-block; }
        .nav-audit { background: linear-gradient(135deg,#a78bfa,#818cf8); border: none; color: #fff; }
        .nav-audit:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(167,139,250,0.3); }
        .nav-signout { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); }
        .nav-signout:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.08); }
        .page { max-width: 900px; margin: 0 auto; padding: 96px 24px 60px; }
        .welcome { margin-bottom: 48px; }
        .welcome-label { font-size: 11px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: #a78bfa; margin-bottom: 10px; }
        .welcome-title { font-family: 'Playfair Display', serif; font-size: clamp(28px,4vw,44px); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; color: rgba(255,255,255,0.93); margin-bottom: 8px; }
        .welcome-title em { font-style: italic; color: rgba(255,255,255,0.4); }
        .welcome-sub { font-size: 15px; font-weight: 300; color: rgba(255,255,255,0.3); }
        .stats-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 48px; }
        @media(max-width:600px){.stats-row{grid-template-columns:1fr}}
        .stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 24px; position: relative; overflow: hidden; }
        .stat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background: linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent); }
        .stat-label { font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.28); margin-bottom: 10px; }
        .stat-value { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700; letter-spacing: -0.02em; color: rgba(255,255,255,0.93); }
        .stat-sub { font-size: 12px; color: rgba(255,255,255,0.25); margin-top: 4px; }
        .section-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 600; color: rgba(255,255,255,0.9); margin-bottom: 16px; letter-spacing: -0.01em; }
        .empty-state { background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.08); border-radius: 20px; padding: 56px 24px; text-align: center; }
        .empty-icon { font-size: 36px; margin-bottom: 16px; }
        .empty-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 600; color: rgba(255,255,255,0.6); margin-bottom: 8px; }
        .empty-sub { font-size: 14px; color: rgba(255,255,255,0.25); margin-bottom: 24px; }
        .btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 13px 28px; border-radius: 12px; background: linear-gradient(135deg,#a78bfa,#818cf8); color: #fff; font-size: 14px; font-weight: 600; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); text-decoration: none; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(167,139,250,0.35); }
        .audits-list { display: flex; flex-direction: column; gap: 12px; }
        .audit-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 24px 28px; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 24px; transition: all 0.2s; cursor: pointer; position: relative; overflow: hidden; }
        .audit-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background: linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent); }
        .audit-card:hover { background: rgba(255,255,255,0.05); border-color: rgba(167,139,250,0.2); transform: translateY(-2px); }
        .audit-niche { font-size: 16px; font-weight: 500; color: rgba(255,255,255,0.9); margin-bottom: 6px; }
        .audit-meta { font-size: 12px; color: rgba(255,255,255,0.28); display: flex; gap: 16px; flex-wrap: wrap; }
        .audit-meta span { display: flex; align-items: center; gap: 4px; }
        .audit-right { text-align: right; }
        .audit-score { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; line-height: 1; margin-bottom: 4px; }
        .audit-score-label { font-size: 11px; font-weight: 500; letter-spacing: 0.06em; }
        .audit-deal { font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 6px; }
        .audit-date { font-size: 11px; color: rgba(255,255,255,0.2); margin-top: 2px; }
        @media(max-width:500px){.audit-card{grid-template-columns:1fr}.audit-right{text-align:left}}
      `}</style>

      <nav>
        <a className="nav-logo" href="/"><div className="nav-dot" />GhostOS</a>
        <div className="nav-right">
          <span className="nav-user">Hi, {user?.firstName || "Creator"}</span>
          <a className="nav-btn nav-audit" href="/audit">New Audit →</a>
          <button className="nav-btn nav-signout" onClick={() => signOut(() => router.push("/"))}>Sign out</button>
        </div>
      </nav>

      <div className="page">
        <div className="welcome">
          <div className="welcome-label">Dashboard</div>
          <h1 className="welcome-title">
            Welcome back, <em>{user?.firstName || "Creator"}</em>
          </h1>
          <p className="welcome-sub">Track your brand deal readiness over time.</p>
        </div>

        {!isPro && (
          <div style={{background:"linear-gradient(135deg,rgba(167,139,250,0.1),rgba(129,140,248,0.1))",border:"1px solid rgba(167,139,250,0.2)",borderRadius:"20px",padding:"24px 28px",marginBottom:"24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"16px"}}>
            <div>
              <div style={{fontSize:"11px",fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",color:"#a78bfa",marginBottom:"6px"}}>Upgrade to Pro</div>
              <div style={{fontSize:"16px",fontWeight:500,color:"rgba(255,255,255,0.9)",marginBottom:"4px"}}>Unlimited audits + full history</div>
              <div style={{fontSize:"13px",color:"rgba(255,255,255,0.35)"}}>Free plan = 3 audits. Pro = unlimited for $36/month.</div>
            </div>
            <button onClick={handleUpgrade} disabled={upgrading} style={{padding:"12px 28px",borderRadius:"12px",background:"linear-gradient(135deg,#a78bfa,#818cf8)",color:"#fff",fontSize:"14px",fontWeight:600,border:"none",cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",opacity:upgrading?0.6:1}}>
              {upgrading ? "Loading..." : "Upgrade to Pro →"}
            </button>
          </div>
        )}

        {isPro && (
          <div style={{background:"rgba(74,222,128,0.05)",border:"1px solid rgba(74,222,128,0.15)",borderRadius:"20px",padding:"16px 24px",marginBottom:"24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"12px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
              <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 8px #4ade80"}} />
              <span style={{fontSize:"14px",color:"rgba(255,255,255,0.7)"}}>GhostOS Pro — Active</span>
            </div>
            <button onClick={handlePortal} style={{fontSize:"12px",color:"rgba(255,255,255,0.3)",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>Manage subscription →</button>
          </div>
        )}

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Total Audits</div>
            <div className="stat-value">{audits.length}</div>
            <div className="stat-sub">All time</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Best Score</div>
            <div className="stat-value" style={{ color: audits.length ? scoreColor(Math.max(...audits.map(a => a.readiness_score))) : "rgba(255,255,255,0.2)" }}>
              {audits.length ? Math.max(...audits.map(a => a.readiness_score)) : "—"}
            </div>
            <div className="stat-sub">Out of 100</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Best Deal Target</div>
            <div className="stat-value" style={{ fontSize: "28px" }}>
              {audits.length ? `$${Math.max(...audits.map(a => a.deal_target)).toLocaleString()}` : "—"}
            </div>
            <div className="stat-sub">Per deal</div>
          </div>
        </div>

        <div className="section-title">Your Audits</div>

        {audits.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◎</div>
            <div className="empty-title">No audits yet</div>
            <div className="empty-sub">Run your first audit to see your brand deal readiness score.</div>
            <a className="btn-primary" href="/audit">Run Your First Audit →</a>
          </div>
        ) : (
          <div className="audits-list">
            {audits.map((a) => (
              <div className="audit-card" key={a.id} onClick={() => router.push("/audit")}>
                <div>
                  <div className="audit-niche">{a.niche}{a.tiktok_handle ? ` · ${a.tiktok_handle}` : ""}</div>
                  <div className="audit-meta">
                    <span>👥 {a.followers.toLocaleString()} followers</span>
                    <span>▶ {a.avg_views.toLocaleString()} avg views</span>
                    <span>◎ {a.engagement_rate}% engagement</span>
                  </div>
                </div>
                <div className="audit-right">
                  <div className="audit-score" style={{ color: scoreColor(a.readiness_score) }}>{a.readiness_score}</div>
                  <div className="audit-score-label" style={{ color: scoreColor(a.readiness_score) }}>{scoreLabel(a.readiness_score)}</div>
                  <div className="audit-deal">${a.deal_low.toLocaleString()} – ${a.deal_high.toLocaleString()}</div>
                  <div className="audit-date">{new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
