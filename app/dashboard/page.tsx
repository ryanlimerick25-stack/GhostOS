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
  result: any;
};

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [audits, setAudits] = useState<Audit[]>([]);
  const [isPro, setIsPro] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedAudit, setExpandedAudit] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) { router.push("/sign-in"); return; }
    Promise.all([
      fetch("/api/audits").then(r => r.json()),
      fetch("/api/user").then(r => r.json()),
    ]).then(([auditData, userData]) => {
      setAudits(auditData.audits || []);
      setIsPro(userData.is_pro || false);
      setLoading(false);
    });
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

  const freeAuditsUsed = !isPro ? audits.length : null;
  const freeAuditsLeft = freeAuditsUsed !== null ? Math.max(0, 3 - freeAuditsUsed) : null;

  if (!isLoaded || loading) return (
    <div style={{ minHeight: "100vh", background: "#04040a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "rgba(255,255,255,0.3)", fontFamily: "DM Sans, sans-serif" }}>Loading...</div>
    </div>
  );

  const expanded = expandedAudit ? audits.find(a => a.id === expandedAudit) : null;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #04040a; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; color: rgba(255,255,255,0.9); }
        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; height: 64px; background: rgba(4,4,10,0.8); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .nav-logo { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: rgba(255,255,255,0.9); display: flex; align-items: center; gap: 8px; text-decoration: none; }
        .nav-dot { width: 7px; height: 7px; border-radius: 50%; background: #a78bfa; box-shadow: 0 0 10px #a78bfa; animation: pulse 2s ease infinite; flex-shrink: 0; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        .nav-right { display: flex; align-items: center; gap: 12px; }
        .nav-user { font-size: 13px; color: rgba(255,255,255,0.4); }
        .nav-btn { padding: 8px 18px; border-radius: 99px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; text-decoration: none; display: inline-block; border: none; }
        .nav-audit { background: linear-gradient(135deg,#a78bfa,#818cf8); color: #fff; }
        .nav-audit:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(167,139,250,0.3); }
        .nav-signout { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); }
        .nav-signout:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.08); }
        .page { max-width: 900px; margin: 0 auto; padding: 96px 24px 60px; }
        .welcome { margin-bottom: 36px; }
        .welcome-label { font-size: 11px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: #a78bfa; margin-bottom: 10px; }
        .welcome-title { font-family: 'Playfair Display', serif; font-size: clamp(28px,4vw,44px); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; color: rgba(255,255,255,0.93); margin-bottom: 8px; }
        .welcome-title em { font-style: italic; color: rgba(255,255,255,0.4); }
        .welcome-sub { font-size: 15px; font-weight: 300; color: rgba(255,255,255,0.3); }
        .stats-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 32px; }
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
        .audit-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; overflow: hidden; transition: all 0.2s; }
        .audit-card:hover { border-color: rgba(167,139,250,0.2); }
        .audit-card-header { padding: 24px 28px; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 24px; cursor: pointer; position: relative; }
        .audit-card-header::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background: linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent); }
        .audit-card-header:hover { background: rgba(255,255,255,0.02); }
        .audit-niche { font-size: 16px; font-weight: 500; color: rgba(255,255,255,0.9); margin-bottom: 6px; }
        .audit-meta { font-size: 12px; color: rgba(255,255,255,0.28); display: flex; gap: 16px; flex-wrap: wrap; }
        .audit-right { text-align: right; }
        .audit-score { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; line-height: 1; margin-bottom: 4px; }
        .audit-score-label { font-size: 11px; font-weight: 500; letter-spacing: 0.06em; }
        .audit-deal { font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 6px; }
        .audit-date { font-size: 11px; color: rgba(255,255,255,0.2); margin-top: 2px; }
        .audit-expand-btn { font-size: 11px; color: rgba(167,139,250,0.7); margin-top: 6px; cursor: pointer; background: none; border: none; font-family: inherit; padding: 0; }
        .audit-detail { border-top: 1px solid rgba(255,255,255,0.05); padding: 28px; background: rgba(0,0,0,0.2); animation: fadeIn 0.2s ease; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .detail-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 24px; }
        @media(max-width:600px){.detail-grid{grid-template-columns:1fr}.audit-card-header{grid-template-columns:1fr}.audit-right{text-align:left}}
        .detail-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 16px 18px; }
        .detail-card-label { font-size: 9px; font-family: 'DM Mono', monospace; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.25); margin-bottom: 6px; }
        .detail-card-value { font-family: 'Playfair Display', serif; font-size: 24px; color: rgba(255,255,255,0.9); letter-spacing: -0.02em; }
        .detail-section { margin-bottom: 20px; }
        .detail-section-label { font-size: 9px; font-family: 'DM Mono', monospace; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.25); margin-bottom: 10px; }
        .detail-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .detail-list li { font-size: 13px; color: rgba(255,255,255,0.55); line-height: 1.5; display: flex; gap: 10px; }
        .detail-list li::before { content: '—'; color: rgba(255,255,255,0.15); flex-shrink: 0; font-family: 'DM Mono', monospace; }
        .tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .tag { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 99px; padding: 4px 12px; font-size: 11px; color: rgba(255,255,255,0.5); }
        .trend-bar { display: flex; align-items: flex-end; gap: 6px; height: 48px; margin-top: 8px; }
        .trend-bar-item { flex: 1; border-radius: 4px 4px 0 0; min-width: 8px; transition: opacity 0.2s; cursor: default; position: relative; }
        .trend-bar-item:hover { opacity: 0.8; }
        .progress-bar-wrap { height: 4px; background: rgba(255,255,255,0.06); border-radius: 99px; overflow: hidden; margin-top: 8px; }
        .progress-bar-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg,#a78bfa,#818cf8); }
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
          <h1 className="welcome-title">Welcome back, <em>{user?.firstName || "Creator"}</em></h1>
          <p className="welcome-sub">Track your brand deal readiness over time.</p>
        </div>

        {/* Free usage bar */}
        {!isPro && (
          <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"16px",padding:"16px 20px",marginBottom:"16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
              <span style={{fontSize:"12px",color:"rgba(255,255,255,0.4)"}}>Free audits used</span>
              <span style={{fontSize:"12px",fontWeight:500,color:"rgba(255,255,255,0.6)"}}>{audits.length} / 3</span>
            </div>
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{width:`${Math.min(100,(audits.length/3)*100)}%`, background: audits.length >= 3 ? "#f87171" : "linear-gradient(90deg,#a78bfa,#818cf8)"}} />
            </div>
            {freeAuditsLeft === 0 && (
              <div style={{marginTop:"10px",fontSize:"12px",color:"#fca5a5"}}>You've used all 3 free audits. <button onClick={handleUpgrade} style={{color:"#a78bfa",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:"12px",padding:0}}>Upgrade to Pro →</button></div>
            )}
          </div>
        )}

        {/* Upgrade banner */}
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

        {/* Stats */}
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

        {/* Score trend */}
        {audits.length > 1 && (
          <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"16px",padding:"20px 24px",marginBottom:"32px"}}>
            <div style={{fontSize:"11px",fontFamily:"DM Mono,monospace",letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.25)",marginBottom:"12px"}}>Score Trend</div>
            <div className="trend-bar">
              {[...audits].reverse().map((a, i) => (
                <div
                  key={a.id}
                  className="trend-bar-item"
                  style={{height:`${a.readiness_score}%`, background: scoreColor(a.readiness_score), opacity: 0.7}}
                  title={`${a.readiness_score}/100 — ${new Date(a.created_at).toLocaleDateString()}`}
                />
              ))}
            </div>
          </div>
        )}

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
              <div className="audit-card" key={a.id}>
                <div className="audit-card-header" onClick={() => setExpandedAudit(expandedAudit === a.id ? null : a.id)}>
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
                    <div style={{fontSize:"11px",color:"rgba(167,139,250,0.6)",marginTop:"6px"}}>{expandedAudit === a.id ? "▲ collapse" : "▼ view details"}</div>
                  </div>
                </div>

                {expandedAudit === a.id && a.result && (
                  <div className="audit-detail">
                    {/* Deal range */}
                    <div className="detail-grid">
                      <div className="detail-card">
                        <div className="detail-card-label">Conservative</div>
                        <div className="detail-card-value">${a.result.estimated_first_deal_range_usd?.low?.toLocaleString()}</div>
                      </div>
                      <div className="detail-card" style={{borderColor:"rgba(201,184,255,0.15)",background:"rgba(201,184,255,0.03)"}}>
                        <div className="detail-card-label" style={{color:"rgba(167,139,250,0.6)"}}>Target</div>
                        <div className="detail-card-value" style={{color:"#c9b8ff"}}>${a.result.estimated_first_deal_range_usd?.target?.toLocaleString()}</div>
                      </div>
                      <div className="detail-card">
                        <div className="detail-card-label">Best Case</div>
                        <div className="detail-card-value">${a.result.estimated_first_deal_range_usd?.high?.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Brand categories */}
                    {a.result.best_fit_brand_categories?.length > 0 && (
                      <div className="detail-section">
                        <div className="detail-section-label">Best-Fit Brand Categories</div>
                        <div className="tags">
                          {a.result.best_fit_brand_categories.map((c: string, i: number) => (
                            <span className="tag" key={i}>{c}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Why brands pay */}
                    {a.result.why_brands_would_pay?.length > 0 && (
                      <div className="detail-section">
                        <div className="detail-section-label">Why Brands Would Pay You</div>
                        <ul className="detail-list">
                          {a.result.why_brands_would_pay.map((x: string, i: number) => <li key={i}>{x}</li>)}
                        </ul>
                      </div>
                    )}

                    {/* Top gaps */}
                    {a.result.top_gaps_to_fix_next_14_days?.length > 0 && (
                      <div className="detail-section">
                        <div className="detail-section-label">Top Gaps to Fix</div>
                        <ul className="detail-list">
                          {a.result.top_gaps_to_fix_next_14_days.map((x: string, i: number) => (
                            <li key={i} style={{color:"rgba(248,113,113,0.7)"}}>{x}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Rate card */}
                    {a.result.rate_card_usd && (
                      <div className="detail-section">
                        <div className="detail-section-label">Rate Card</div>
                        <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                          {[
                            {label:"Single Post", value:`$${a.result.rate_card_usd.single_post?.toLocaleString()}`},
                            {label:"3-Post Package", value:`$${a.result.rate_card_usd.three_post_package?.toLocaleString()}`},
                            {label:"Ambassador", value:`$${a.result.rate_card_usd.monthly_ambassador?.toLocaleString()}`},
                          ].map(({label,value}) => (
                            <div key={label} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"10px",padding:"10px 14px"}}>
                              <div style={{fontSize:"9px",fontFamily:"DM Mono,monospace",letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.25)",marginBottom:"4px"}}>{label}</div>
                              <div style={{fontSize:"18px",fontFamily:"Playfair Display,serif",color:"rgba(255,255,255,0.85)"}}>{value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <a href="/audit" style={{display:"inline-flex",alignItems:"center",gap:"6px",marginTop:"8px",padding:"10px 20px",borderRadius:"10px",background:"linear-gradient(135deg,#a78bfa,#818cf8)",color:"#fff",fontSize:"13px",fontWeight:600,textDecoration:"none",fontFamily:"inherit"}}>
                      Run New Audit →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
