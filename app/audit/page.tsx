"use client";

import { useState } from "react";

type AuditResult = {
  readiness_score: number;
  estimated_first_deal_range_usd: { low: number; target: number; high: number };
  best_fit_brand_categories: string[];
  why_brands_would_pay: string[];
  top_gaps_to_fix_next_14_days: string[];
  next_actions: { today: string[]; this_week: string[]; this_month: string[] };
  media_kit_positioning?: string;
  media_kit_brand_pitch_bullets?: string[];
  rate_card_usd?: {
    single_post: number;
    three_post_package: number;
    monthly_ambassador: number;
    usage_rights_addon: number;
    exclusivity_addon: number;
  };
  cold_outreach_templates?: {
    direct_brand: string;
    agency: string;
    follow_up: string;
  };
};

export default function AuditPage() {
  const [followers, setFollowers] = useState("30000");
  const [avgViews, setAvgViews] = useState("45000");
  const [engagementRate, setEngagementRate] = useState("6.5");
  const [niche, setNiche] = useState("streetwear + lifestyle");
  const [audienceGeo, setAudienceGeo] = useState("US (California), some UK");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);

  async function runAudit() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          followers: Number(followers),
          avgViews: Number(avgViews),
          engagementRate: Number(engagementRate),
          niche,
          audienceGeo,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Request failed");
      setResult(json.data);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const score = result?.readiness_score ?? 0;
  const scoreColor =
    score >= 75 ? "#4ade80" : score >= 50 ? "#facc15" : "#f87171";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Geist:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #080808;
          color: #e8e6e1;
          font-family: 'Geist', sans-serif;
          min-height: 100vh;
        }

        .page {
          min-height: 100vh;
          background: #080808;
          background-image:
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(120, 90, 255, 0.08), transparent),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(255, 180, 50, 0.04), transparent);
        }

        .container {
          max-width: 780px;
          margin: 0 auto;
          padding: 60px 24px 100px;
        }

        /* Header */
        .header {
          margin-bottom: 56px;
        }

        .eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #6b6b6b;
          margin-bottom: 12px;
        }

        .title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 400;
          line-height: 1.1;
          color: #f0ede8;
          letter-spacing: -0.02em;
        }

        .title em {
          font-style: italic;
          color: #c9b8ff;
        }

        .subtitle {
          margin-top: 12px;
          font-size: 14px;
          color: #999;
          font-weight: 300;
          letter-spacing: 0.01em;
        }

        /* Form card */
        .form-card {
          background: #0f0f0f;
          border: 1px solid #1e1e1e;
          border-radius: 20px;
          padding: 32px;
          position: relative;
          overflow: hidden;
        }

        .form-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201, 184, 255, 0.3), transparent);
        }

        .form-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-top: 16px;
        }

        @media (max-width: 600px) {
          .form-grid-3, .form-grid-2 { grid-template-columns: 1fr; }
        }

        .field label {
          display: block;
        }

        .field-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 8px;
          display: block;
        }

        .field input {
          width: 100%;
          background: #080808;
          border: 1px solid #1e1e1e;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 14px;
          color: #e8e6e1;
          font-family: 'Geist', sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }

        .field input:focus {
          border-color: #3d3d3d;
        }

        .run-btn {
          margin-top: 24px;
          width: 100%;
          padding: 14px;
          background: #c9b8ff;
          color: #0a0814;
          border: none;
          border-radius: 12px;
          font-family: 'Geist', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }

        .run-btn:hover:not(:disabled) {
          background: #ddd0ff;
          transform: translateY(-1px);
          box-shadow: 0 8px 30px rgba(201, 184, 255, 0.2);
        }

        .run-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading-dots::after {
          content: '';
          animation: dots 1.2s steps(4, end) infinite;
        }

        @keyframes dots {
          0%, 20% { content: ''; }
          40% { content: '.'; }
          60% { content: '..'; }
          80%, 100% { content: '...'; }
        }

        .error-box {
          margin-top: 16px;
          padding: 12px 16px;
          background: rgba(239, 68, 68, 0.06);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 10px;
          font-size: 13px;
          color: #fca5a5;
        }

        /* Results */
        .results {
          margin-top: 40px;
          animation: fadeUp 0.4s ease;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Score hero */
        .score-hero {
          background: #0f0f0f;
          border: 1px solid #1e1e1e;
          border-radius: 20px;
          padding: 36px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          position: relative;
          overflow: hidden;
        }

        .score-hero::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201, 184, 255, 0.2), transparent);
        }

        .score-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #4a4a4a;
          margin-bottom: 8px;
        }

        .score-title {
          font-family: 'DM Serif Display', serif;
          font-size: 22px;
          font-weight: 400;
          color: #f0ede8;
        }

        .score-desc {
          margin-top: 6px;
          font-size: 13px;
          color: #444;
        }

        .score-number {
          font-family: 'DM Serif Display', serif;
          font-size: 72px;
          font-weight: 400;
          line-height: 1;
          letter-spacing: -0.03em;
          flex-shrink: 0;
        }

        .score-denom {
          font-size: 28px;
          color: #333;
        }

        /* Score bar */
        .score-bar-wrap {
          margin-top: 24px;
          height: 3px;
          background: #1a1a1a;
          border-radius: 99px;
          overflow: hidden;
        }

        .score-bar-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 1s ease;
        }

        /* Deal range */
        .deal-range {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 16px;
        }

        @media (max-width: 500px) {
          .deal-range { grid-template-columns: 1fr; }
        }

        .deal-card {
          background: #080808;
          border: 1px solid #1a1a1a;
          border-radius: 14px;
          padding: 16px 18px;
        }

        .deal-card-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #3a3a3a;
          margin-bottom: 6px;
        }

        .deal-card-value {
          font-family: 'DM Serif Display', serif;
          font-size: 28px;
          color: #e8e6e1;
          letter-spacing: -0.02em;
        }

        .deal-card.target {
          border-color: rgba(201, 184, 255, 0.2);
          background: rgba(201, 184, 255, 0.03);
        }

        .deal-card.target .deal-card-label { color: #7a6fa8; }
        .deal-card.target .deal-card-value { color: #c9b8ff; }

        /* Section blocks */
        .section-block {
          margin-top: 24px;
          background: #0f0f0f;
          border: 1px solid #1e1e1e;
          border-radius: 20px;
          padding: 28px 32px;
        }

        .section-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #4a4a4a;
          margin-bottom: 16px;
        }

        .section-title {
          font-family: 'DM Serif Display', serif;
          font-size: 20px;
          font-weight: 400;
          color: #f0ede8;
          margin-bottom: 20px;
        }

        /* Tag pills */
        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag {
          background: #141414;
          border: 1px solid #232323;
          border-radius: 99px;
          padding: 6px 14px;
          font-size: 12px;
          color: #888;
          font-weight: 400;
        }

        /* Bullet list */
        .bullet-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .bullet-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 14px;
          color: #888;
          line-height: 1.5;
        }

        .bullet-list li::before {
          content: '—';
          color: #2e2e2e;
          flex-shrink: 0;
          margin-top: 1px;
          font-family: 'DM Mono', monospace;
        }

        /* Gap list (highlighted) */
        .gap-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .gap-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 14px;
          color: #aaa;
          line-height: 1.5;
        }

        .gap-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #f87171;
          flex-shrink: 0;
          margin-top: 6px;
        }

        /* Actions grid */
        .actions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        @media (max-width: 600px) {
          .actions-grid { grid-template-columns: 1fr; }
        }

        .action-card {
          background: #080808;
          border: 1px solid #1a1a1a;
          border-radius: 14px;
          padding: 18px;
        }

        .action-card-title {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c9b8ff;
          margin-bottom: 14px;
        }

        /* Rate card grid */
        .rate-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        @media (max-width: 500px) {
          .rate-grid { grid-template-columns: 1fr; }
        }

        .rate-item {
          background: #080808;
          border: 1px solid #1a1a1a;
          border-radius: 14px;
          padding: 18px 20px;
        }

        .rate-item-label {
          font-size: 11px;
          color: #444;
          margin-bottom: 6px;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.05em;
        }

        .rate-item-value {
          font-family: 'DM Serif Display', serif;
          font-size: 26px;
          color: #e8e6e1;
          letter-spacing: -0.02em;
        }

        .rate-item.addon .rate-item-value {
          color: #4ade80;
          font-size: 22px;
        }

        /* Media kit positioning */
        .positioning-box {
          background: #080808;
          border: 1px solid #1e1e1e;
          border-left: 2px solid #c9b8ff;
          border-radius: 0 12px 12px 0;
          padding: 20px 24px;
          font-size: 14px;
          color: #aaa;
          line-height: 1.7;
          font-style: italic;
        }

        /* Outreach templates */
        .template-block {
          background: #080808;
          border: 1px solid #1a1a1a;
          border-radius: 14px;
          padding: 20px 24px;
        }

        .template-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #4a4a4a;
          margin-bottom: 14px;
        }

        .template-text {
          font-size: 13px;
          color: #777;
          line-height: 1.75;
          white-space: pre-wrap;
          font-family: 'Geist', sans-serif;
        }

        /* Divider */
        .divider {
          height: 1px;
          background: #141414;
          margin: 0;
        }

        /* Footer badge */
        .footer-badge {
          margin-top: 60px;
          text-align: center;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #444;
        }
      `}</style>

      <div className="page">
        <div className="container">

          {/* Header */}
          <div className="header">
            <div className="eyebrow">Creator Revenue OS</div>
            <h1 className="title">
              Brand Deal<br /><em>Readiness Audit</em>
            </h1>
            <p className="subtitle">For TikTok creators (20k–200k) trying to land their first deal.</p>
          </div>

          {/* Form */}
          <div className="form-card">
            <div className="form-grid-3">
              <Field label="Followers" value={followers} onChange={setFollowers} numeric />
              <Field label="Avg Views" value={avgViews} onChange={setAvgViews} numeric />
              <Field label="Engagement %" value={engagementRate} onChange={setEngagementRate} numeric />
            </div>
            <div className="form-grid-2">
              <Field label="Niche" value={niche} onChange={setNiche} />
              <Field label="Audience Geo" value={audienceGeo} onChange={setAudienceGeo} />
            </div>
            <button className="run-btn" onClick={runAudit} disabled={loading}>
              {loading ? <span className="loading-dots">Analyzing your profile</span> : "Run Audit →"}
            </button>
            {error && <div className="error-box">{error}</div>}
          </div>

          {/* Results */}
          {result && (
            <div className="results">

              {/* Score hero */}
              <div className="score-hero">
                <div style={{ flex: 1 }}>
                  <div className="score-label">Readiness Score</div>
                  <div className="score-title">Brand Deal Readiness</div>
                  <div className="score-desc">How close you are to landing your first deal</div>
                  <div className="score-bar-wrap" style={{ marginTop: 20 }}>
                    <div
                      className="score-bar-fill"
                      style={{ width: `${score}%`, background: scoreColor }}
                    />
                  </div>
                </div>
                <div className="score-number" style={{ color: scoreColor }}>
                  {score}<span className="score-denom">/100</span>
                </div>
              </div>

              {/* Deal range */}
              <div className="section-block">
                <div className="section-eyebrow">Estimated First Deal</div>
                <div className="deal-range">
                  <div className="deal-card">
                    <div className="deal-card-label">Conservative</div>
                    <div className="deal-card-value">${result.estimated_first_deal_range_usd.low}</div>
                  </div>
                  <div className="deal-card target">
                    <div className="deal-card-label">Target</div>
                    <div className="deal-card-value">${result.estimated_first_deal_range_usd.target}</div>
                  </div>
                  <div className="deal-card">
                    <div className="deal-card-label">Best case</div>
                    <div className="deal-card-value">${result.estimated_first_deal_range_usd.high}</div>
                  </div>
                </div>
              </div>

              {/* Brand categories */}
              <div className="section-block">
                <div className="section-eyebrow">Best-Fit Brand Categories</div>
                <div className="tags">
                  {result.best_fit_brand_categories.map((c, i) => (
                    <span className="tag" key={i}>{c}</span>
                  ))}
                </div>
              </div>

              {/* Why brands pay */}
              <div className="section-block">
                <div className="section-eyebrow">Why Brands Would Pay You</div>
                <ul className="bullet-list">
                  {result.why_brands_would_pay.map((x, i) => <li key={i}>{x}</li>)}
                </ul>
              </div>

              {/* Gaps */}
              <div className="section-block">
                <div className="section-eyebrow">Top Gaps — Next 14 Days</div>
                <ul className="gap-list">
                  {result.top_gaps_to_fix_next_14_days.map((x, i) => (
                    <li key={i}><span className="gap-dot" />{x}</li>
                  ))}
                </ul>
              </div>

              {/* Next actions */}
              <div className="section-block">
                <div className="section-eyebrow">Action Plan</div>
                <div className="actions-grid">
                  {[
                    { title: "Today", items: result.next_actions.today },
                    { title: "This Week", items: result.next_actions.this_week },
                    { title: "This Month", items: result.next_actions.this_month },
                  ].map(({ title, items }) => (
                    <div className="action-card" key={title}>
                      <div className="action-card-title">{title}</div>
                      <ul className="bullet-list">
                        {items.map((x, i) => <li key={i}>{x}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Media kit positioning */}
              {result.media_kit_positioning && (
                <div className="section-block">
                  <div className="section-eyebrow">Media Kit Positioning</div>
                  <div className="positioning-box">{result.media_kit_positioning}</div>
                </div>
              )}

              {/* Pitch bullets */}
              {(result.media_kit_brand_pitch_bullets?.length ?? 0) > 0 && (
                <div className="section-block">
                  <div className="section-eyebrow">Media Kit Pitch Bullets</div>
                  <ul className="bullet-list">
                    {result.media_kit_brand_pitch_bullets?.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              )}

              {/* Rate card */}
              {result.rate_card_usd && (
                <div className="section-block">
                  <div className="section-eyebrow">Rate Card (USD)</div>
                  <div className="rate-grid">
                    <div className="rate-item">
                      <div className="rate-item-label">Single Post</div>
                      <div className="rate-item-value">${result.rate_card_usd.single_post}</div>
                    </div>
                    <div className="rate-item">
                      <div className="rate-item-label">3-Post Package</div>
                      <div className="rate-item-value">${result.rate_card_usd.three_post_package}</div>
                    </div>
                    <div className="rate-item">
                      <div className="rate-item-label">Monthly Ambassador</div>
                      <div className="rate-item-value">${result.rate_card_usd.monthly_ambassador}</div>
                    </div>
                    <div className="rate-item addon">
                      <div className="rate-item-label">Usage Rights Add-on</div>
                      <div className="rate-item-value">+${result.rate_card_usd.usage_rights_addon}</div>
                    </div>
                    <div className="rate-item addon">
                      <div className="rate-item-label">Exclusivity Add-on</div>
                      <div className="rate-item-value">+${result.rate_card_usd.exclusivity_addon}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Outreach templates */}
              {result.cold_outreach_templates && (
                <div className="section-block">
                  <div className="section-eyebrow">Cold Outreach Templates</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { label: "Direct Brand", text: result.cold_outreach_templates.direct_brand },
                      { label: "Agency", text: result.cold_outreach_templates.agency },
                      { label: "Follow-Up", text: result.cold_outreach_templates.follow_up },
                    ].map(({ label, text }) => (
                      <div className="template-block" key={label}>
                        <div className="template-label">{label}</div>
                        <div className="template-text">{text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          <div className="footer-badge">Creator Revenue OS · Powered by AI</div>
        </div>
      </div>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  numeric,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  numeric?: boolean;
}) {
  return (
    <div className="field">
      <label>
        <span className="field-label">{label}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          inputMode={numeric ? "numeric" : "text"}
        />
      </label>
    </div>
  );
}
