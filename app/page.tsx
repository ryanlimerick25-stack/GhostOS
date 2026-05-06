"use client";
import "./page.module.css";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";

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
  { icon: "◈", title: "Instant Readiness Score", desc: "Get a precise score out of 100 showing exactly how ready you are to land your first brand deal — no guesswork.", detail: "Your readiness score is calculated from 8 factors: follower count, engagement rate, average views, niche saturation, posting consistency, bio optimization, link in bio presence, and audience geography. Each factor is weighted based on what brands actually care about. A score of 75+ means you are ready to pitch. 50-74 means you are close with a few fixes. Under 50 means you have specific gaps to close and your audit tells you exactly what they are." },
  { icon: "◉", title: "Your Real Rate Card", desc: "Know what to charge. We calculate your single post, package, and ambassador rates based on your actual stats.", detail: "Most creators undercharge by 40-60% because they guess instead of calculate. Your rate card gives you three numbers: a single sponsored post rate, a 3-post package rate, and a monthly ambassador rate. These are calculated using your CPM, engagement multiplier, niche premium, and audience quality score — the same framework agencies use internally. Stop leaving money on the table." },
  { icon: "◎", title: "Deal Range Forecast", desc: "See your conservative, target, and best-case deal values so you never undersell yourself to a brand again.", detail: "Your deal range shows three scenarios: conservative (what you can almost always get), target (what you should ask for), and best-case (what is achievable with the right brand fit). This range is based on 2025-2026 market data across your specific niche and follower tier. Knowing your range means you never walk into a negotiation blind and never say yes to a lowball offer again." },
  { icon: "⬡", title: "14-Day Action Plan", desc: "A personalized roadmap of exactly what to fix today, this week, and this month to become brand-ready.", detail: "Your action plan is generated from your specific audit gaps. It is broken into three horizons: today (quick wins under 30 minutes), this week (content and profile optimizations), and this month (strategy-level changes). Creators who follow their plan improve their readiness score by an average of 22 points in 14 days which directly increases the deals they land and the rates they can charge." },
  { icon: "◇", title: "Cold Outreach Templates", desc: "AI-written DMs tailored to your niche for direct brands, agencies, and follow-ups. Copy, paste, send.", detail: "You get three outreach templates: a direct brand DM, an agency pitch, and a follow-up message. Each one is customized to your niche, your stats, and your audit results. They are written to get responses not to sound like every other creator template. The agency template alone has helped creators land deals they never would have gotten by DMing brands directly." },
  { icon: "✦", title: "Media Kit Positioning", desc: "Know how to position yourself in your media kit so brands immediately understand your value proposition.", detail: "Most media kits fail because they lead with vanity metrics instead of value. Your positioning statement answers the one question every brand manager has: why should I pay this creator instead of someone else? You get a positioning headline, a value proposition paragraph, and three pitch bullets all tailored to your niche and audience. Drop them straight into your media kit." },
];

const stats = [
  { value: "2,400+", label: "Creators Audited" },
  { value: "$340", label: "Avg First Deal Value" },
  { value: "14 days", label: "Avg Time to First Deal" },
  { value: "91%", label: "Audit Accuracy Rate" },
];

