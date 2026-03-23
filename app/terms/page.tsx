"use client";
export default function TermsPage() {
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
        h1 { font-family: 'Playfair Display', serif; font-size: clamp(32px,5vw,56px); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; color: #fff; margin-bottom: 12px; }
        .updated { font-size: 13px; color: rgba(255,255,255,0.25); margin-bottom: 56px; }
        .divider { height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 48px; }
        h2 { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 600; color: #fff; margin-bottom: 14px; margin-top: 44px; }
        p { font-size: 16px; font-weight: 300; color: rgba(255,255,255,0.6); line-height: 1.85; margin-bottom: 16px; }
        ul { padding-left: 20px; margin-bottom: 16px; }
        li { font-size: 16px; font-weight: 300; color: rgba(255,255,255,0.6); line-height: 1.85; margin-bottom: 8px; }
        a { color: #a78bfa; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .contact-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 28px 32px; margin-top: 48px; }
        .contact-box p { margin-bottom: 0; }
      `}</style>
      <nav>
        <a className="nav-logo" href="/"><div className="nav-dot" />GhostOS</a>
        <a className="nav-back" href="/">← Back to home</a>
      </nav>
      <div className="page">
        <div className="eyebrow">Legal</div>
        <h1>Terms of Service</h1>
        <div className="updated">Last updated: March 22, 2026</div>
        <div className="divider" />
        <p>These Terms of Service govern your use of GhostOS, operated as a sole proprietorship at ghostos.live. By using GhostOS, you agree to these terms.</p>
        <h2>What GhostOS Provides</h2>
        <p>GhostOS is an AI-powered brand deal intelligence platform for TikTok creators. We provide readiness scores, rate card estimates, deal range forecasts, action plans, outreach templates, and media kit positioning based on information you provide.</p>
        <p>Our outputs are estimates and recommendations based on market data and AI analysis. They are not financial advice, legal advice, or guarantees of any specific outcome. Actual brand deal values vary based on many factors outside our control.</p>
        <h2>Your Account</h2>
        <ul>
          <li>You must be 13 or older to use GhostOS</li>
          <li>You are responsible for maintaining the security of your account</li>
          <li>You must provide accurate information when running audits</li>
          <li>You may not use GhostOS for any unlawful purpose</li>
        </ul>
        <h2>Free Plan and Subscriptions</h2>
        <p>GhostOS offers a free plan with up to 3 audits. GhostOS Pro is available for $36/month and includes unlimited audits and full audit history.</p>
        <p>Subscriptions are billed monthly and renew automatically. You may cancel at any time from your dashboard. Cancellations take effect at the end of the current billing period. We do not offer refunds for partial billing periods.</p>
        <h2>Intellectual Property</h2>
        <p>The GhostOS platform, including its design, code, and content, is owned by GhostOS. Your audit results are yours to use. You may not resell, redistribute, or replicate GhostOS's platform or methodology without permission.</p>
        <h2>Limitation of Liability</h2>
        <p>GhostOS is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability to you shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
        <h2>Termination</h2>
        <p>We reserve the right to suspend or terminate your account if you violate these terms. You may delete your account at any time by contacting us.</p>
        <h2>Changes to These Terms</h2>
        <p>We may update these Terms from time to time. Continued use of GhostOS after changes constitutes acceptance of the updated terms.</p>
        <h2>Governing Law</h2>
        <p>These Terms are governed by the laws of the United States. Any disputes shall be resolved in the applicable courts of the United States.</p>
        <div className="contact-box">
          <h2 style={{marginTop: 0}}>Contact Us</h2>
          <p>Questions about these Terms? Contact us at <a href="mailto:ps4sprite25@gmail.com">ps4sprite25@gmail.com</a>.</p>
        </div>
      </div>
    </>
  );
}
