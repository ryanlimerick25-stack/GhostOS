"use client";
import "./page.module.css";
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
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) { setError("Password must contain at least one special character."); return; }
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

  if (!isLoaded) return (
    <div style={{minHeight:'100vh',background:'#04040a',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{width:40,height:40,border:'2px solid rgba(167,139,250,0.2)',borderTop:'2px solid #a78bfa',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} />
    </div>
  );

  return (
    <>
      <ParticleCanvas />
      <nav className="auth-nav"><a href="/" className="auth-nav-logo"><div className="auth-nav-dot" />GhostOS</a><div className="auth-nav-links"><a href="/#features" className="auth-nav-link">Features</a><a href="/pricing" className="auth-nav-link">Pricing</a><a href="/sign-in" className="auth-nav-cta">Log in</a></div></nav>
      <div className="page">
        <div className="left-panel">
          <a href="/" className="left-logo"><div className="left-logo-dot" /><span className="left-logo-text">GhostOS</span></a>
          <h1 className="left-headline">Get paid what you're<br /><em>actually worth.</em></h1>
          <p className="left-sub">The brand deal intelligence tool built for TikTok creators who are serious about monetizing their audience.</p>
          <div className="left-features">
            {["Readiness score out of 100","Your real rate card","Cold outreach templates","14-day action plan","Media kit positioning"].map(f => (
              <div className="left-feature" key={f}><div className="left-feature-dot" /><span className="left-feature-text">{f}</span></div>
            ))}
          </div>
        </div>
        <div className="right-panel">
          <div className="auth-card">
            {step === "form" ? (
              <>
                <h1 className="auth-title">Create your account</h1>
                <p className="auth-sub">Start finding out what brands will pay you.</p>
                <div style={{marginBottom: '28px'}}>
                  <button className="social-btn" onClick={handleGoogle} style={{width:'100%'}}>
                    <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Continue with Google
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
      </div>
    </>
  );
}
