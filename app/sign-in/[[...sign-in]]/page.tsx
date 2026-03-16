"use client";
import { useSignIn } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { signIn, isLoaded, setActive } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    if (!email.trim()) { setError("Email is required."); return; }
    if (!password.trim()) { setError("Password is required."); return; }
    setLoading(true); setError("");
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      }
    } catch (e: unknown) {
      const err = e as { errors?: { message: string }[] };
      setError(err.errors?.[0]?.message || "Invalid email or password.");
    } finally { setLoading(false); }
  }

  async function handleGoogle() {
    if (!isLoaded) return;
    await signIn.authenticateWithRedirect({ strategy: "oauth_google", redirectUrl: "/sso-callback", redirectUrlComplete: "/dashboard" });
  }

  async function handleApple() {
    if (!isLoaded) return;
    await signIn.authenticateWithRedirect({ strategy: "oauth_apple", redirectUrl: "/sso-callback", redirectUrlComplete: "/dashboard" });
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;1,500;1,600&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #1a1208;
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
          position: relative;
          overflow: hidden;
        }
        .page::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse at 15% 45%, rgba(210,140,60,0.13) 0%, transparent 55%),
            radial-gradient(ellipse at 75% 15%, rgba(180,100,40,0.07) 0%, transparent 50%),
            radial-gradient(ellipse at 40% 85%, rgba(140,80,30,0.06) 0%, transparent 45%);
          pointer-events: none;
          z-index: 0;
        }
        @media(max-width: 768px) {
          .page { grid-template-columns: 1fr; }
          .left-panel { display: none !important; }
        }
        .left-panel {
          display: flex;
          flex-direction: column;
          justify-content: center; gap: 48px;
          padding: 48px 44px;
          min-height: 100vh;
          border-right: 1px solid rgba(212,146,74,0.1);
          position: relative;
          z-index: 1;
        }
        .left-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Lora', serif;
          font-size: 19px;
          font-weight: 600;
          color: rgba(255,235,190,0.9);
        }
        .left-logo-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #d4924a;
          box-shadow: 0 0 10px rgba(212,146,74,0.5);
        }
        .left-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 24px 0;
        }
        .left-eyebrow {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(212,146,74,0.6);
          font-weight: 500;
          margin-bottom: 16px;
        }
        .left-headline {
          font-family: 'Lora', serif;
          font-size: clamp(38px,4vw,52px);
          font-weight: 500;
          line-height: 1.15;
          letter-spacing: -0.01em;
          color: rgba(255,240,200,0.95);
          margin-bottom: 18px;
        }
        .left-headline em { font-style: italic; color: #e8a855; }
        .left-sub {
          font-size: 15px;
          font-weight: 300;
          color: rgba(255,230,170,0.35);
          line-height: 1.85;
          max-width: 300px;
        }
        .left-quote-wrap {
          border-left: 2px solid rgba(212,146,74,0.18);
          padding-left: 16px;
        }
        .left-quote {
          font-family: 'Lora', serif;
          font-style: italic;
          font-size: 13px;
          color: rgba(255,230,170,0.32);
          line-height: 1.75;
          margin-bottom: 6px;
        }
        .left-quote-by { font-size: 11px; color: rgba(255,220,150,0.18); }
        .right-panel {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 48px 44px;
          min-height: 100vh;
          position: relative;
          z-index: 1;
        }
        .auth-card { width: 100%; max-width: 440px; }
        .auth-eyebrow {
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(212,146,74,0.5);
          font-weight: 500;
          margin-bottom: 22px;
        }
        .auth-title {
          font-family: 'Lora', serif;
          font-size: 28px;
          font-weight: 500;
          color: rgba(255,240,200,0.95);
          margin-bottom: 4px;
          letter-spacing: -0.01em;
        }
        .auth-sub {
          font-size: 13px;
          font-weight: 300;
          color: rgba(255,230,170,0.28);
          margin-bottom: 28px;
        }
        .social-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px; }
        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px;
          border-radius: 10px;
          background: rgba(255,220,150,0.04);
          border: 1px solid rgba(255,220,150,0.09);
          font-size: 13px;
          font-weight: 400;
          color: rgba(255,230,170,0.55);
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .social-btn:hover {
          background: rgba(255,220,150,0.07);
          border-color: rgba(255,220,150,0.15);
          color: rgba(255,230,170,0.85);
        }
        .divider { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
        .divider-line { flex: 1; height: 1px; background: rgba(255,220,150,0.06); }
        .divider-text {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,220,150,0.18);
        }
        .field { margin-bottom: 14px; }
        .field-label {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,220,150,0.28);
          font-weight: 500;
          margin-bottom: 7px;
          display: block;
        }
        .field-input {
          width: 100%;
          padding: 12px 14px;
          background: rgba(255,220,150,0.03);
          border: 1px solid rgba(255,220,150,0.08);
          border-radius: 10px;
          font-size: 14px;
          color: rgba(255,240,200,0.85);
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.2s;
        }
        .field-input:focus {
          border-color: rgba(212,146,74,0.4);
          background: rgba(212,146,74,0.05);
        }
        .field-input::placeholder { color: rgba(255,220,150,0.16); }
        .forgot-link { text-align: right; margin-bottom: 20px; }
        .forgot-link a { font-size: 12px; color: rgba(212,146,74,0.45); text-decoration: none; }
        .error-box {
          background: rgba(248,113,113,0.07);
          border: 1px solid rgba(248,113,113,0.2);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 13px;
          color: #fca5a5;
          margin-bottom: 16px;
        }
        .submit-btn {
          width: 100%;
          padding: 13px;
          border-radius: 11px;
          background: linear-gradient(135deg, #c97e30, #e8a855);
          border: none;
          color: #1a1208;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          letter-spacing: 0.01em;
          margin-bottom: 16px;
          transition: all 0.2s;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(200,120,40,0.28);
        }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .auth-footer {
          text-align: center;
          font-size: 12px;
          color: rgba(255,220,150,0.2);
        }
        .auth-footer a { color: rgba(212,146,74,0.55); text-decoration: none; }
      `}</style>

      <div className="page">
        <div className="left-panel">
          <div className="left-logo"><div className="left-logo-dot" />GhostOS</div>
          <div className="left-body">
            <div className="left-eyebrow">Good to have you back</div>
            <h1 className="left-headline">Your deals<br />are <em>waiting.</em></h1>
            <p className="left-sub">Every creator who knows their worth earns more. Log back in and keep building.</p>
          </div>
          <div className="left-quote-wrap">
            <p className="left-quote">"I had no idea I was underselling myself by 60%. GhostOS told me exactly what to charge."</p>
            <div className="left-quote-by">@maya.creates · Beauty · Score 84/100</div>
          </div>
        </div>

        <div className="right-panel">
          <div className="auth-card">
            <div className="auth-eyebrow">Sign in to your account</div>
            <h1 className="auth-title">Welcome back.</h1>
            <p className="auth-sub">Pick up right where you left off.</p>
            <div className="social-row">
              <button className="social-btn" onClick={handleGoogle}>
                <svg width="15" height="15" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </button>
              <button className="social-btn" onClick={handleApple}>
                <svg width="13" height="15" viewBox="0 0 814 1000" fill="rgba(255,230,170,0.7)"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 70.1 0 128.4 46.4 172.5 46.4 42.8 0 109.6-49 192.5-49 30.8 0 110.6 2.6 168.6 80.2zm-198.5-100.6c-17.9 23.4-47.2 41.3-76.1 41.3-3.9 0-7.7-.3-11.6-.9 0-27.5 12.3-55.5 30.2-74.7 19.3-21.4 51.4-37.6 78.1-38.5 1.3 4.5 1.9 9 1.9 13.5 0 26.5-11 54.4-22.5 59.3z"/></svg>
                Apple
              </button>
            </div>
            <div className="divider"><div className="divider-line" /><span className="divider-text">or</span><div className="divider-line" /></div>
            <form onSubmit={handleSignIn}>
              <div className="field">
                <label className="field-label">Email</label>
                <input className="field-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div className="field">
                <label className="field-label">Password</label>
                <input className="field-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" required />
              </div>
              <div className="forgot-link"><a href="/forgot-password">Forgot password?</a></div>
              {error && <div className="error-box">{error}</div>}
              <button className="submit-btn" type="submit" disabled={loading}>{loading ? "Signing in..." : "Log In →"}</button>
            </form>
            <p className="auth-footer">Don't have an account? <a href="/sign-up">Sign up free</a></p>
          </div>
        </div>
      </div>
    </>
  );
}
