"use client";
import "./page.module.css";
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
