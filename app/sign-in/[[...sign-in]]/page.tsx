"use client";
import "./page.module.css";
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
      const msg = err.errors?.[0]?.message || "Invalid email or password.";
      if (msg.toLowerCase().includes("session") || msg.toLowerCase().includes("already")) {
        router.push("/dashboard");
        return;
      }
      setError(msg);
    } finally { setLoading(false); }
  }

  async function handleGoogle() {
    if (!isLoaded) return;
    await signIn.authenticateWithRedirect({ strategy: "oauth_google", redirectUrl: "/sso-callback", redirectUrlComplete: "/dashboard" });
  }

  if (!isLoaded) return (
    <div style={{minHeight:'100vh',background:'#04040a',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{width:40,height:40,border:'2px solid rgba(167,139,250,0.2)',borderTop:'2px solid #a78bfa',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} />
    </div>
  );

  return (
    <>

      <nav className="auth-nav"><a href="/" className="auth-nav-logo"><div className="auth-nav-dot" />GhostOS</a><div className="auth-nav-links"><a href="/#features" className="auth-nav-link">Features</a><a href="/pricing" className="auth-nav-link">Pricing</a><a href="/sign-up" className="auth-nav-cta">Sign up free</a></div></nav>
      <div className="page">
        <div className="left-panel">
          <a href="/" className="left-logo"><div className="left-logo-dot" />GhostOS</a>
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
            <div style={{marginBottom: '20px'}}>
              <button className="social-btn" onClick={handleGoogle} style={{width:'100%'}}>
                <svg width="15" height="15" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
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
