"use client";
import { useSignUp } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const cv = canvas; const ctx = cv.getContext("2d"); if (!ctx) return;
    const c = ctx; let animId: number;
    type P = { x:number;y:number;vx:number;vy:number;size:number;opacity:number;target:number;color:string };
    const particles: P[] = [];
    const resize = () => { cv.width = window.innerWidth; cv.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const colors = ["255,255,255","255,245,210","255,225,150","255,200,80","210,235,255"];
    const spawn = (): P => ({ x: Math.random()*window.innerWidth, y: cv.height+30, vx:(Math.random()-0.5)*0.35, vy:-(Math.random()*0.55+0.12), size:Math.random()*20+3, opacity:0, target:Math.random()*0.45+0.06, color:colors[Math.floor(Math.random()*colors.length)] });
    for (let i=0;i<80;i++){const p=spawn();p.y=Math.random()*cv.height;p.opacity=Math.random()*0.35;particles.push(p);}
    function animate(){
      c.clearRect(0,0,cv.width,cv.height);
      particles.forEach((p,i)=>{
        if(p.opacity<p.target)p.opacity=Math.min(p.opacity+0.001,p.target);
        const g=c.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size);
        g.addColorStop(0,`rgba(${p.color},${p.opacity})`);g.addColorStop(0.3,`rgba(${p.color},${p.opacity*0.4})`);g.addColorStop(1,`rgba(${p.color},0)`);
        c.beginPath();c.arc(p.x,p.y,p.size,0,Math.PI*2);c.fillStyle=g;c.fill();
        p.x+=p.vx;p.y+=p.vy;
        if(p.y<-p.size*2||p.x<-80||p.x>cv.width+80)particles[i]=spawn();
      });
      animId=requestAnimationFrame(animate);
    }
    animate();
    return ()=>{cancelAnimationFrame(animId);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={canvasRef} style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}} />;
}

