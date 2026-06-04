"use client";
export default function TermsPage() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #04040a; color: rgba(255,255,255,0.85); font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 clamp(20px,6vw,100px); height: 68px; background: rgba(4,4,10,0.95); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.06); }
        .nav-logo { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: rgba(255,255,255,0.9); display: flex; align-items: center; gap: 8px; text-decoration: none; }
        .nav-dot { width: 7px; height: 7px; border-radius: 50%; background: #a78bfa; box-shadow: 0 0 10px #a78bfa; flex-shrink: 0; }
        .nav-back { font-size: 13px; color: rgba(255,255,255,0.35); text-decoration: none; transition: color 0.2s; border: 1px solid rgba(255,255,255,0.08); padding: 6px 14px; border-radius: 99px; }
        .nav-back:hover { color: rgba(255,255,255,0.7); border-color: rgba(255,255,255,0.15); }
        .wrapper { display: flex; max-width: 1100px; margin: 0 auto; padding: 100px 24px 80px; gap: 60px; align-items: flex-start; position: relative; }
        .sidebar { width: 200px; flex-shrink: 0; position: sticky; top: 88px; align-self: flex-start; z-index: 1; }
        .sidebar-label { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.2); font-weight: 500; margin-bottom: 16px; }
        .sidebar-nav { display: flex; flex-direction: column; gap: 2px; }
        .sidebar-link { font-size: 13px; color: rgba(255,255,255,0.35); text-decoration: none; padding: 7px 12px; border-radius: 8px; transition: all 0.15s; border-left: 2px solid transparent; }
        .sidebar-link:hover { color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.03); border-left-color: rgba(167,139,250,0.4); }
        .content { flex: 1; min-width: 0; position: relative; z-index: 2; }
        .doc-header { margin-bottom: 48px; padding-bottom: 32px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .doc-badge { display: inline-flex; align-items: center; background: rgba(167,139,250,0.08); border: 1px solid rgba(167,139,250,0.15); border-radius: 99px; padding: 4px 12px; font-size: 11px; color: rgba(167,139,250,0.8); font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 20px; }
        h1 { font-family: 'Playfair Display', serif; font-size: clamp(36px,4vw,52px); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; color: #fff; margin-bottom: 16px; }
        .doc-meta { display: flex; gap: 24px; flex-wrap: wrap; }
        .doc-meta-item { font-size: 13px; color: rgba(255,255,255,0.25); }
        .doc-meta-item strong { color: rgba(255,255,255,0.45); font-weight: 500; }
        .intro-box { background: rgba(167,139,250,0.05); border: 1px solid rgba(167,139,250,0.1); border-radius: 16px; padding: 24px 28px; margin-bottom: 48px; }
        .intro-box p { font-size: 15px; color: rgba(255,255,255,0.55); line-height: 1.8; margin: 0; }
        .section { margin-bottom: 48px; scroll-margin-top: 100px; }
        .section-num { font-size: 11px; font-family: monospace; letter-spacing: 0.15em; color: rgba(167,139,250,0.5); font-weight: 500; margin-bottom: 8px; text-transform: uppercase; }
        h2 { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 600; color: #fff; margin-bottom: 20px; letter-spacing: -0.01em; }
        .clause { display: flex; gap: 16px; margin-bottom: 12px; padding: 16px 20px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; }
        .clause-num { font-family: monospace; font-size: 12px; color: rgba(167,139,250,0.5); flex-shrink: 0; min-width: 32px; padding-top: 2px; }
        .clause-text { font-size: 15px; font-weight: 300; color: rgba(255,255,255,0.6); line-height: 1.8; }
        .clause-text strong { color: rgba(255,255,255,0.8); font-weight: 500; }
        p { font-size: 15px; font-weight: 300; color: rgba(255,255,255,0.6); line-height: 1.8; margin-bottom: 16px; }
        .divider { height: 1px; background: rgba(255,255,255,0.05); margin: 40px 0; }
        .warning-box { background: rgba(248,113,113,0.04); border: 1px solid rgba(248,113,113,0.1); border-radius: 12px; padding: 16px 20px; margin-bottom: 16px; }
        .warning-box p { font-size: 13px; color: rgba(255,255,255,0.4); margin: 0; letter-spacing: 0.02em; }
        .contact-box { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 32px 36px; margin-top: 48px; }
        .contact-box p { margin-bottom: 8px; }
        .contact-box p:last-child { margin-bottom: 0; }
        a { color: #a78bfa; text-decoration: none; }
        a:hover { text-decoration: underline; }
        @media(max-width:768px){ .wrapper { flex-direction: column; padding-top: 90px; } .sidebar { display: none; } }
      `}</style>
      <nav>
        <a className="nav-logo" href="/"><div className="nav-dot" />GhostOS</a>
        <a className="nav-back" href="/">← Home</a>
      </nav>
      <div className="wrapper">
        <aside className="sidebar">
          <div className="sidebar-label">Contents</div>
          <nav className="sidebar-nav">
            <a className="sidebar-link" href="#overview">Overview</a>
            <a className="sidebar-link" href="#services">Our Services</a>
            <a className="sidebar-link" href="#account">Your Account</a>
            <a className="sidebar-link" href="#acceptable">Acceptable Use</a>
            <a className="sidebar-link" href="#subscriptions">Subscriptions</a>
            <a className="sidebar-link" href="#refunds">Refunds</a>
            <a className="sidebar-link" href="#ip">Intellectual Property</a>
            <a className="sidebar-link" href="#disclaimer">Disclaimers</a>
            <a className="sidebar-link" href="#liability">Limitation of Liability</a>
            <a className="sidebar-link" href="#indemnification">Indemnification</a>
            <a className="sidebar-link" href="#termination">Termination</a>
            <a className="sidebar-link" href="#disputes">Disputes</a>
            <a className="sidebar-link" href="#changes">Changes</a>
            <a className="sidebar-link" href="#contact">Contact</a>
          </nav>
        </aside>
        <div className="content">
          <div className="doc-header">
            <div className="doc-badge">Terms of Service</div>
            <h1>Terms of Service</h1>
            <div className="doc-meta">
              <div className="doc-meta-item"><strong>Effective:</strong> March 22, 2026</div>
              <div className="doc-meta-item"><strong>Last updated:</strong> March 22, 2026</div>
              <div className="doc-meta-item"><strong>Governing law:</strong> United States</div>
            </div>
          </div>
          <div className="intro-box">
            <p>These Terms of Service constitute a legally binding agreement between you and GhostOS, a sole proprietorship operating ghostos.live. By accessing or using GhostOS, you agree to be bound by these Terms. If you do not agree, do not use our services.</p>
          </div>
          <div className="section" id="overview">
            <div className="section-num">Section 1</div>
            <h2>Overview</h2>
            <div className="clause"><div className="clause-num">1.1</div><div className="clause-text">GhostOS provides AI-powered brand deal intelligence for TikTok creators, including readiness scores, rate cards, deal forecasts, outreach templates, action plans, and media kit positioning.</div></div>
            <div className="clause"><div className="clause-num">1.2</div><div className="clause-text">These Terms apply to all users of ghostos.live, including free users and paid subscribers.</div></div>
            <div className="clause"><div className="clause-num">1.3</div><div className="clause-text">You must be at least 13 years of age to use GhostOS.</div></div>
          </div>
          <div className="divider" />
          <div className="section" id="services">
            <div className="section-num">Section 2</div>
            <h2>Our Services</h2>
            <div className="clause"><div className="clause-num">2.1</div><div className="clause-text"><strong>Nature of outputs.</strong> All audit results, scores, rate cards, deal ranges, and recommendations are estimates based on AI analysis and market data. They are informational only and not guaranteed outcomes.</div></div>
            <div className="clause"><div className="clause-num">2.2</div><div className="clause-text"><strong>Not professional advice.</strong> GhostOS outputs do not constitute financial, legal, or business advice. Consult qualified professionals before making significant business decisions.</div></div>
            <div className="clause"><div className="clause-num">2.3</div><div className="clause-text"><strong>Service availability.</strong> We strive for high availability but do not guarantee uninterrupted access. We may modify or discontinue features with reasonable notice.</div></div>
            <div className="clause"><div className="clause-num">2.4</div><div className="clause-text"><strong>AI-generated content.</strong> Audit outputs are generated using OpenAI. Results may occasionally contain inaccuracies. Apply your own judgment.</div></div>
          </div>
          <div className="divider" />
          <div className="section" id="account">
            <div className="section-num">Section 3</div>
            <h2>Your Account</h2>
            <div className="clause"><div className="clause-num">3.1</div><div className="clause-text">You are responsible for maintaining the confidentiality of your account credentials and all activity under your account.</div></div>
            <div className="clause"><div className="clause-num">3.2</div><div className="clause-text">You must provide accurate information when creating your account and running audits.</div></div>
            <div className="clause"><div className="clause-num">3.3</div><div className="clause-text">You may not share your account or create multiple accounts to circumvent usage limits.</div></div>
            <div className="clause"><div className="clause-num">3.4</div><div className="clause-text">Notify us immediately of unauthorized account use at <a href="mailto:hello@ghostos.live">hello@ghostos.live</a>.</div></div>
          </div>
          <div className="divider" />
          <div className="section" id="acceptable">
            <div className="section-num">Section 4</div>
            <h2>Acceptable Use</h2>
            <div className="clause"><div className="clause-num">4.1</div><div className="clause-text">You may not use GhostOS for any unlawful purpose or in violation of any applicable laws.</div></div>
            <div className="clause"><div className="clause-num">4.2</div><div className="clause-text">You may not attempt to reverse engineer, scrape, or extract our underlying methodology or algorithms.</div></div>
            <div className="clause"><div className="clause-num">4.3</div><div className="clause-text">You may not resell, sublicense, or redistribute GhostOS outputs or platform without written consent.</div></div>
            <div className="clause"><div className="clause-num">4.4</div><div className="clause-text">You may not interfere with or gain unauthorized access to GhostOS systems or infrastructure.</div></div>
            <div className="clause"><div className="clause-num">4.5</div><div className="clause-text">Violation of acceptable use terms may result in immediate account termination.</div></div>
          </div>
          <div className="divider" />
          <div className="section" id="subscriptions">
            <div className="section-num">Section 5</div>
            <h2>Subscriptions & Billing</h2>
            <div className="clause"><div className="clause-num">5.1</div><div className="clause-text"><strong>Free plan.</strong> Up to 3 audits at no cost. Access to core audit features.</div></div>
            <div className="clause"><div className="clause-num">5.2</div><div className="clause-text"><strong>GhostOS Pro.</strong> $36.00 USD per month. Unlimited audits, full audit history, and all platform features.</div></div>
            <div className="clause"><div className="clause-num">5.3</div><div className="clause-text"><strong>Automatic renewal.</strong> Subscriptions renew monthly until cancelled. By subscribing, you authorize recurring charges to your payment method.</div></div>
            <div className="clause"><div className="clause-num">5.4</div><div className="clause-text"><strong>Cancellation.</strong> Cancel anytime from your dashboard. Cancellations take effect at end of the current billing period. Pro access continues until that date.</div></div>
            <div className="clause"><div className="clause-num">5.5</div><div className="clause-text"><strong>Price changes.</strong> We will provide 30 days notice before changing subscription prices.</div></div>
          </div>
          <div className="divider" />
          <div className="section" id="refunds">
            <div className="section-num">Section 6</div>
            <h2>Refund Policy</h2>
            <div className="clause"><div className="clause-num">6.1</div><div className="clause-text">We do not offer refunds for partial billing periods or unused subscription time.</div></div>
            <div className="clause"><div className="clause-num">6.2</div><div className="clause-text">If you believe you were charged in error, contact us within 14 days at <a href="mailto:hello@ghostos.live">hello@ghostos.live</a>.</div></div>
            <div className="clause"><div className="clause-num">6.3</div><div className="clause-text">We reserve the right to issue refunds at our discretion in exceptional circumstances.</div></div>
          </div>
          <div className="divider" />
          <div className="section" id="ip">
            <div className="section-num">Section 7</div>
            <h2>Intellectual Property</h2>
            <div className="clause"><div className="clause-num">7.1</div><div className="clause-text"><strong>GhostOS IP.</strong> The GhostOS platform, design, code, branding, and methodology are owned by GhostOS and protected by applicable intellectual property laws.</div></div>
            <div className="clause"><div className="clause-num">7.2</div><div className="clause-text"><strong>Your content.</strong> Your audit results and input data remain yours. You grant us a limited license to use this data solely to provide our services.</div></div>
            <div className="clause"><div className="clause-num">7.3</div><div className="clause-text"><strong>License to use.</strong> We grant you a limited, non-exclusive, non-transferable license to use GhostOS for personal, non-commercial use.</div></div>
            <div className="clause"><div className="clause-num">7.4</div><div className="clause-text">You may not reproduce, modify, or exploit any part of GhostOS without our prior written permission.</div></div>
          </div>
          <div className="divider" />
          <div className="section" id="disclaimer">
            <div className="section-num">Section 8</div>
            <h2>Disclaimers</h2>
            <div className="warning-box"><p>THE FOLLOWING DISCLAIMERS ARE IMPORTANT. PLEASE READ CAREFULLY.</p></div>
            <div className="clause"><div className="clause-num">8.1</div><div className="clause-text">GHOSTOS IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.</div></div>
            <div className="clause"><div className="clause-num">8.2</div><div className="clause-text">We do not warrant that our service will be uninterrupted or error-free.</div></div>
            <div className="clause"><div className="clause-num">8.3</div><div className="clause-text">Audit results are AI-generated estimates. We make no guarantees regarding their accuracy.</div></div>
          </div>
          <div className="divider" />
          <div className="section" id="liability">
            <div className="section-num">Section 9</div>
            <h2>Limitation of Liability</h2>
            <div className="clause"><div className="clause-num">9.1</div><div className="clause-text">TO THE MAXIMUM EXTENT PERMITTED BY LAW, GHOSTOS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS OR LOST DATA.</div></div>
            <div className="clause"><div className="clause-num">9.2</div><div className="clause-text">OUR TOTAL LIABILITY TO YOU SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM, OR $100, WHICHEVER IS GREATER.</div></div>
            <div className="clause"><div className="clause-num">9.3</div><div className="clause-text">Some jurisdictions do not allow limitation of liability. In such jurisdictions, our liability is limited to the maximum extent permitted by law.</div></div>
          </div>
          <div className="divider" />
          <div className="section" id="indemnification">
            <div className="section-num">Section 10</div>
            <h2>Indemnification</h2>
            <div className="clause"><div className="clause-num">10.1</div><div className="clause-text">You agree to indemnify and hold harmless GhostOS from any claims, damages, and expenses (including attorneys fees) arising from your use of GhostOS, your violation of these Terms, or your violation of any third-party rights.</div></div>
          </div>
          <div className="divider" />
          <div className="section" id="termination">
            <div className="section-num">Section 11</div>
            <h2>Termination</h2>
            <div className="clause"><div className="clause-num">11.1</div><div className="clause-text">You may terminate your account at any time by contacting us or using the account deletion feature in your dashboard.</div></div>
            <div className="clause"><div className="clause-num">11.2</div><div className="clause-text">We reserve the right to suspend or terminate your account for violation of these Terms, with or without notice.</div></div>
            <div className="clause"><div className="clause-num">11.3</div><div className="clause-text">Upon termination, your right to use GhostOS ceases immediately. Sections 7, 8, 9, and 10 survive termination.</div></div>
          </div>
          <div className="divider" />
          <div className="section" id="disputes">
            <div className="section-num">Section 12</div>
            <h2>Governing Law & Disputes</h2>
            <div className="clause"><div className="clause-num">12.1</div><div className="clause-text">These Terms are governed by the laws of the United States.</div></div>
            <div className="clause"><div className="clause-num">12.2</div><div className="clause-text">Before filing any formal legal claim, you agree to first contact us at <a href="mailto:hello@ghostos.live">hello@ghostos.live</a> to attempt informal resolution. We will respond within 30 days.</div></div>
            <div className="clause"><div className="clause-num">12.3</div><div className="clause-text">Disputes not resolved informally shall be resolved through binding arbitration under applicable rules.</div></div>
          </div>
          <div className="divider" />
          <div className="section" id="changes">
            <div className="section-num">Section 13</div>
            <h2>Changes to These Terms</h2>
            <div className="clause"><div className="clause-num">13.1</div><div className="clause-text">We may update these Terms at any time. We will notify you of material changes by email or notice on GhostOS at least 14 days before they take effect.</div></div>
            <div className="clause"><div className="clause-num">13.2</div><div className="clause-text">Continued use after the effective date constitutes acceptance of the updated Terms.</div></div>
            <div className="clause"><div className="clause-num">13.3</div><div className="clause-text">If you do not agree to updated Terms, stop using GhostOS and cancel your subscription before the effective date.</div></div>
          </div>
          <div className="contact-box" id="contact">
            <div className="section-num">Section 14</div>
            <h2>Contact</h2>
            <p>Questions about these Terms?</p>
            <p><strong style={{color:"rgba(255,255,255,0.7)"}}>Email:</strong> <a href="mailto:hello@ghostos.live">hello@ghostos.live</a></p>
            <p><strong style={{color:"rgba(255,255,255,0.7)"}}>Response time:</strong> We respond to legal inquiries within 5 business days.</p>
          </div>
        </div>
      </div>
    </>
  );
}