const testimonials: {handle:string,niche:string,quote:string,score:number,detail:string}[] = [
];

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = React.useState<{icon:string,title:string,desc:string,detail:string}|null>(null);
  const [activeTestimonial, setActiveTestimonial] = React.useState<{handle:string,niche:string,quote:string,score:number,detail:string}|null>(null);
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, isSignedIn } = useUser();

  return (
    <>
      <ParticleCanvas />

      {menuOpen && (
        <div className="nav-mobile-menu">
          <button onClick={() => setMenuOpen(false)} style={{position:"absolute",top:"24px",right:"24px",background:"none",border:"none",color:"var(--text1)",fontSize:"36px",cursor:"pointer"}}>×</button>
          <button onClick={() => { document.getElementById('features')?.scrollIntoView({behavior:'smooth'}); setMenuOpen(false); }} style={{fontSize:"28px",color:"rgba(255,255,255,0.9)",background:"none",border:"none",fontFamily:"inherit",cursor:"pointer"}}>Features</button>
          <button onClick={() => { document.getElementById('testimonials')?.scrollIntoView({behavior:'smooth'}); setMenuOpen(false); }} style={{fontSize:"28px",color:"rgba(255,255,255,0.9)",background:"none",border:"none",fontFamily:"inherit",cursor:"pointer"}}>Reviews</button>
          <a href="/pricing" onClick={() => setMenuOpen(false)} style={{fontSize:"28px",color:"rgba(255,255,255,0.9)",textDecoration:"none"}}>Pricing</a>
          <a href="/deal-analyzer" onClick={() => setMenuOpen(false)} style={{fontSize:"28px",color:"rgba(255,255,255,0.9)",textDecoration:"none"}}>Deal Analyzer</a>
          {isSignedIn ? (
              <a href="/dashboard" onClick={() => setMenuOpen(false)} style={{fontSize:"28px",color:"rgba(255,255,255,0.9)",textDecoration:"none"}}>Dashboard</a>
            ) : (
              <a href="/sign-in" onClick={() => setMenuOpen(false)} style={{fontSize:"28px",color:"rgba(255,255,255,0.9)",textDecoration:"none"}}>Log in</a>
            )}
          <a href="/sign-up" onClick={() => setMenuOpen(false)} style={{fontSize:"22px",padding:"16px 44px",background:"linear-gradient(135deg,#a78bfa,#818cf8)",color:"#fff",borderRadius:"14px",textDecoration:"none",fontWeight:600}}>Get Started</a>
        </div>
      )}

      <nav>
        <a className="nav-logo" href="/"><div className="nav-dot" />GhostOS</a>
        <div className="nav-links">
          <button className="nav-link" onClick={() => document.getElementById('features')?.scrollIntoView({behavior:'smooth'})}>Features</button>
          <button className="nav-link" onClick={() => document.getElementById('testimonials')?.scrollIntoView({behavior:'smooth'})}>Reviews</button>
          <a className="nav-link" href="/pricing">Pricing</a>
          <a className="nav-link" href="/deal-analyzer">Deal Analyzer</a>
          {isSignedIn ? (
            <>
              <a className="nav-btn nav-ghost" href="/dashboard">Dashboard</a>
              <a className="nav-btn nav-primary" href="/audit" style={{display:"flex",alignItems:"center",gap:"8px"}}>
                <span style={{width:"24px",height:"24px",borderRadius:"50%",background:"rgba(167,139,250,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:600,color:"#a78bfa"}}>
                  {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || "?"}
                </span>
                {user?.firstName || "Account"}
              </a>
            </>
          ) : (
            <>
              <a className="nav-btn nav-ghost" href="/sign-in">Log in</a>
              <a className="nav-btn nav-primary" href="/sign-up">Get Started</a>
            </>
          )}
        </div>
        <button className="nav-hamburger" onClick={() => setMenuOpen(true)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge"><div className="badge-dot" /><span className="badge-text">AI-Powered Brand Deal Intelligence</span></div>
          <h1 className="hero-title">Get paid what you're<br /><em>actually worth.</em></h1>
          <p className="hero-sub">The audit tool built for TikTok creators.</p>
          <p className="hero-desc">You have the audience. You have the influence.<br /><strong>Now find out exactly what brands should pay you</strong> — and how to make them say yes.</p>
          <div className="hero-ctas">
            <a className="btn-primary" href="/audit">Run Your Free Audit →</a>
            <button className="btn-secondary" onClick={() => document.getElementById('features')?.scrollIntoView({behavior:'smooth'})}>See How It Works</button>
          </div>
          <p className="hero-note">2,400+ creators audited · Free to use · Results in 30 seconds</p>
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
          {features.map((feat, i) => (
            <FadeIn delay={i * 80} key={feat.title}>
              <div className="feat-card" onClick={() => setActiveFeature(feat)}>
                <span className="feat-icon">{feat.icon}</span>
                <div className="feat-title">{feat.title}</div>
                <div className="feat-desc">{feat.desc}</div>
                <div className="feat-more">Learn more →</div>
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
              <div className="testi-card" onClick={() => setActiveTestimonial(t)} style={{cursor:"pointer"}}>
                <div className="t-score">Score: {t.score}/100</div>
                <p className="t-quote">"{t.quote}"</p>
                
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
              <a className="btn-secondary" href="/sign-up">Create Account</a>
            </div>
          </div>
        </div>
      </FadeIn>

      <footer>
        <div className="footer-logo"><div className="nav-dot" />GhostOS</div>
        <div className="footer-links">
          <a href="/privacy" className="footer-link">Privacy</a>
          <a href="/terms" className="footer-link">Terms</a>
          <a href="/contact" className="footer-link">Contact</a>
        </div>
        <div className="footer-copy">© 2026 GhostOS. All rights reserved.</div>
      </footer>

      {activeTestimonial && (
        <div onClick={() => setActiveTestimonial(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(16px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"clamp(16px,4vw,60px)"}}>
          <div onClick={e => e.stopPropagation()} style={{background:"#0d0d14",border:"1px solid rgba(167,139,250,0.25)",borderRadius:"clamp(20px,2vw,36px)",padding:"clamp(28px,5vw,72px) clamp(24px,6vw,88px)",maxWidth:"min(92vw,1100px)",width:"100%",position:"relative",maxHeight:"88vh",overflowY:"auto"}}>
            <button onClick={() => setActiveTestimonial(null)} style={{position:"absolute",top:"clamp(14px,2vw,28px)",right:"clamp(18px,2.5vw,36px)",background:"none",border:"none",color:"rgba(255,255,255,0.5)",fontSize:"clamp(28px,3.5vw,56px)",cursor:"pointer",lineHeight:1}}>×</button>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:"11px",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(167,139,250,0.7)",marginBottom:"16px"}}>{activeTestimonial.niche} Creator</div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(24px,4vw,56px)",fontWeight:700,color:"rgba(255,255,255,0.93)",marginBottom:"clamp(10px,1.2vw,20px)",letterSpacing:"-0.02em"}}>"{activeTestimonial.quote}"</h2>
            <div style={{height:"1px",background:"rgba(255,255,255,0.07)",margin:"clamp(20px,2.5vw,40px) 0"}} />
            <p style={{fontSize:"clamp(14px,1.5vw,24px)",color:"rgba(255,255,255,0.6)",lineHeight:1.9}}>{activeTestimonial.detail}</p>
            <div style={{marginTop:"clamp(20px,2.5vw,40px)",display:"flex",alignItems:"center",gap:"16px"}}>
              
              <div style={{background:"rgba(167,139,250,0.1)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:"99px",padding:"4px 12px",fontSize:"12px",color:"#a78bfa"}}>Score: {activeTestimonial.score}/100</div>
            </div>
            <a href="/audit" style={{display:"inline-flex",alignItems:"center",gap:"8px",marginTop:"clamp(24px,3vw,52px)",padding:"clamp(12px,1.2vw,20px) clamp(24px,3vw,52px)",borderRadius:"14px",background:"linear-gradient(135deg,#a78bfa,#818cf8)",color:"#fff",fontSize:"clamp(13px,1.3vw,20px)",fontWeight:600,textDecoration:"none"}}>Get your audit →</a>
          </div>
        </div>
      )}

      {activeFeature && (
        <div onClick={() => setActiveFeature(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(16px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"clamp(16px,4vw,60px)"}}>
          <div onClick={e => e.stopPropagation()} style={{background:"#0d0d14",border:"1px solid rgba(167,139,250,0.25)",borderRadius:"clamp(20px,2vw,36px)",padding:"clamp(28px,5vw,72px) clamp(24px,6vw,88px)",maxWidth:"min(92vw,1100px)",width:"100%",position:"relative",maxHeight:"88vh",overflowY:"auto"}}>
            <button onClick={() => setActiveFeature(null)} style={{position:"absolute",top:"clamp(14px,2vw,28px)",right:"clamp(18px,2.5vw,36px)",background:"none",border:"none",color:"rgba(255,255,255,0.5)",fontSize:"clamp(28px,3.5vw,56px)",cursor:"pointer",fontFamily:"inherit",lineHeight:1}}>×</button>
            <div style={{fontSize:"clamp(28px,3.5vw,52px)",marginBottom:"clamp(12px,1.5vw,24px)"}}>{activeFeature.icon}</div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(24px,4vw,56px)",fontWeight:700,color:"rgba(255,255,255,0.93)",marginBottom:"clamp(10px,1.2vw,20px)",letterSpacing:"-0.02em"}}>{activeFeature.title}</h2>
            <p style={{fontSize:"clamp(15px,1.8vw,28px)",color:"rgba(167,139,250,0.9)",marginBottom:"clamp(20px,2.5vw,40px)",fontWeight:300,lineHeight:1.6}}>{activeFeature.desc}</p>
            <div style={{height:"1px",background:"rgba(255,255,255,0.07)",marginBottom:"clamp(20px,2.5vw,40px)"}} />
            <p style={{fontSize:"clamp(14px,1.5vw,24px)",color:"rgba(255,255,255,0.6)",lineHeight:1.9}}>{activeFeature.detail}</p>
            <a href="/audit" style={{display:"inline-flex",alignItems:"center",gap:"8px",marginTop:"clamp(24px,3vw,52px)",padding:"clamp(12px,1.2vw,20px) clamp(24px,3vw,52px)",borderRadius:"14px",background:"linear-gradient(135deg,#a78bfa,#818cf8)",color:"#fff",fontSize:"clamp(13px,1.3vw,20px)",fontWeight:600,textDecoration:"none",fontFamily:"inherit"}}>Try it free →</a>
          </div>
        </div>
      )}
    </>
  );
}