export default function SignUpPage() {
  const { signUp, isLoaded } = useSignUp();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"form"|"verify">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    if (!firstName.trim()) { setError("First name is required."); return; }
    if (!lastName.trim()) { setError("Last name is required."); return; }
    if (!email.trim()) { setError("Email is required."); return; }
    if (!password.trim()) { setError("Password is required."); return; }
    if (password.length < 10) { setError("Password must be at least 10 characters."); return; }
    if (!/[0-9]/.test(password)) { setError("Password must contain at least one number."); return; }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) { setError("Password must contain at least one special character (!@#$%^&* etc)."); return; }
    setLoading(true); setError("");
    try {
      await signUp.create({ firstName, lastName, emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setStep("verify");
    } catch (e: unknown) {
      const err = e as { errors?: { message: string }[] };
      setError(err.errors?.[0]?.message || "Something went wrong.");
    } finally { setLoading(false); }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true); setError("");
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") router.push("/dashboard");
    } catch (e: unknown) {
      const err = e as { errors?: { message: string }[] };
      setError(err.errors?.[0]?.message || "Invalid code.");
    } finally { setLoading(false); }
  }

  async function handleGoogle() {
    if (!isLoaded) return;
    await signUp.authenticateWithRedirect({ strategy: "oauth_google", redirectUrl: "/sso-callback", redirectUrlComplete: "/dashboard" });
  }

  async function handleApple() {
    if (!isLoaded) return;
    await signUp.authenticateWithRedirect({ strategy: "oauth_apple", redirectUrl: "/sso-callback", redirectUrlComplete: "/dashboard" });
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #04040a; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        .auth-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; position: relative; z-index: 1; }
        .auth-card { width: 100%; max-width: 420px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 28px; padding: 40px 36px; backdrop-filter: blur(24px); position: relative; overflow: hidden; }
        .auth-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background: linear-gradient(90deg,transparent,rgba(167,139,250,0.4),transparent); }
        .auth-logo { display: flex; align-items: center; gap: 8px; margin-bottom: 28px; }
        .auth-logo-dot { width: 7px; height: 7px; border-radius: 50%; background: #a78bfa; box-shadow: 0 0 10px #a78bfa; }
        .auth-logo-text { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 600; color: rgba(255,255,255,0.9); }
        .auth-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 600; color: rgba(255,255,255,0.93); margin-bottom: 6px; letter-spacing: -0.02em; }
        .auth-sub { font-size: 14px; font-weight: 300; color: rgba(255,255,255,0.35); margin-bottom: 28px; }
        .social-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 24px; }
        .social-btn { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 16px; border-radius: 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.8); font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .social-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.14); transform: translateY(-1px); }
        .divider { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .divider-text { font-size: 11px; color: rgba(255,255,255,0.2); letter-spacing: 0.08em; text-transform: uppercase; }
        .field-group { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field-label { font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.3); }
        .field-input { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px 14px; font-size: 14px; font-family: 'DM Sans', sans-serif; color: rgba(255,255,255,0.9); outline: none; transition: all 0.2s; width: 100%; }
        .field-input::placeholder { color: rgba(255,255,255,0.15); }
        .field-input:focus { border-color: rgba(167,139,250,0.45); background: rgba(167,139,250,0.05); box-shadow: 0 0 0 3px rgba(167,139,250,0.08); }
        .error-box { background: rgba(248,113,113,0.07); border: 1px solid rgba(248,113,113,0.2); border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #fca5a5; margin-bottom: 14px; }
        .submit-btn { width: 100%; padding: 14px; border-radius: 12px; background: linear-gradient(135deg,#a78bfa,#818cf8); color: #fff; font-size: 14px; font-weight: 600; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); margin-top: 4px; }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(167,139,250,0.35); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .auth-footer { text-align: center; margin-top: 20px; font-size: 13px; color: rgba(255,255,255,0.28); }
        .auth-footer a { color: #a78bfa; text-decoration: none; font-weight: 500; }
        .code-input { text-align: center; font-size: 24px; font-weight: 600; letter-spacing: 0.3em; }
      `}</style>
      <ParticleCanvas />
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-logo"><div className="auth-logo-dot" /><span className="auth-logo-text">GhostOS</span></div>
          {step === "form" ? (
            <>
              <h1 className="auth-title">Create your account</h1>
              <p className="auth-sub">Start finding out what brands will pay you.</p>
              <div className="social-row">
                <button className="social-btn" onClick={handleGoogle}>
                  <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                </button>
                <button className="social-btn" onClick={handleApple}>
                  <svg width="15" height="16" viewBox="0 0 814 1000" fill="rgba(255,255,255,0.85)"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 70.1 0 128.4 46.4 172.5 46.4 42.8 0 109.6-49 192.5-49 30.8 0 110.6 2.6 168.6 80.2zm-198.5-100.6c-17.9 23.4-47.2 41.3-76.1 41.3-3.9 0-7.7-.3-11.6-.9 0-27.5 12.3-55.5 30.2-74.7 19.3-21.4 51.4-37.6 78.1-38.5 1.3 4.5 1.9 9 1.9 13.5 0 26.5-11 54.4-22.5 59.3z"/></svg>
                  Apple
                </button>
              </div>
              <div className="divider"><div className="divider-line" /><span className="divider-text">or</span><div className="divider-line" /></div>
              <form onSubmit={handleSignUp}>
                <div className="field-group">
                  <div className="field-row">
                    <div className="field"><label className="field-label">First Name</label><input className="field-input" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John" required /></div>
                    <div className="field"><label className="field-label">Last Name</label><input className="field-input" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe" required /></div>
                  </div>
                  <div className="field"><label className="field-label">Email</label><input className="field-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
                  <div className="field"><label className="field-label">Password</label><input className="field-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 10 chars, 1 number, 1 special" required /></div>
                </div>
                {error && <div className="error-box">{error}</div>}
                <button className="submit-btn" type="submit" disabled={loading}>{loading ? "Creating account..." : "Create Account →"}</button>
              </form>
              <p className="auth-footer">Already have an account? <a href="/sign-in">Log in</a></p>
            </>
          ) : (
            <>
              <h1 className="auth-title">Check your email</h1>
              <p className="auth-sub">We sent a 6-digit code to {email}</p>
              <form onSubmit={handleVerify}>
                <div className="field-group">
                  <div className="field"><label className="field-label">Verification Code</label><input className="field-input code-input" value={code} onChange={e => setCode(e.target.value)} placeholder="000000" maxLength={6} required /></div>
                </div>
                {error && <div className="error-box">{error}</div>}
                <button className="submit-btn" type="submit" disabled={loading}>{loading ? "Verifying..." : "Verify & Continue →"}</button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
