"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

type DealResult = {
  verdict: string;
  verdict_color: string;
  fair_value_low: number;
  fair_value_high: number;
  offered_vs_market_percent: number;
  summary: string;
  what_youre_missing: string[];
  red_flags: string[];
  strengths: string[];
  counter_offer_amount: number;
  negotiation_script: string;
  should_take_it: boolean;
  final_recommendation: string;
};

export default function DealAnalyzer() {
  const { user } = useUser();
  const [brandName, setBrandName] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [offeredRate, setOfferedRate] = useState("");
  const [usageRights, setUsageRights] = useState("");
  const [exclusivity, setExclusivity] = useState(false);
  const [exclusivityDuration, setExclusivityDuration] = useState("");
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DealResult | null>(null);
  const [usedFree, setUsedFree] = useState(false);

  useEffect(() => {
    setUsedFree(localStorage.getItem("deal_analysis_used") === "true");
  }, []);

  const isProUser = user?.publicMetadata?.is_pro === true;
  const canAnalyze = isProUser || !usedFree;

  // Try to get creator profile from localStorage (set after audit)
  const creatorProfile = (() => {
    try { return JSON.parse(localStorage.getItem("last_audit_profile") || "null"); } catch { return null; }
  })();

  async function analyze() {
    if (!canAnalyze) {
      setError("You\'ve used your free analysis. Upgrade to GhostOS Pro for unlimited deal analysis.");
      return;
    }
    if (!brandName || !deliverables || !offeredRate) {
      setError("Please fill in Brand, Deliverables, and Offered Rate.");
      return;
    }
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch("/api/deal-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandName, deliverables, offeredRate: Number(offeredRate), usageRights, exclusivity, exclusivityDuration, deadline, notes, creatorProfile }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed");
      setResult(json.data);
      if (!isProUser) {
        localStorage.setItem("deal_analysis_used", "true");
        setUsedFree(true);
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const verdictColors: Record<string, string> = {
    red: "#f87171", orange: "#fb923c", yellow: "#facc15", green: "#4ade80", purple: "#a78bfa"
  };
  const vc = result ? (verdictColors[result.verdict_color] || "#888") : "#888";

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080808; color: #e8e6e1; font-family: 'Geist', sans-serif; }
        .page { min-height: 100vh; background: #080808; background-image: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(120,90,255,0.07), transparent); }
        .container { max-width: 780px; margin: 0 auto; padding: 60px 24px 100px; }
        .eyebrow { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #6b6b6b; margin-bottom: 12px; }
        .title { font-family: 'DM Serif Display', serif; font-size: clamp(32px,5vw,48px); font-weight: 400; line-height: 1.1; color: #f0ede8; letter-spacing: -0.02em; }
        .title em { font-style: italic; color: #c9b8ff; }
        .subtitle { margin-top: 12px; font-size: 14px; color: #999; font-weight: 300; }
        .card { background: #0f0f0f; border: 1px solid #1e1e1e; border-radius: 20px; padding: 32px; position: relative; overflow: hidden; margin-bottom: 16px; }
        .card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg,transparent,rgba(201,184,255,0.3),transparent); }
        .field-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #666; margin-bottom: 8px; display: block; }
        .input { width: 100%; background: #080808; border: 1px solid #1e1e1e; border-radius: 10px; padding: 10px 14px; font-size: 14px; color: #e8e6e1; font-family: inherit; outline: none; transition: border-color 0.2s; }
        .input:focus { border-color: #3d3d3d; }
        .textarea { width: 100%; background: #080808; border: 1px solid #1e1e1e; border-radius: 10px; padding: 10px 14px; font-size: 14px; color: #e8e6e1; font-family: inherit; outline: none; resize: vertical; min-height: 80px; transition: border-color 0.2s; }
        .textarea:focus { border-color: #3d3d3d; }
        .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media(max-width:600px) { .grid2 { grid-template-columns: 1fr; } }
        .field { display: flex; flex-direction: column; gap: 0; }
        .run-btn { margin-top: 24px; width: 100%; padding: 14px; background: #c9b8ff; color: #0a0814; border: none; border-radius: 12px; font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .run-btn:hover:not(:disabled) { background: #ddd0ff; transform: translateY(-1px); box-shadow: 0 8px 30px rgba(201,184,255,0.2); }
        .run-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .error-box { margin-top: 16px; padding: 12px 16px; background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; font-size: 13px; color: #fca5a5; }
        .results { margin-top: 32px; animation: fadeUp 0.4s ease; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .verdict-hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; }
        .verdict-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #4a4a4a; margin-bottom: 8px; }
        .verdict-text { font-family: 'DM Serif Display', serif; font-size: 48px; font-weight: 400; line-height: 1; }
        .verdict-pct { font-family: 'DM Serif Display', serif; font-size: 64px; font-weight: 400; line-height: 1; flex-shrink: 0; }
        .section-eyebrow { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: #4a4a4a; margin-bottom: 16px; }
        .value-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-top: 16px; }
        .value-card { background: #080808; border: 1px solid #1a1a1a; border-radius: 14px; padding: 16px 18px; }
        .value-card-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: #3a3a3a; margin-bottom: 6px; }
        .value-card-value { font-family: 'DM Serif Display', serif; font-size: 26px; color: #e8e6e1; letter-spacing: -0.02em; }
        .value-card.highlight { border-color: rgba(201,184,255,0.2); background: rgba(201,184,255,0.03); }
        .value-card.highlight .value-card-value { color: #c9b8ff; }
        .list-block { display: flex; flex-direction: column; gap: 10px; }
        .list-item { display: flex; align-items: flex-start; gap: 12px; font-size: 14px; color: #888; line-height: 1.5; }
        .dot-red { width: 6px; height: 6px; border-radius: 50%; background: #f87171; flex-shrink: 0; margin-top: 6px; }
        .dot-green { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; flex-shrink: 0; margin-top: 6px; }
        .dot-yellow { width: 6px; height: 6px; border-radius: 50%; background: #facc15; flex-shrink: 0; margin-top: 6px; }
        .script-box { background: #080808; border: 1px solid #1e1e1e; border-left: 2px solid #c9b8ff; border-radius: 0 12px 12px 0; padding: 20px 24px; font-size: 14px; color: #aaa; line-height: 1.75; font-style: italic; white-space: pre-wrap; }
        .rec-box { border-radius: 14px; padding: 20px 24px; font-size: 14px; line-height: 1.6; }
        .toggle-row { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .toggle { width: 40px; height: 22px; border-radius: 99px; background: #1e1e1e; border: 1px solid #2a2a2a; position: relative; transition: background 0.2s; flex-shrink: 0; }
        .toggle.on { background: #c9b8ff; border-color: #c9b8ff; }
        .toggle-knob { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #888; transition: transform 0.2s, background 0.2s; }
        .toggle.on .toggle-knob { transform: translateX(18px); background: #0a0814; }
        .free-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(201,184,255,0.08); border: 1px solid rgba(201,184,255,0.2); border-radius: 99px; padding: 5px 12px; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #c9b8ff; margin-bottom: 20px; }
      `}</style>

      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 40px",height:"64px",background:"rgba(8,8,8,0.85)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
        <a href="/" style={{fontFamily:"'DM Serif Display',serif",fontSize:"18px",fontWeight:700,color:"rgba(255,255,255,0.9)",display:"flex",alignItems:"center",gap:"8px",textDecoration:"none"}}>
          <div style={{width:"7px",height:"7px",borderRadius:"50%",background:"#a78bfa",boxShadow:"0 0 10px #a78bfa"}} />
          GhostOS
        </a>
        <div style={{display:"flex",gap:"8px"}}>
          <a href="/pricing" style={{padding:"8px 18px",borderRadius:"99px",fontSize:"13px",fontWeight:500,color:"rgba(255,255,255,0.4)",textDecoration:"none"}}>Pricing</a>
          <a href="/dashboard" style={{padding:"8px 18px",borderRadius:"99px",fontSize:"13px",fontWeight:500,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.6)",textDecoration:"none"}}>← Dashboard</a>
        </div>
      </nav>

      <div className="page" style={{paddingTop:"80px"}}>
        <div className="container">
          <div style={{marginBottom:"48px"}}>
            <div className="eyebrow">GhostOS</div>
            <h1 className="title">Deal <em>Analyzer</em></h1>
            <p className="subtitle">Paste in a brand offer. Find out if you're getting lowballed.</p>
          </div>

          {!isProUser && (
            <div className="free-badge">
              {usedFree ? "⚠ Free analysis used — upgrade to Pro for unlimited" : "✦ 1 free analysis included"}
            </div>
          )}

          {creatorProfile && (
            <div style={{background:"rgba(74,222,128,0.04)",border:"1px solid rgba(74,222,128,0.12)",borderRadius:"12px",padding:"12px 16px",marginBottom:"16px",fontSize:"13px",color:"rgba(74,222,128,0.7)",display:"flex",gap:"8px",alignItems:"center"}}>
              <span>✓</span>
              <span>Using your audit profile — {creatorProfile.followers?.toLocaleString()} followers · {creatorProfile.niche} · {creatorProfile.engagementRate}% engagement</span>
            </div>
          )}

          <div className="card">
            <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
              <div className="field">
                <span className="field-label">Brand Name *</span>
                <input className="input" value={brandName} onChange={e=>setBrandName(e.target.value)} placeholder="e.g. Gymshark, NordVPN, Bloom Nutrition" />
              </div>
              <div className="field">
                <span className="field-label">Deliverables *</span>
                <input className="input" value={deliverables} onChange={e=>setDeliverables(e.target.value)} placeholder="e.g. 2 TikTok videos + 1 Story, 30-60 sec each" />
              </div>
              <div className="grid2">
                <div className="field">
                  <span className="field-label">Offered Rate (USD) *</span>
                  <input className="input" value={offeredRate} onChange={e=>setOfferedRate(e.target.value)} placeholder="e.g. 400" type="number" />
                </div>
                <div className="field">
                  <span className="field-label">Usage Rights</span>
                  <input className="input" value={usageRights} onChange={e=>setUsageRights(e.target.value)} placeholder="e.g. 90 days paid social" />
                </div>
              </div>
              <div className="grid2">
                <div className="field">
                  <span className="field-label">Deadline</span>
                  <input className="input" value={deadline} onChange={e=>setDeadline(e.target.value)} placeholder="e.g. Content due in 2 weeks" />
                </div>
                <div className="field" style={{justifyContent:"flex-end"}}>
                  <span className="field-label">Exclusivity</span>
                  <div className="toggle-row" onClick={()=>setExclusivity(!exclusivity)}>
                    <div className={"toggle" + (exclusivity?" on":"")}>
                      <div className="toggle-knob" />
                    </div>
                    <span style={{fontSize:"13px",color:exclusivity?"#c9b8ff":"#444"}}>{exclusivity?"Yes — they want exclusivity":"No exclusivity"}</span>
                  </div>
                </div>
              </div>
              {exclusivity && (
                <div className="field">
                  <span className="field-label">Exclusivity Duration</span>
                  <input className="input" value={exclusivityDuration} onChange={e=>setExclusivityDuration(e.target.value)} placeholder="e.g. 30 days, 60 days, 3 months" />
                </div>
              )}
              <div className="field">
                <span className="field-label">Additional Notes</span>
                <textarea className="textarea" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Paste the full offer message, any other terms, or context about the brand..." />
              </div>
            </div>
            <button className="run-btn" onClick={analyze} disabled={loading || !canAnalyze}>
              {loading ? "Analyzing deal..." : canAnalyze ? "Analyze Deal →" : "Upgrade to Pro →"}
            </button>
            {!canAnalyze && <div style={{marginTop:"12px",textAlign:"center"}}><a href="/pricing" style={{fontSize:"13px",color:"#c9b8ff",textDecoration:"none"}}>Get GhostOS Pro for unlimited deal analysis →</a></div>}
            {error && <div className="error-box">{error}</div>}
          </div>

          {result && (
            <div className="results">
              <div className="card">
                <div className="verdict-hero">
                  <div>
                    <div className="verdict-label">Verdict</div>
                    <div className="verdict-text" style={{color:vc}}>{result.verdict}</div>
                    <div style={{marginTop:"8px",fontSize:"13px",color:"#555"}}>{result.summary}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div className="verdict-label">vs Market Rate</div>
                    <div className="verdict-pct" style={{color:vc}}>
                      {result.offered_vs_market_percent > 0 ? "+" : ""}{result.offered_vs_market_percent}%
                    </div>
                  </div>
                </div>
                <div className="value-grid">
                  <div className="value-card">
                    <div className="value-card-label">Offered</div>
                    <div className="value-card-value">${Number(offeredRate).toLocaleString()}</div>
                  </div>
                  <div className="value-card highlight">
                    <div className="value-card-label">Fair Range</div>
                    <div className="value-card-value">${result.fair_value_low}–${result.fair_value_high}</div>
                  </div>
                  <div className="value-card">
                    <div className="value-card-label">Counter With</div>
                    <div className="value-card-value" style={{color:"#4ade80"}}>${result.counter_offer_amount.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {result.red_flags?.length > 0 && (
                <div className="card">
                  <div className="section-eyebrow">Red Flags</div>
                  <div className="list-block">
                    {result.red_flags.map((f,i)=>(
                      <div className="list-item" key={i}><span className="dot-red"/>{f}</div>
                    ))}
                  </div>
                </div>
              )}

              {result.what_youre_missing?.length > 0 && (
                <div className="card">
                  <div className="section-eyebrow">Missing From This Offer</div>
                  <div className="list-block">
                    {result.what_youre_missing.map((f,i)=>(
                      <div className="list-item" key={i}><span className="dot-yellow"/>{f}</div>
                    ))}
                  </div>
                </div>
              )}

              {result.strengths?.length > 0 && (
                <div className="card">
                  <div className="section-eyebrow">What's Good About This Offer</div>
                  <div className="list-block">
                    {result.strengths.map((f,i)=>(
                      <div className="list-item" key={i}><span className="dot-green"/>{f}</div>
                    ))}
                  </div>
                </div>
              )}

              <div className="card">
                <div className="section-eyebrow">Negotiation Script</div>
                <div className="script-box">{result.negotiation_script}</div>
              </div>

              <div className="card">
                <div className="section-eyebrow">Final Recommendation</div>
                <div className="rec-box" style={{background:result.should_take_it?"rgba(74,222,128,0.05)":"rgba(248,113,113,0.05)",border:`1px solid ${result.should_take_it?"rgba(74,222,128,0.15)":"rgba(248,113,113,0.15)"}`}}>
                  <div style={{fontSize:"16px",fontWeight:600,color:result.should_take_it?"#4ade80":"#f87171",marginBottom:"8px"}}>
                    {result.should_take_it ? "✓ Take it (with negotiation)" : "✗ Don't take it as-is"}
                  </div>
                  <div style={{fontSize:"14px",color:"#888",lineHeight:"1.6"}}>{result.final_recommendation}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
