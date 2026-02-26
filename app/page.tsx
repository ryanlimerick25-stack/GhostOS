"use client";
import { useEffect, useRef, useState } from "react";

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
    const colors = ["255,255,255","255,245,210","255,225,150","255,200,80","210,235,255","180,200,255"];
    const spawn = (): P => ({ x: Math.random()*window.innerWidth, y: cv.height+30, vx:(Math.random()-0.5)*0.35, vy:-(Math.random()*0.55+0.12), size:Math.random()*24+3, opacity:0, target:Math.random()*0.55+0.08, color:colors[Math.floor(Math.random()*colors.length)] });
    for (let i=0;i<110;i++){const p=spawn();p.y=Math.random()*cv.height;p.opacity=Math.random()*0.45;particles.push(p);}
    function animate(){
      c.clearRect(0,0,cv.width,cv.height);
      particles.forEach((p,i)=>{
        if(p.opacity<p.target)p.opacity=Math.min(p.opacity+0.0015,p.target);
        const g=c.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size);
        g.addColorStop(0,`rgba(${p.color},${p.opacity})`);g.addColorStop(0.3,`rgba(${p.color},${p.opacity*0.4})`);g.addColorStop(1,`rgba(${p.color},0)`);
        c.beginPath();c.arc(p.x,p.y,p.size,0,Math.PI*2);c.fillStyle=g;c.fill();
        if(p.size>7){c.beginPath();c.arc(p.x,p.y,p.size*0.06,0,Math.PI*2);c.fillStyle=`rgba(${p.color},${Math.min(p.opacity*4,1)})`;c.fill();}
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

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.08 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: vis?1:0, transform: vis?"translateY(0)":"translateY(28px)", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

const features = [
  { icon: "◈", title: "Instant Readiness Score", desc: "Get a precise score out of 100 showing exactly how ready you are to land your first brand deal — no guesswork." },
  { icon: "◉", title: "Your Real Rate Card", desc: "Know what to charge. We calculate your single post, package, and ambassador rates based on your actual stats." },
  { icon: "◎", title: "Deal Range Forecast", desc: "See your conservative, target, and best-case deal values so you never undersell yourself to a brand again." },
  { icon: "⬡", title: "14-Day Action Plan", desc: "A personalized roadmap of exactly what to fix today, this week, and this month to become brand-ready." },
  { icon: "◇", title: "Cold Outreach Templates", desc: "AI-written DMs tailored to your niche for direct brands, agencies, and follow-ups. Copy, paste, send." },
  { icon: "✦", title: "Media Kit Positioning", desc: "Know how to position yourself in your media kit so brands immediately understand your value proposition." },
];

const stats = [
  { value: "2,400+", label: "Creators Audited" },
  { value: "$340", label: "Avg First Deal Value" },
  { value: "14 days", label: "Avg Time to First Deal" },
  { value: "91%", label: "Audit Accuracy Rate" },
];

const testimonials = [
  { handle: "@maya.creates", niche: "Beauty", quote: "I had no idea I was underselling myself by 60%. GhostOS told me exactly what to charge and I landed a $800 deal the next week.", score: 84 },
  { handle: "@streetbykarim", niche: "Streetwear", quote: "The outreach templates were insane. Copied the agency DM almost word for word and got a response within 48 hours.", score: 71 },
  { handle: "@fitwithjess", niche: "Fitness", quote: "The 14-day action plan was so specific. Fixed my bio, added a link in bio, and my readiness score jumped 22 points.", score: 78 },
];

export default function LandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');
        :root {
          --bg: #04040a; --glass: rgba(255,255,255,0.032); --glass-b: rgba(255,255,255,0.07);
          --accent: #a78bfa; --accent2: #818cf8; --gold: #f5c842;
          --text1: rgba(255,255,255,0.93); --text2: rgba(255,255,255,0.55); --text3: rgba(255,255,255,0.28);
          --r-lg: 24px; --r-md: 16px; --r-sm: 10px;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: var(--bg); color: var(--text1); font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; height: 64px; background: rgba(4,4,10,0.75); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .nav-logo { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: var(--text1); letter-spacing: -0.02em; display: flex; align-items: center; gap: 8px; text-decoration: none; }
        .nav-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 10px var(--accent); animation: pulse 2s ease infinite; flex-shrink: 0; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        .nav-links { display: flex; align-items: center; gap: 6px; }
        .nav-link { padding: 8px 16px; border-radius: 99px; font-size: 13px; font-weight: 400; color: var(--text2); cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; transition: color 0.2s; }
        .nav-link:hover { color: var(--text1); }
        .nav-btn { padding: 9px 20px; border-radius: 99px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; text-decoration: none; font-family: 'DM Sans', sans-serif; display: inline-block; }
        .nav-ghost { background: var(--glass); border: 1px solid var(--glass-b); color: var(--text1); }
        .nav-ghost:hover { background: rgba(255,255,255,0.07); }
        .nav-primary { background: linear-gradient(135deg,var(--accent),var(--accent2)); border: none; color: #fff; margin-left: 4px; }
        .nav-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(167,139,250,0.3); }
        .hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: 100px 24px 80px; position: relative; z-index: 1; }
        .hero-inner { max-width: 780px; animation: heroIn 1s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes heroIn { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: var(--glass); border: 1px solid var(--glass-b); border-radius: 99px; padding: 6px 18px 6px 12px; margin-bottom: 32px; backdrop-filter: blur(12px); }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); box-shadow: 0 0 8px var(--gold); }
        .badge-text { font-size: 12px; font-weight: 500; letter-spacing: 0.08em; color: var(--text2); }
        .hero-title { font-family: 'Playfair Display', serif; font-size: clamp(44px,8vw,80px); font-weight: 700; line-height: 1.0; letter-spacing: -0.03em; color: var(--text1); margin-bottom: 12px; }
        .hero-title em { font-style: italic; color: var(--accent); }
        .hero-sub { font-family: 'Playfair Display', serif; font-size: clamp(18px,3vw,26px); font-weight: 400; font-style: italic; color: var(--text2); margin-bottom: 20px; }
        .hero-desc { font-size: 16px; font-weight: 300; color: var(--text3); line-height: 1.7; max-width: 520px; margin: 0 auto 44px; }
        .hero-desc strong { color: var(--text2); font-weight: 400; }
        .hero-ctas { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .btn-primary { padding: 15px 32px; border-radius: 14px; background: linear-gradient(135deg,var(--accent),var(--accent2)); color: #fff; font-size: 15px; font-weight: 600; border: none; cursor: pointer; text-decoration: none; transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); display: inline-flex; align-items: center; gap: 8px; font-family: 'DM Sans', sans-serif; }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(167,139,250,0.35); }
        .btn-secondary { padding: 15px 32px; border-radius: 14px; background: var(--glass); border: 1px solid var(--glass-b); color: var(--text1); font-size: 15px; font-weight: 500; cursor: pointer; text-decoration: none; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px; backdrop-filter: blur(12px); font-family: 'DM Sans', sans-serif; }
        .btn-secondary:hover { background: rgba(255,255,255,0.07); transform: translateY(-1px); }
        .hero-note { margin-top: 20px; font-size: 12px; color: var(--text3); }
        .stats-wrap { position: relative; z-index: 1; max-width: 860px; margin: 0 auto 100px; padding: 0 24px; }
        .stats-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; border: 1px solid rgba(255,255,255,0.06); border-radius: var(--r-lg); overflow: hidden; background: rgba(255,255,255,0.06); }
        @media(max-width:640px){.stats-row{grid-template-columns:repeat(2,1fr)}}
        .stat-tile { background: var(--bg); padding: 28px 24px; text-align: center; }
        .stat-value { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700; letter-spacing: -0.02em; color: var(--text1); margin-bottom: 4px; }
        .stat-label { font-size: 12px; font-weight: 400; color: var(--text3); letter-spacing: 0.04em; }
        .section { position: relative; z-index: 1; padding: 100px 24px; max-width: 900px; margin: 0 auto; }
        .section-label { font-size: 11px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); margin-bottom: 16px; display: block; }
        .section-title { font-family: 'Playfair Display', serif; font-size: clamp(32px,5vw,52px); font-weight: 600; line-height: 1.1; letter-spacing: -0.02em; color: var(--text1); margin-bottom: 16px; }
        .section-title em { font-style: italic; color: var(--text2); }
        .section-desc { font-size: 16px; font-weight: 300; color: var(--text3); line-height: 1.7; max-width: 500px; }
        .features-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-top: 56px; }
        @media(max-width:700px){.features-grid{grid-template-columns:1fr}}
        @media(min-width:701px) and (max-width:900px){.features-grid{grid-template-columns:repeat(2,1fr)}}
        .feat-card { background: var(--glass); border: 1px solid var(--glass-b); border-radius: var(--r-lg); padding: 28px 24px; transition: all 0.3s; cursor: default; position: relative; overflow: hidden; }
        .feat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background: linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent); }
        .feat-card:hover { background: rgba(255,255,255,0.05); transform: translateY(-4px); border-color: rgba(167,139,250,0.2); }
        .feat-icon { font-size: 20px; color: var(--accent); margin-bottom: 16px; display: block; }
        .feat-title { font-size: 15px; font-weight: 500; color: var(--text1); margin-bottom: 8px; }
        .feat-desc { font-size: 13px; font-weight: 300; color: var(--text2); line-height: 1.65; }
        .testi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-top: 56px; }
        @media(max-width:700px){.testi-grid{grid-template-columns:1fr}}
        .testi-card { background: var(--glass); border: 1px solid var(--glass-b); border-radius: var(--r-lg); padding: 28px 24px; position: relative; overflow: hidden; transition: transform 0.3s; }
        .testi-card:hover { transform: translateY(-4px); }
        .testi-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background: linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent); }
        .t-score { display: inline-flex; align-items: center; gap: 6px; background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.2); border-radius: 99px; padding: 3px 12px; margin-bottom: 16px; font-size: 11px; font-weight: 500; color: var(--accent); }
        .t-quote { font-family: 'Playfair Display', serif; font-size: 15px; font-style: italic; font-weight: 400; color: var(--text1); line-height: 1.6; margin-bottom: 20px; }
        .t-handle { font-size: 12px; font-weight: 500; color: var(--text3); }
        .t-niche { font-size: 11px; color: var(--text3); margin-top: 2px; }
        .cta-wrap { position: relative; z-index: 1; max-width: 700px; margin: 0 auto 120px; padding: 0 24px; text-align: center; }
        .cta-card { background: var(--glass); border: 1px solid var(--glass-b); border-radius: 32px; padding: 64px 48px; position: relative; overflow: hidden; backdrop-filter: blur(24px); }
        .cta-card::before { content:''; position:absolute; inset:0; background: linear-gradient(135deg,rgba(167,139,250,0.06) 0%,transparent 60%); pointer-events:none; }
        .cta-card::after { content:''; position:absolute; top:0; left:0; right:0; height:1px; background: linear-gradient(90deg,transparent,rgba(167,139,250,0.4),transparent); }
        .cta-title { font-family: 'Playfair Display', serif; font-size: clamp(28px,5vw,44px); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; color: var(--text1); margin-bottom: 12px; }
        .cta-desc { font-size: 15px; font-weight: 300; color: var(--text2); line-height: 1.6; margin-bottom: 36px; }
        .cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        footer { position: relative; z-index: 1; border-top: 1px solid rgba(255,255,255,0.05); padding: 32px 40px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
        .footer-logo { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: var(--text2); display: flex; align-items: center; gap: 7px; }
        .footer-links { display: flex; gap: 24px; }
        .footer-link { font-size: 12px; color: var(--text3); text-decoration: none; cursor: pointer; }
        .footer-link:hover { color: var(--text2); }
        .footer-copy { font-size: 12px; color: var(--text3); }
        .divider { border: none; border-top: 1px solid rgba(255,255,255,0.04); margin: 0; }
      `}</style>

      <ParticleCanvas />

      <nav>
        <a className="nav-logo" href="/"><div className="nav-dot" />GhostOS</a>
        <div className="nav-links">
          <button className="nav-link" onClick={() => document.getElementById('features')?.scrollIntoView({behavior:'smooth'})}>Features</button>
          <button className="nav-link" onClick={() => document.getElementById('testimonials')?.scrollIntoView({behavior:'smooth'})}>Reviews</button>
          <a className="nav-btn nav-ghost" href="/audit">Log in</a>
          <a className="nav-btn nav-primary" href="/audit">Get Started</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge"><div className="badge-dot" /><span className="badge-text">AI-Powered Brand Deal Intelligence</span></div>
          <h1 className="hero-title">Know your worth.<br /><em>Before they lowball you.</em></h1>
          <p className="hero-sub">The audit tool built for TikTok creators.</p>
          <p className="hero-desc">You have the audience. You have the influence.<br /><strong>Now find out exactly what brands should pay you</strong> — and how to make them say yes.</p>
          <div className="hero-ctas">
            <a className="btn-primary" href="/audit">Run Your Free Audit →</a>
            <button className="btn-secondary" onClick={() => document.getElementById('features')?.scrollIntoView({behavior:'smooth'})}>See How It Works</button>
          </div>
          <p className="hero-note">Free to use · No credit card required · Results in 30 seconds</p>
        </div>
      </section>

      <FadeIn>
        <div className="stats-wrap">
          <div className="stats-row">
            {stats.map((s) => (
              <div className="stat-tile" key={s.label}>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      <section className="section" id="features">
        <FadeIn>
          <span className="section-label">What You Get</span>
          <h2 className="section-title">Everything you need to<br /><em>land your first deal.</em></h2>
          <p className="section-desc">One audit. Six tools. A complete picture of your brand deal potential and a clear path to get there.</p>
        </FadeIn>
        <div className="features-grid">
          {features.map((f, i) => (
            <FadeIn delay={i * 80} key={f.title}>
              <div className="feat-card">
                <span className="feat-icon">{f.icon}</span>
                <div className="feat-title">{f.title}</div>
                <div className="feat-desc">{f.desc}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <hr className="divider" />

      <section className="section" id="testimonials">
        <FadeIn>
          <span className="section-label">Creator Stories</span>
          <h2 className="section-title">Creators who stopped<br /><em>leaving money on the table.</em></h2>
        </FadeIn>
        <div className="testi-grid">
          {testimonials.map((t, i) => (
            <FadeIn delay={i * 100} key={t.handle}>
              <div className="testi-card">
                <div className="t-score">Score: {t.score}/100</div>
                <p className="t-quote">"{t.quote}"</p>
                <div className="t-handle">{t.handle}</div>
                <div className="t-niche">{t.niche} creator</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <hr className="divider" />

      <FadeIn>
        <div className="cta-wrap">
          <div className="cta-card">
            <h2 className="cta-title">Ready to find out<br />what you're worth?</h2>
            <p className="cta-desc">Run your free audit in 30 seconds. No signup required to get started.</p>
            <div className="cta-btns">
              <a className="btn-primary" href="/audit">Run Free Audit →</a>
              <a className="btn-secondary" href="/audit">Create Account</a>
            </div>
          </div>
        </div>
      </FadeIn>

      <footer>
        <div className="footer-logo"><div className="nav-dot" />GhostOS</div>
        <div className="footer-links">
          <span className="footer-link">Privacy</span>
          <span className="footer-link">Terms</span>
          <span className="footer-link">Contact</span>
        </div>
        <div className="footer-copy">© 2026 GhostOS. All rights reserved.</div>
      </footer>
    </>
  );
}
