"use client";
import React from "react";
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

const testimonials = [
  { handle: "@maya.creates", niche: "Beauty", quote: "I had no idea I was underselling myself by 60%. GhostOS told me exactly what to charge and I landed a $800 deal the next week.", score: 84, detail: "Maya came in with 42k followers in the beauty niche and was charging $150 per post. Her audit revealed her engagement rate of 8.2% and US-majority audience qualified her for a $400-600 rate. She updated her rate card, used the direct brand DM template to pitch a skincare brand, and closed an $800 deal 9 days later. Her readiness score went from 61 to 84 after fixing her bio and adding a media kit link." },
  { handle: "@streetbykarim", niche: "Streetwear", quote: "The outreach templates were insane. Copied the agency DM almost word for word and got a response within 48 hours.", score: 71, detail: "Karim had 67k followers in streetwear and had never landed a brand deal despite DMing brands himself. His audit flagged his engagement rate of 4.1% as average and identified agency outreach as his highest-leverage move. He used the agency template with minor edits, got a response in 48 hours, and closed a $600 deal with a sneaker brand. He has since landed two more deals using the same template." },
  { handle: "@fitwithjess", niche: "Fitness", quote: "The 14-day action plan was so specific. Fixed my bio, added a link in bio, and my readiness score jumped 22 points.", score: 78, detail: "Jess had 31k followers in fitness with a strong 9.4% engagement rate but a readiness score of 56. Her gaps were all profile-level: no link in bio, vague niche description, and no media kit. She followed the 14-day plan, fixed all three in the first week, and her score jumped to 78. She landed her first deal — a $450 protein brand partnership — two weeks later." },
];

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = React.useState<{icon:string,title:string,desc:string,detail:string}|null>(null);
  const [activeTestimonial, setActiveTestimonial] = React.useState<{handle:string,niche:string,quote:string,score:number,detail:string}|null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <style>{`
        :root {
          --bg: #04040a; --glass: rgba(255,255,255,0.055); --glass-b: rgba(255,255,255,0.10);
          --accent: #a78bfa; --accent2: #818cf8; --gold: #f5c842;
          --text1: rgba(255,255,255,0.93); --text2: rgba(255,255,255,0.55); --text3: rgba(255,255,255,0.28);
          --r-lg: 24px; --pad: clamp(20px,6vw,100px);
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: var(--bg); color: var(--text1); font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 var(--pad); height: clamp(60px,8vw,110px); background: rgba(4,4,10,0.85); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .nav-logo { font-family: 'Playfair Display', serif; font-size: clamp(18px,2.5vw,32px); font-weight: 700; color: var(--text1); letter-spacing: -0.02em; display: flex; align-items: center; gap: 8px; text-decoration: none; }
        .nav-dot { width: clamp(6px,0.8vw,10px); height: clamp(6px,0.8vw,10px); border-radius: 50%; background: var(--accent); box-shadow: 0 0 10px var(--accent); animation: pulse 2s ease infinite; flex-shrink: 0; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        .nav-links { display: flex; align-items: center; gap: 4px; }
        .nav-link { padding: clamp(8px,0.8vw,14px) clamp(12px,1.5vw,28px); border-radius: 99px; font-size: clamp(13px,1.3vw,20px); font-weight: 400; color: var(--text2); cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; transition: color 0.2s; text-decoration: none; display: inline-block; }
        .nav-link:hover { color: var(--text1); }
        .nav-btn { padding: clamp(8px,0.8vw,14px) clamp(16px,1.8vw,32px); border-radius: 99px; font-size: clamp(13px,1.3vw,20px); font-weight: 500; cursor: pointer; transition: all 0.2s; text-decoration: none; font-family: 'DM Sans', sans-serif; display: inline-block; }
        .nav-ghost { background: var(--glass); border: 1px solid var(--glass-b); color: var(--text1); }
        .nav-ghost:hover { background: rgba(255,255,255,0.07); }
        .nav-primary { background: linear-gradient(135deg,var(--accent),var(--accent2)); border: none; color: #fff; margin-left: 4px; }
        .nav-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(167,139,250,0.3); }
        .nav-hamburger { display: none; background: none; border: none; cursor: pointer; padding: 8px; flex-direction: column; gap: 5px; }
        .nav-hamburger span { display: block; width: 26px; height: 2px; background: var(--text1); border-radius: 2px; }
        .nav-mobile-menu { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(4,4,10,0.97); z-index: 200; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 28px; }
        .hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: clamp(100px,12vw,160px) clamp(20px,6vw,80px) clamp(60px,8vw,100px); position: relative; z-index: 1; }
        .hero-inner { max-width: min(95vw,1100px); animation: heroIn 1s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes heroIn { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: var(--glass); border: 1px solid var(--glass-b); border-radius: 99px; padding: clamp(4px,0.5vw,8px) clamp(12px,1.5vw,20px) clamp(4px,0.5vw,8px) clamp(8px,1vw,14px); margin-bottom: clamp(20px,3vw,36px); }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); box-shadow: 0 0 8px var(--gold); flex-shrink: 0; }
        .badge-text { font-size: clamp(11px,1.1vw,15px); font-weight: 500; letter-spacing: 0.08em; color: var(--text2); }
        .hero-title { font-family: 'Playfair Display', serif; font-size: clamp(42px,9vw,140px); font-weight: 700; line-height: 1.0; letter-spacing: -0.03em; color: var(--text1); margin-bottom: clamp(8px,1vw,16px); }
        .hero-title em { font-style: italic; color: var(--accent); }
        .hero-sub { font-family: 'Playfair Display', serif; font-size: clamp(16px,2.5vw,40px); font-weight: 400; font-style: italic; color: var(--text2); margin-bottom: clamp(12px,1.5vw,22px); }
        .hero-desc { font-size: clamp(14px,1.5vw,22px); font-weight: 300; color: var(--text3); line-height: 1.7; max-width: min(90vw,780px); margin: 0 auto clamp(28px,4vw,48px); }
        .hero-desc strong { color: var(--text2); font-weight: 400; }
        .hero-ctas { display: flex; gap: clamp(8px,1vw,14px); justify-content: center; flex-wrap: wrap; }
        .btn-primary { padding: clamp(12px,1.2vw,20px) clamp(20px,2.5vw,44px); border-radius: 14px; background: linear-gradient(135deg,var(--accent),var(--accent2)); color: #fff; font-size: clamp(13px,1.2vw,18px); font-weight: 600; border: none; cursor: pointer; text-decoration: none; transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); display: inline-flex; align-items: center; gap: 8px; font-family: 'DM Sans', sans-serif; }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(167,139,250,0.35); }
        .btn-secondary { padding: clamp(12px,1.2vw,20px) clamp(20px,2.5vw,44px); border-radius: 14px; background: var(--glass); border: 1px solid var(--glass-b); color: var(--text1); font-size: clamp(13px,1.2vw,18px); font-weight: 500; cursor: pointer; text-decoration: none; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px; font-family: 'DM Sans', sans-serif; }
        .btn-secondary:hover { background: rgba(255,255,255,0.07); transform: translateY(-1px); }
        .hero-note { margin-top: clamp(12px,1.5vw,22px); font-size: clamp(11px,1.1vw,15px); color: var(--text3); }
        .stats-wrap { position: relative; z-index: 1; margin: 0 0 clamp(60px,8vw,100px); }
        .stats-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 0; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.06); }
        .stat-tile { background: var(--bg); padding: clamp(24px,4vw,56px) clamp(16px,3vw,40px); text-align: center; }
        .stat-value { font-family: 'Playfair Display', serif; font-size: clamp(28px,5vw,64px); font-weight: 700; letter-spacing: -0.02em; color: var(--text1); margin-bottom: 4px; }
        .stat-label { font-size: clamp(11px,1.1vw,16px); font-weight: 400; color: var(--text3); }
        .section { position: relative; z-index: 1; padding: clamp(60px,8vw,120px) var(--pad); }
        .section-label { font-size: clamp(10px,1vw,13px); font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); margin-bottom: clamp(10px,1.2vw,18px); display: block; }
        .section-title { font-family: 'Playfair Display', serif; font-size: clamp(28px,5.5vw,88px); font-weight: 600; line-height: 1.1; letter-spacing: -0.02em; color: var(--text1); margin-bottom: clamp(10px,1.2vw,18px); }
        .section-title em { font-style: italic; color: var(--text2); }
        .section-desc { font-size: clamp(14px,1.4vw,22px); font-weight: 300; color: var(--text3); line-height: 1.7; max-width: min(90vw,800px); }
        .features-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: clamp(10px,1.5vw,20px); margin-top: clamp(32px,4vw,64px); }
        .feat-card { background: var(--glass); border: 1px solid var(--glass-b); border-radius: var(--r-lg); padding: clamp(20px,2.5vw,36px) clamp(18px,2.2vw,32px); transition: all 0.3s; cursor: pointer; position: relative; overflow: hidden; height: 100%; }
        .feat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background: linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent); }
        .feat-card:hover { background: rgba(255,255,255,0.08); transform: translateY(-4px); border-color: rgba(167,139,250,0.2); }
        .feat-icon { font-size: clamp(18px,2vw,28px); color: var(--accent); margin-bottom: clamp(10px,1.2vw,16px); display: block; }
        .feat-title { font-size: clamp(15px,1.5vw,22px); font-weight: 500; color: var(--text1); margin-bottom: clamp(6px,0.8vw,10px); }
        .feat-desc { font-size: clamp(13px,1.2vw,17px); line-height: 1.65; font-weight: 300; color: var(--text2); }
        .feat-more { margin-top: clamp(10px,1.2vw,16px); font-size: clamp(11px,1vw,14px); color: rgba(167,139,250,0.6); font-weight: 500; }
        .testi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: clamp(10px,1.5vw,20px); margin-top: clamp(32px,4vw,64px); }
        .testi-card { background: var(--glass); border: 1px solid var(--glass-b); border-radius: var(--r-lg); padding: clamp(20px,2.5vw,36px) clamp(18px,2.2vw,32px); position: relative; overflow: hidden; transition: transform 0.3s; }
        .testi-card:hover { transform: translateY(-4px); }
        .testi-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background: linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent); }
        .t-score { display: inline-flex; align-items: center; gap: 6px; background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.2); border-radius: 99px; padding: clamp(3px,0.4vw,6px) clamp(10px,1.2vw,16px); margin-bottom: clamp(10px,1.2vw,16px); font-size: clamp(11px,1vw,14px); font-weight: 500; color: var(--accent); }
        .t-quote { font-family: 'Playfair Display', serif; font-size: clamp(14px,1.5vw,20px); font-style: italic; color: var(--text1); line-height: 1.6; margin-bottom: clamp(12px,1.5vw,20px); }
        .t-handle { font-size: clamp(12px,1.2vw,16px); font-weight: 500; color: var(--text3); }
        .t-niche { font-size: clamp(11px,1.1vw,15px); color: var(--text3); margin-top: 2px; }
        .cta-wrap { position: relative; z-index: 1; margin: 0 0 clamp(60px,8vw,120px); padding: 0 var(--pad); text-align: center; }
        .cta-card { background: var(--glass); border: 1px solid var(--glass-b); border-radius: clamp(20px,2.5vw,32px); padding: clamp(48px,7vw,100px) clamp(24px,6vw,80px); position: relative; overflow: hidden; backdrop-filter: blur(24px); }
        .cta-card::before { content:''; position:absolute; inset:0; background: linear-gradient(135deg,rgba(167,139,250,0.06) 0%,transparent 60%); pointer-events:none; }
        .cta-card::after { content:''; position:absolute; top:0; left:0; right:0; height:1px; background: linear-gradient(90deg,transparent,rgba(167,139,250,0.4),transparent); }
        .cta-title { font-family: 'Playfair Display', serif; font-size: clamp(28px,5.5vw,80px); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; color: var(--text1); margin-bottom: clamp(10px,1.2vw,16px); }
        .cta-desc { font-size: clamp(14px,1.4vw,22px); font-weight: 300; color: var(--text2); line-height: 1.6; margin-bottom: clamp(24px,3vw,40px); max-width: min(90vw,600px); margin-left: auto; margin-right: auto; }
        .cta-btns { display: flex; gap: clamp(8px,1vw,14px); justify-content: center; flex-wrap: wrap; }
        footer { position: relative; z-index: 1; border-top: 1px solid rgba(255,255,255,0.05); padding: clamp(24px,3vw,40px) var(--pad); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
        .footer-logo { font-family: 'Playfair Display', serif; font-size: clamp(13px,1.2vw,16px); font-weight: 700; color: var(--text2); display: flex; align-items: center; gap: 7px; }
        .footer-links { display: flex; gap: clamp(12px,2vw,24px); }
        .footer-link { font-size: clamp(11px,1.1vw,14px); color: rgba(255,255,255,0.6); text-decoration: none; cursor: pointer; }
        .footer-link:hover { color: var(--text2); }
        .footer-copy { font-size: clamp(11px,1.1vw,14px); color: var(--text3); }
        .divider { border: none; border-top: 1px solid rgba(255,255,255,0.04); margin: 0; }
        @media(max-width:768px) {
          .nav-links { display: none; }
          .nav-hamburger { display: flex; }
          .stats-row { grid-template-columns: repeat(2,1fr); }
          .features-grid { grid-template-columns: 1fr; }
          .testi-grid { grid-template-columns: 1fr; }
        }
        @media(min-width:769px) and (max-width:1024px) {
          .features-grid { grid-template-columns: repeat(2,1fr); }
          .testi-grid { grid-template-columns: repeat(2,1fr); }
        }
      `}</style>

      <ParticleCanvas />

      {menuOpen && (
        <div className="nav-mobile-menu">
          <button onClick={() => setMenuOpen(false)} style={{position:"absolute",top:"24px",right:"24px",background:"none",border:"none",color:"var(--text1)",fontSize:"36px",cursor:"pointer"}}>×</button>
          <button onClick={() => { document.getElementById('features')?.scrollIntoView({behavior:'smooth'}); setMenuOpen(false); }} style={{fontSize:"28px",color:"rgba(255,255,255,0.9)",background:"none",border:"none",fontFamily:"inherit",cursor:"pointer"}}>Features</button>
          <button onClick={() => { document.getElementById('testimonials')?.scrollIntoView({behavior:'smooth'}); setMenuOpen(false); }} style={{fontSize:"28px",color:"rgba(255,255,255,0.9)",background:"none",border:"none",fontFamily:"inherit",cursor:"pointer"}}>Reviews</button>
          <a href="/pricing" onClick={() => setMenuOpen(false)} style={{fontSize:"28px",color:"rgba(255,255,255,0.9)",textDecoration:"none"}}>Pricing</a>
          <a href="/sign-in" onClick={() => setMenuOpen(false)} style={{fontSize:"28px",color:"rgba(255,255,255,0.9)",textDecoration:"none"}}>Log in</a>
          <a href="/sign-up" onClick={() => setMenuOpen(false)} style={{fontSize:"22px",padding:"16px 44px",background:"linear-gradient(135deg,#a78bfa,#818cf8)",color:"#fff",borderRadius:"14px",textDecoration:"none",fontWeight:600}}>Get Started</a>
        </div>
      )}

      <nav>
        <a className="nav-logo" href="/"><div className="nav-dot" />GhostOS</a>
        <div className="nav-links">
          <button className="nav-link" onClick={() => document.getElementById('features')?.scrollIntoView({behavior:'smooth'})}>Features</button>
          <button className="nav-link" onClick={() => document.getElementById('testimonials')?.scrollIntoView({behavior:'smooth'})}>Reviews</button>
          <a className="nav-link" href="/pricing">Pricing</a>
          <a className="nav-btn nav-ghost" href="/sign-in">Log in</a>
          <a className="nav-btn nav-primary" href="/sign-up">Get Started</a>
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
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:"13px",color:"rgba(167,139,250,0.9)"}}>{activeTestimonial.handle}</div>
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
