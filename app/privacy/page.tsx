"use client";
export default function PrivacyPage() {
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
        .wrapper { display: flex; max-width: 1100px; margin: 0 auto; padding: 100px 24px 80px; gap: 60px; }
        .sidebar { width: 220px; flex-shrink: 0; position: sticky; top: 100px; height: fit-content; }
        .sidebar-label { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.2); font-weight: 500; margin-bottom: 16px; }
        .sidebar-nav { display: flex; flex-direction: column; gap: 2px; }
        .sidebar-link { font-size: 13px; color: rgba(255,255,255,0.35); text-decoration: none; padding: 7px 12px; border-radius: 8px; transition: all 0.15s; border-left: 2px solid transparent; }
        .sidebar-link:hover { color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.03); border-left-color: rgba(167,139,250,0.4); }
        .content { flex: 1; min-width: 0; }
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
        .table-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: rgba(255,255,255,0.05); border-radius: 12px; overflow: hidden; margin-bottom: 16px; }
        .table-cell { background: rgba(255,255,255,0.02); padding: 12px 16px; font-size: 14px; color: rgba(255,255,255,0.55); }
        .table-cell.header { background: rgba(255,255,255,0.04); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.3); font-weight: 500; }
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
            <a className="sidebar-link" href="#collection">Information We Collect</a>
            <a className="sidebar-link" href="#use">How We Use Data</a>
            <a className="sidebar-link" href="#storage">Data Storage</a>
            <a className="sidebar-link" href="#sharing">Data Sharing</a>
            <a className="sidebar-link" href="#cookies">Cookies</a>
            <a className="sidebar-link" href="#rights">Your Rights</a>
            <a className="sidebar-link" href="#retention">Data Retention</a>
            <a className="sidebar-link" href="#security">Security</a>
            <a className="sidebar-link" href="#children">Children</a>
            <a className="sidebar-link" href="#changes">Changes</a>
            <a className="sidebar-link" href="#contact">Contact</a>
          </nav>
        </aside>
        <div className="content">
          <div className="doc-header">
            <div className="doc-badge">Privacy Policy</div>
            <h1>How We Handle Your Data</h1>
            <div className="doc-meta">
              <div className="doc-meta-item"><strong>Effective:</strong> March 22, 2026</div>
              <div className="doc-meta-item"><strong>Last updated:</strong> March 22, 2026</div>
              <div className="doc-meta-item"><strong>Jurisdiction:</strong> United States</div>
            </div>
          </div>
          <div className="intro-box">
            <p>This Privacy Policy describes how GhostOS ("we," "us," or "our") collects, uses, and protects information about you when you use ghostos.live. We believe in transparency — this document tells you exactly what we collect and why. Questions? Email <a href="mailto:ps4sprite25@gmail.com">ps4sprite25@gmail.com</a>.</p>
          </div>
          <div className="section" id="overview">
            <div className="section-num">Section 1</div>
            <h2>Overview</h2>
            <div className="clause"><div className="clause-num">1.1</div><div className="clause-text">GhostOS is a brand deal intelligence platform for TikTok creators. To provide our services, we collect certain information from you.</div></div>
            <div className="clause"><div className="clause-num">1.2</div><div className="clause-text">We are operated as a sole proprietorship in the United States. We are the data controller for the personal information we collect.</div></div>
            <div className="clause"><div className="clause-num">1.3</div><div className="clause-text">By using GhostOS, you agree to the collection and use of information as described in this policy.</div></div>
          </div>
          <div className="divider" />
          <div className="section" id="collection">
            <div className="section-num">Section 2</div>
            <h2>Information We Collect</h2>
            <div className="clause"><div className="clause-num">2.1</div><div className="clause-text"><strong>Account information.</strong> When you create an account, we collect your name and email address via Clerk, our authentication provider.</div></div>
            <div className="clause"><div className="clause-num">2.2</div><div className="clause-text"><strong>Audit data.</strong> When you run an audit, we collect your TikTok handle, follower count, average views, engagement rate, niche, and any other information you enter.</div></div>
            <div className="clause"><div className="clause-num">2.3</div><div className="clause-text"><strong>Payment information.</strong> Payments are processed by Stripe. We do not store your credit card number or CVV — only your Stripe customer ID and subscription status.</div></div>
            <div className="clause"><div className="clause-num">2.4</div><div className="clause-text"><strong>Usage data.</strong> We collect basic usage information such as pages visited and features used to improve our service.</div></div>
            <div className="clause"><div className="clause-num">2.5</div><div className="clause-text"><strong>Communications.</strong> If you contact us by email, we retain that correspondence to help resolve your inquiry.</div></div>
          </div>
          <div className="divider" />
          <div className="section" id="use">
            <div className="section-num">Section 3</div>
            <h2>How We Use Your Information</h2>
            <div className="clause"><div className="clause-num">3.1</div><div className="clause-text"><strong>Service delivery.</strong> To generate your audit results, readiness score, rate card, and all other outputs.</div></div>
            <div className="clause"><div className="clause-num">3.2</div><div className="clause-text"><strong>Account management.</strong> To create and maintain your account, manage your subscription, and process payments.</div></div>
            <div className="clause"><div className="clause-num">3.3</div><div className="clause-text"><strong>Communications.</strong> To send transactional emails such as audit results and billing receipts. We may also send product updates — you may opt out at any time.</div></div>
            <div className="clause"><div className="clause-num">3.4</div><div className="clause-text"><strong>Product improvement.</strong> To understand how our platform is used and improve its features.</div></div>
            <div className="clause"><div className="clause-num">3.5</div><div className="clause-text"><strong>Legal compliance.</strong> To comply with applicable laws and respond to lawful requests.</div></div>
          </div>
          <div className="divider" />
          <div className="section" id="storage">
            <div className="section-num">Section 4</div>
            <h2>Data Storage & Infrastructure</h2>
            <div className="table-grid">
              <div className="table-cell header">Service</div>
              <div className="table-cell header">Purpose</div>
              <div className="table-cell">Supabase</div><div className="table-cell">Database — stores your account and audit data</div>
              <div className="table-cell">Clerk</div><div className="table-cell">Authentication — manages your login and session</div>
              <div className="table-cell">Stripe</div><div className="table-cell">Payments — processes subscriptions securely</div>
              <div className="table-cell">Resend</div><div className="table-cell">Email — sends transactional and product emails</div>
              <div className="table-cell">OpenAI</div><div className="table-cell">AI — generates audit analysis and recommendations</div>
              <div className="table-cell">Vercel</div><div className="table-cell">Hosting — serves the GhostOS web application</div>
            </div>
            <div className="clause"><div className="clause-num">4.1</div><div className="clause-text">Each service listed above has its own privacy policy. We encourage you to review them.</div></div>
            <div className="clause"><div className="clause-num">4.2</div><div className="clause-text">Data is stored on servers in the United States.</div></div>
          </div>
          <div className="divider" />
          <div className="section" id="sharing">
            <div className="section-num">Section 5</div>
            <h2>Data Sharing & Disclosure</h2>
            <div className="clause"><div className="clause-num">5.1</div><div className="clause-text"><strong>We do not sell your personal data.</strong> We will never sell, rent, or trade your personal information to third parties for marketing purposes.</div></div>
            <div className="clause"><div className="clause-num">5.2</div><div className="clause-text"><strong>Service providers.</strong> We share data only with the services in Section 4 that are necessary to operate GhostOS.</div></div>
            <div className="clause"><div className="clause-num">5.3</div><div className="clause-text"><strong>Legal requirements.</strong> We may disclose your information if required by law, court order, or governmental authority.</div></div>
            <div className="clause"><div className="clause-num">5.4</div><div className="clause-text"><strong>Business transfers.</strong> If GhostOS is acquired, your data may be transferred. We will notify you before your data is subject to a different privacy policy.</div></div>
          </div>
          <div className="divider" />
          <div className="section" id="cookies">
            <div className="section-num">Section 6</div>
            <h2>Cookies & Tracking</h2>
            <div className="clause"><div className="clause-num">6.1</div><div className="clause-text"><strong>Session cookies.</strong> We use cookies to authenticate your session and keep you logged in. These are necessary for the service to function.</div></div>
            <div className="clause"><div className="clause-num">6.2</div><div className="clause-text"><strong>No advertising cookies.</strong> We do not use advertising, tracking, or third-party analytics cookies.</div></div>
            <div className="clause"><div className="clause-num">6.3</div><div className="clause-text">You may disable cookies in your browser, but doing so may prevent you from logging in.</div></div>
          </div>
          <div className="divider" />
          <div className="section" id="rights">
            <div className="section-num">Section 7</div>
            <h2>Your Rights</h2>
            <div className="clause"><div className="clause-num">7.1</div><div className="clause-text"><strong>Access.</strong> You may request a copy of the personal data we hold about you.</div></div>
            <div className="clause"><div className="clause-num">7.2</div><div className="clause-text"><strong>Correction.</strong> You may request correction of inaccurate or incomplete personal data.</div></div>
            <div className="clause"><div className="clause-num">7.3</div><div className="clause-text"><strong>Deletion.</strong> You may request deletion of your account and data at any time. We process deletion requests within 30 days.</div></div>
            <div className="clause"><div className="clause-num">7.4</div><div className="clause-text"><strong>Portability.</strong> You may request an export of your audit data in a machine-readable format.</div></div>
            <div className="clause"><div className="clause-num">7.5</div><div className="clause-text"><strong>Opt-out.</strong> You may opt out of non-transactional emails at any time by clicking unsubscribe or contacting us.</div></div>
            <div className="clause"><div className="clause-num">7.6</div><div className="clause-text">To exercise any of these rights, contact <a href="mailto:ps4sprite25@gmail.com">ps4sprite25@gmail.com</a>. We respond within 30 days.</div></div>
          </div>
          <div className="divider" />
          <div className="section" id="retention">
            <div className="section-num">Section 8</div>
            <h2>Data Retention</h2>
            <div className="clause"><div className="clause-num">8.1</div><div className="clause-text">We retain your account and audit data for as long as your account is active or as needed to provide services.</div></div>
            <div className="clause"><div className="clause-num">8.2</div><div className="clause-text">If you delete your account, we will delete your personal data within 30 days, except where required by law to retain it.</div></div>
            <div className="clause"><div className="clause-num">8.3</div><div className="clause-text">Billing records may be retained for up to 7 years for tax compliance purposes.</div></div>
          </div>
          <div className="divider" />
          <div className="section" id="security">
            <div className="section-num">Section 9</div>
            <h2>Security</h2>
            <div className="clause"><div className="clause-num">9.1</div><div className="clause-text">We implement industry-standard security including encrypted data transmission (HTTPS), secure authentication via Clerk, and access controls on our database.</div></div>
            <div className="clause"><div className="clause-num">9.2</div><div className="clause-text">No method of internet transmission is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.</div></div>
            <div className="clause"><div className="clause-num">9.3</div><div className="clause-text">If we become aware of a data breach affecting your personal information, we will notify you within 72 hours by email.</div></div>
          </div>
          <div className="divider" />
          <div className="section" id="children">
            <div className="section-num">Section 10</div>
            <h2>Children&apos;s Privacy</h2>
            <div className="clause"><div className="clause-num">10.1</div><div className="clause-text">GhostOS is not directed at individuals under 13. We do not knowingly collect personal information from children under 13.</div></div>
            <div className="clause"><div className="clause-num">10.2</div><div className="clause-text">If we learn we have collected data from a child under 13, we will delete it immediately.</div></div>
          </div>
          <div className="divider" />
          <div className="section" id="changes">
            <div className="section-num">Section 11</div>
            <h2>Changes to This Policy</h2>
            <div className="clause"><div className="clause-num">11.1</div><div className="clause-text">We may update this policy from time to time. We will update the effective date at the top of this page when we do.</div></div>
            <div className="clause"><div className="clause-num">11.2</div><div className="clause-text">For significant changes, we will notify you by email or by displaying a prominent notice on GhostOS.</div></div>
            <div className="clause"><div className="clause-num">11.3</div><div className="clause-text">Continued use of GhostOS after changes are posted constitutes acceptance of the revised policy.</div></div>
          </div>
          <div className="contact-box" id="contact">
            <div className="section-num">Section 12</div>
            <h2>Contact & Data Requests</h2>
            <p>For privacy questions, data access requests, or account deletion:</p>
            <p><strong style={{color:"rgba(255,255,255,0.7)"}}>Email:</strong> <a href="mailto:ps4sprite25@gmail.com">ps4sprite25@gmail.com</a></p>
            <p><strong style={{color:"rgba(255,255,255,0.7)"}}>Response time:</strong> We respond to all privacy requests within 30 days.</p>
          </div>
        </div>
      </div>
    </>
  );
}
