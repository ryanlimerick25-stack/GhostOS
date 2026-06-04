"use client";
export default function ContactPage() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #04040a; color: rgba(255,255,255,0.85); font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 clamp(20px,6vw,100px); height: 68px; background: rgba(4,4,10,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .nav-logo { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: rgba(255,255,255,0.9); display: flex; align-items: center; gap: 8px; text-decoration: none; }
        .nav-dot { width: 7px; height: 7px; border-radius: 50%; background: #a78bfa; box-shadow: 0 0 10px #a78bfa; flex-shrink: 0; }
        .nav-back { font-size: 14px; color: rgba(255,255,255,0.35); text-decoration: none; transition: color 0.2s; }
        .nav-back:hover { color: rgba(255,255,255,0.7); }
        .page { max-width: 760px; margin: 0 auto; padding: 120px 24px 80px; min-height: 100vh; }
        .eyebrow { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #a78bfa; font-weight: 500; margin-bottom: 16px; }
        h1 { font-family: 'Playfair Display', serif; font-size: clamp(32px,5vw,56px); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; color: #fff; margin-bottom: 16px; }
        .sub { font-size: 18px; font-weight: 300; color: rgba(255,255,255,0.4); line-height: 1.7; margin-bottom: 56px; max-width: 520px; }
        .divider { height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 48px; }
        .cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 48px; }
        @media(max-width:600px){ .cards { grid-template-columns: 1fr; } }
        .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 28px 32px; position: relative; overflow: hidden; }
        .card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background: linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent); }
        .card-label { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.25); font-weight: 500; margin-bottom: 12px; }
        .card-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 600; color: rgba(255,255,255,0.9); margin-bottom: 8px; }
        .card-desc { font-size: 14px; font-weight: 300; color: rgba(255,255,255,0.4); line-height: 1.65; margin-bottom: 16px; }
        .card-link { font-size: 14px; font-weight: 500; color: #a78bfa; text-decoration: none; }
        .card-link:hover { text-decoration: underline; }
        .response-note { background: rgba(167,139,250,0.06); border: 1px solid rgba(167,139,250,0.12); border-radius: 14px; padding: 20px 24px; }
        .response-note p { font-size: 14px; color: rgba(255,255,255,0.4); line-height: 1.7; margin: 0; }
        .response-note strong { color: rgba(255,255,255,0.65); font-weight: 500; }
      `}</style>
      <nav>
        <a className="nav-logo" href="/"><div className="nav-dot" />GhostOS</a>
        <a className="nav-back" href="/">← Back to home</a>
      </nav>
      <div className="page">
        <div className="eyebrow">Get in touch</div>
        <h1>Contact</h1>
        <p className="sub">Have a question, issue, or just want to say hi? We read every message.</p>
        <div className="divider" />
        <div className="cards">
          <div className="card">
            <div className="card-label">General</div>
            <div className="card-title">Say hello</div>
            <div className="card-desc">Questions about GhostOS, feedback, or anything else.</div>
            <a className="card-link" href="mailto:hello@ghostos.live">hello@ghostos.live →</a>
          </div>
          <div className="card">
            <div className="card-label">Billing & Account</div>
            <div className="card-title">Subscription help</div>
            <div className="card-desc">Issues with your Pro subscription, billing, or account access.</div>
            <a className="card-link" href="mailto:hello@ghostos.live">hello@ghostos.live →</a>
          </div>
          <div className="card">
            <div className="card-label">Privacy & Data</div>
            <div className="card-title">Data requests</div>
            <div className="card-desc">Request access to, correction of, or deletion of your data.</div>
            <a className="card-link" href="mailto:hello@ghostos.live">hello@ghostos.live →</a>
          </div>
          <div className="card">
            <div className="card-label">Partnerships</div>
            <div className="card-title">Work with us</div>
            <div className="card-desc">Agency partnerships, creator collabs, or press inquiries.</div>
            <a className="card-link" href="mailto:hello@ghostos.live">hello@ghostos.live →</a>
          </div>
        </div>
        <div className="response-note">
          <p><strong>Response time:</strong> We typically reply within 24–48 hours. For billing issues we aim to respond same day.</p>
        </div>
      </div>
    </>
  );
}
