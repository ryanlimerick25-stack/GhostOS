"use client";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

const FREE_FEATURES = [
  "3 free audits",
  "Readiness score (0–100)",
  "Estimated deal range",
  "Best-fit brand categories",
  "14-day action plan",
];

const PRO_FEATURES = [
  "Unlimited audits",
  "Full audit history & dashboard",
  "Rate card (single, package, ambassador)",
  "Cold outreach templates (3 formats)",
  "Media kit positioning statement",
  "Media kit pitch bullets",
  "Score trend over time",
  "Priority support",
];

export default function PricingPage() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const isPro = user?.publicMetadata?.is_pro === true;

  async function handleUpgrade() {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setLoading(false);
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #04040a; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; color: rgba(255,255,255,0.9); }
        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; height: 64px; background: rgba(4,4,10,0.8); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .nav-logo { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: rgba(255,255,255,0.9); display: flex; align-items: center; gap: 8px; text-decoration: none; }
        .nav-dot { width: 7px; height: 7px; border-radius: 50%; background: #a78bfa; box-shadow: 0 0 10px #a78bfa; animation: pulse 2s ease infinite; flex-shrink: 0; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        .page { max-width: 860px; margin: 0 auto; padding: 120px 24px 100px; }
        .header { text-align: center; margin-bottom: 64px; }
        .eyebrow { font-size: 11px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: #a78bfa; margin-bottom: 16px; display: block; }
        .title { font-family: 'Playfair Display', serif; font-size: clamp(36px,6vw,64px); font-weight: 700; line-height: 1.0; letter-spacing: -0.03em; color: rgba(255,255,255,0.93); margin-bottom: 16px; }
        .title em { font-style: italic; color: rgba(255,255,255,0.4); }
        .subtitle { font-size: 17px; font-weight: 300; color: rgba(255,255,255,0.35); max-width: 480px; margin: 0 auto; line-height: 1.6; }
        .cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media(max-width:640px){ .cards { grid-template-columns: 1fr; } }
        .card { border-radius: 28px; padding: 40px 36px; position: relative; overflow: hidden; }
        .card-free { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); }
        .card-pro { background: linear-gradient(145deg, rgba(167,139,250,0.08), rgba(129,140,248,0.04)); border: 1px solid rgba(167,139,250,0.25); }
        .card-pro::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background: linear-gradient(90deg,transparent,rgba(167,139,250,0.5),transparent); }
        .card-pro::after { content:''; position:absolute; inset:0; background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(167,139,250,0.06), transparent); pointer-events:none; }
        .plan-label { font-size: 11px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 20px; display: block; }
        .plan-label-pro { color: #a78bfa; }
        .price { font-family: 'Playfair Display', serif; font-size: 56px; font-weight: 700; letter-spacing: -0.03em; color: rgba(255,255,255,0.93); line-height: 1; margin-bottom: 4px; }
        .price-free { color: rgba(255,255,255,0.4); }
        .price-period { font-size: 15px; color: rgba(255,255,255,0.3); font-weight: 300; margin-bottom: 32px; }
        .divider { height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 28px; }
        .feature-list { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-bottom: 36px; }
        .feature-item { display: flex; align-items: flex-start; gap: 12px; font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.4; }
        .check { width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 10px; margin-top: 1px; }
        .check-free { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.3); }
        .check-pro { background: rgba(167,139,250,0.15); color: #a78bfa; }
        .btn-upgrade { width: 100%; padding: 16px; border-radius: 14px; background: linear-gradient(135deg,#a78bfa,#818cf8); color: #fff; font-size: 15px; font-weight: 600; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .btn-upgrade:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 16px 48px rgba(167,139,250,0.35); }
        .btn-upgrade:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-free { width: 100%; padding: 16px; border-radius: 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.6); font-size: 15px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; text-decoration: none; display: block; text-align: center; }
        .btn-free:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.9); }
        .badge-popular { position: absolute; top: 20px; right: 20px; background: linear-gradient(135deg,#a78bfa,#818cf8); color: #fff; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 4px 12px; border-radius: 99px; }
        .already-pro { width: 100%; padding: 16px; border-radius: 14px; background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.2); color: #4ade80; font-size: 14px; font-weight: 500; text-align: center; }
        .faq { margin-top: 80px; }
        .faq-title { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 600; color: rgba(255,255,255,0.9); text-align: center; margin-bottom: 40px; letter-spacing: -0.02em; }
        .faq-list { display: flex; flex-direction: column; gap: 2px; max-width: 600px; margin: 0 auto; }
        .faq-item { border-radius: 12px; overflow: hidden; }
        .faq-q { padding: 18px 20px; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
        .faq-q:hover { background: rgba(255,255,255,0.05); }
        .faq-a { padding: 16px 20px; font-size: 13px; color: rgba(255,255,255,0.4); line-height: 1.7; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-top: none; }
      `}</style>

      <nav>
        <a className="nav-logo" href="/"><div className="nav-dot" />GhostOS</a>
        <div style={{display:"flex",gap:"8px"}}>
          {user ? (
            <a href="/dashboard" style={{padding:"8px 18px",borderRadius:"99px",fontSize:"13px",fontWeight:500,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.6)",textDecoration:"none"}}>Dashboard</a>
          ) : (
            <>
              <a href="/sign-in" style={{padding:"8px 18px",borderRadius:"99px",fontSize:"13px",fontWeight:500,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.6)",textDecoration:"none"}}>Log in</a>
              <a href="/sign-up" style={{padding:"9px 20px",borderRadius:"99px",fontSize:"13px",fontWeight:500,background:"linear-gradient(135deg,#a78bfa,#818cf8)",color:"#fff",textDecoration:"none"}}>Get Started</a>
            </>
          )}
        </div>
      </nav>

      <div className="page">
        <div className="header">
          <span className="eyebrow">Pricing</span>
          <h1 className="title">Simple, <em>honest</em> pricing.</h1>
          <p className="subtitle">Start free. Upgrade when you're ready to go all in on landing brand deals.</p>
        </div>

        <div className="cards">
          <div className="card card-free">
            <span className="plan-label">Free</span>
            <div className="price price-free">$0</div>
            <div className="price-period">forever</div>
            <div className="divider" />
            <ul className="feature-list">
              {FREE_FEATURES.map((f) => (
                <li className="feature-item" key={f}>
                  <span className="check check-free">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <a className="btn-free" href="/audit">Start for free →</a>
          </div>

          <div className="card card-pro">
            <span className="badge-popular">Most Popular</span>
            <span className="plan-label plan-label-pro">Pro</span>
            <div className="price">$36</div>
            <div className="price-period">per month</div>
            <div className="divider" />
            <ul className="feature-list">
              {PRO_FEATURES.map((f) => (
                <li className="feature-item" key={f}>
                  <span className="check check-pro">✓</span>
                  <span style={{color:"rgba(255,255,255,0.8)"}}>{f}</span>
                </li>
              ))}
            </ul>
            {isPro ? (
              <div className="already-pro">✓ You're already on Pro</div>
            ) : (
              <button className="btn-upgrade" onClick={handleUpgrade} disabled={loading}>
                {loading ? "Loading..." : "Upgrade to Pro →"}
              </button>
            )}
          </div>
        </div>

        <div className="faq">
          <div className="faq-title">Common questions</div>
          <div className="faq-list">
            {[
              { q: "Can I cancel anytime?", a: "Yes. Cancel anytime from your dashboard with one click. You keep Pro access until the end of your billing period." },
              { q: "What counts as an audit?", a: "Each time you submit your stats and get a readiness score, rate card, and outreach templates — that's one audit." },
              { q: "Is the free plan really free?", a: "Yes. No credit card required. You get 3 full audits completely free." },
              { q: "What if my stats change?", a: "Run a new audit anytime. Pro users can track their progress over time with unlimited audits and full history." },
              { q: "How accurate are the rates?", a: "Our benchmarks are sourced from 2025–2026 creator market data and updated regularly. Rates vary by niche, engagement, and audience — we factor all of that in." },
            ].map(({ q, a }) => (
              <FAQItem key={q} q={q} a={a} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <div className="faq-q" onClick={() => setOpen(!open)}>
        {q}
        <span style={{color:"rgba(255,255,255,0.2)",flexShrink:0}}>{open ? "−" : "+"}</span>
      </div>
      {open && <div className="faq-a">{a}</div>}
    </div>
  );
}
