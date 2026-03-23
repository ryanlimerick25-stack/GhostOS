"use client";
export default function PrivacyPage() {
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
        <h1>Privacy Policy</h1>
        <div className="updated">Last updated: March 22, 2026</div>
        <div className="divider" />
        <p>GhostOS ("we", "us", or "our") operates ghostos.live. This Privacy Policy explains how we collect, use, and protect your information when you use our service.</p>
        <h2>Information We Collect</h2>
        <p>We collect information you provide directly to us when you:</p>
        <ul>
          <li>Create an account (name, email address)</li>
          <li>Run an audit (TikTok handle, follower count, engagement rate, niche, average views)</li>
          <li>Subscribe to GhostOS Pro (payment processed by Stripe — we do not store card details)</li>
        </ul>
        <p>We also collect basic usage data such as pages visited and features used, to improve the product.</p>
        <h2>How We Use Your Information</h2>
        <ul>
          <li>To provide and improve our audit and brand deal intelligence features</li>
          <li>To manage your account and subscription</li>
          <li>To send transactional emails (audit results, billing updates)</li>
          <li>To communicate product updates (you can opt out at any time)</li>
        </ul>
        <h2>Data Storage</h2>
        <p>Your account data and audit history are stored securely using Supabase. Authentication is handled by Clerk. Payments are processed by Stripe. We do not sell your personal data to third parties.</p>
        <h2>Cookies</h2>
        <p>We use cookies to maintain your session and authenticate your account. We do not use advertising or tracking cookies.</p>
        <h2>Your Rights</h2>
        <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us. To delete your account and all associated data, email us at the address below.</p>
        <h2>Third-Party Services</h2>
        <p>GhostOS uses the following third-party services which have their own privacy policies: Clerk (authentication), Supabase (database), Stripe (payments), Resend (email), and OpenAI (AI-powered audit generation).</p>
        <h2>Children's Privacy</h2>
        <p>GhostOS is not directed at children under 13. We do not knowingly collect personal information from children under 13.</p>
        <h2>Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated date.</p>
        <div className="contact-box">
          <h2 style={{marginTop: 0}}>Contact Us</h2>
          <p>If you have questions about this Privacy Policy, contact us at <a href="mailto:ps4sprite25@gmail.com">ps4sprite25@gmail.com</a>.</p>
        </div>
      </div>
    </>
  );
}
