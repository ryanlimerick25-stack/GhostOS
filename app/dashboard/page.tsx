"use client";
import { useUser, useClerk } from "@clerk/nextjs";
import posthog from "posthog-js";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

type Audit = {
  id: string;
  created_at: string;
  niche: string;
  followers: number;
  avg_views: number;
  engagement_rate: number;
  readiness_score: number;
  deal_low: number;
  deal_target: number;
  deal_high: number;
  tiktok_handle: string;
  result: any;
};

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [audits, setAudits] = useState<Audit[]>([]);
  const [isPro, setIsPro] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedAudit, setExpandedAudit] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'account'|'appearance'|'legal'>('account');
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) { router.push("/sign-in"); return; }
    Promise.all([
      fetch("/api/audits").then(r => r.json()),
      fetch("/api/user").then(r => r.json()),
    ]).then(([auditData, userData]) => {
      setAudits(auditData.audits || []);
      setIsPro(userData.is_pro || false);
      setLoading(false);
    });
  }, [isLoaded, user]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  async function handleUpgrade() {
    posthog.capture("upgrade_clicked");
    setUpgrading(true);
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setUpgrading(false);
  }

  async function handlePortal() {
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  function scoreColor(s: number) {
    if (s >= 75) return "#4ade80";
    if (s >= 50) return "#facc15";
    return "#f87171";
  }

  function scoreLabel(s: number) {
    if (s >= 75) return "Brand Ready";
    if (s >= 50) return "Getting There";
    return "Needs Work";
  }

  const freeAuditsUsed = !isPro ? audits.length : null;
  const scoreImprovement = audits.length >= 2
    ? audits[0].readiness_score - audits[audits.length - 1].readiness_score
    : null;
  const freeAuditsLeft = freeAuditsUsed !== null ? Math.max(0, 1 - freeAuditsUsed) : null;

  if (!isLoaded || loading) return (
    <div style={{ minHeight: "100vh", background: "#04040a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "rgba(255,255,255,0.3)", fontFamily: "DM Sans, sans-serif" }}>Loading...</div>
    </div>
  );

  const expanded = expandedAudit ? audits.find(a => a.id === expandedAudit) : null;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #04040a; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; color: rgba(255,255,255,0.9); }
        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 var(--pad,8vw); height: clamp(60px,8vw,110px); background: rgba(4,4,10,0.8); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .nav-logo { font-family: 'Playfair Display', serif; font-size: clamp(18px,2.5vw,32px); font-weight: 700; color: rgba(255,255,255,0.9); display: flex; align-items: center; gap: 8px; text-decoration: none; }
        .nav-dot { width: 7px; height: 7px; border-radius: 50%; background: #a78bfa; box-shadow: 0 0 10px #a78bfa; animation: pulse 2s ease infinite; flex-shrink: 0; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        .nav-right { display: flex; align-items: center; gap: 12px; }
        .nav-user { font-size: clamp(13px,1.3vw,20px); color: rgba(255,255,255,0.4); }
        .nav-btn { padding: clamp(8px,0.8vw,14px) clamp(16px,1.8vw,32px); border-radius: 99px; font-size: clamp(13px,1.3vw,20px); font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; text-decoration: none; display: inline-block; border: none; }
        .nav-audit { background: linear-gradient(135deg,#a78bfa,#818cf8); color: #fff; }
        .nav-audit:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(167,139,250,0.3); }
        .nav-link { padding: clamp(8px,0.8vw,14px) clamp(12px,1.5vw,28px); border-radius: 99px; font-size: clamp(13px,1.3vw,20px); font-weight: 400; color: rgba(255,255,255,0.4); text-decoration: none; display: inline-block; transition: color 0.2s; } .nav-link:hover { color: rgba(255,255,255,0.8); } .nav-signout { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); }
        .nav-signout:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.08); }
        .page { max-width: 1100px; margin: 0 auto; padding: 140px 24px 60px; }
        .welcome { margin-bottom: 36px; }
        .welcome-label { font-size: 13px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: #a78bfa; margin-bottom: 10px; }
        .welcome-title { font-family: 'Playfair Display', serif; font-size: clamp(48px,5vw,72px); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; color: rgba(255,255,255,0.93); margin-bottom: 8px; }
        .welcome-title em { font-style: italic; color: rgba(255,255,255,0.4); }
        .welcome-sub { font-size: 18px; font-weight: 300; color: rgba(255,255,255,0.3); }
        .stats-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 32px; }
        @media(max-width:600px){.stats-row{grid-template-columns:1fr}}
        .stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 24px; position: relative; overflow: hidden; }
        .stat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background: linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent); }
        .stat-label { font-size: 13px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.28); margin-bottom: 10px; }
        .stat-value { font-family: 'Playfair Display', serif; font-size: clamp(40px,4vw,64px); font-weight: 700; letter-spacing: -0.02em; color: rgba(255,255,255,0.93); }
        .stat-sub { font-size: 14px; color: rgba(255,255,255,0.25); margin-top: 4px; }
        .section-title { font-family: 'Playfair Display', serif; font-size: clamp(28px,3vw,40px); font-weight: 600; color: rgba(255,255,255,0.9); margin-bottom: 16px; letter-spacing: -0.01em; }
        .empty-state { background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.08); border-radius: 20px; padding: 56px 24px; text-align: center; }
        .empty-icon { font-size: 36px; margin-bottom: 16px; }
        .empty-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 600; color: rgba(255,255,255,0.6); margin-bottom: 8px; }
        .empty-sub { font-size: 14px; color: rgba(255,255,255,0.25); margin-bottom: 24px; }
        .btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 13px 28px; border-radius: 12px; background: linear-gradient(135deg,#a78bfa,#818cf8); color: #fff; font-size: 14px; font-weight: 600; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); text-decoration: none; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(167,139,250,0.35); }
        .audits-list { display: flex; flex-direction: column; gap: 12px; }
        .audit-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; overflow: hidden; transition: all 0.2s; }
        .audit-card:hover { border-color: rgba(167,139,250,0.2); }
        .audit-card-header { padding: 24px 28px; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 24px; cursor: pointer; position: relative; }
        .audit-card-header::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background: linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent); }
        .audit-card-header:hover { background: rgba(255,255,255,0.02); }
        .audit-niche { font-size: 20px; font-weight: 500; color: rgba(255,255,255,0.9); margin-bottom: 6px; }
        .audit-meta { font-size: 12px; color: rgba(255,255,255,0.28); display: flex; gap: 16px; flex-wrap: wrap; }
        .audit-right { text-align: right; }
        .audit-score { font-family: 'Playfair Display', serif; font-size: clamp(32px,3vw,48px); font-weight: 700; line-height: 1; margin-bottom: 4px; }
        .audit-score-label { font-size: 11px; font-weight: 500; letter-spacing: 0.06em; }
        .score-trend { font-size: 11px; font-weight: 600; margin-top: 4px; }
        .score-trend.up { color: #4ade80; }
        .score-trend.down { color: #f87171; }
        .score-trend.same { color: rgba(255,255,255,0.3); }
        .audit-deal { font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 6px; }
        .audit-date { font-size: 11px; color: rgba(255,255,255,0.2); margin-top: 2px; }
        .audit-expand-btn { font-size: 11px; color: rgba(167,139,250,0.7); margin-top: 6px; cursor: pointer; background: none; border: none; font-family: inherit; padding: 0; }
        .audit-detail { border-top: 1px solid rgba(255,255,255,0.05); padding: 28px; background: rgba(0,0,0,0.2); animation: fadeIn 0.2s ease; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .detail-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 24px; }
        @media(max-width:600px){.detail-grid{grid-template-columns:1fr}.audit-card-header{grid-template-columns:1fr}.audit-right{text-align:left}}
        .detail-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 16px 18px; }
        .detail-card-label { font-size: 9px; font-family: 'DM Mono', monospace; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.25); margin-bottom: 6px; }
        .detail-card-value { font-family: 'Playfair Display', serif; font-size: 24px; color: rgba(255,255,255,0.9); letter-spacing: -0.02em; }
        .detail-section { margin-bottom: 20px; }
        .detail-section-label { font-size: 9px; font-family: 'DM Mono', monospace; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.25); margin-bottom: 10px; }
        .detail-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .detail-list li { font-size: 13px; color: rgba(255,255,255,0.55); line-height: 1.5; display: flex; gap: 10px; }
        .detail-list li::before { content: '—'; color: rgba(255,255,255,0.15); flex-shrink: 0; font-family: 'DM Mono', monospace; }
        .tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .tag { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 99px; padding: 4px 12px; font-size: 11px; color: rgba(255,255,255,0.5); }
        .trend-bar { display: flex; align-items: flex-end; gap: 6px; height: 48px; margin-top: 8px; }
        .trend-bar-item { flex: 1; border-radius: 4px 4px 0 0; min-width: 8px; transition: opacity 0.2s; cursor: default; position: relative; }
        .trend-bar-item:hover { opacity: 0.8; }
        .progress-bar-wrap { height: 4px; background: rgba(255,255,255,0.06); border-radius: 99px; overflow: hidden; margin-top: 8px; }
        .progress-bar-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg,#a78bfa,#818cf8); }
        [data-theme="light"] body { background: #f0eff5 !important; color: rgba(10,8,20,0.9) !important; }
        [data-theme="light"] nav { background: rgba(240,239,245,0.9) !important; border-bottom-color: rgba(0,0,0,0.08) !important; }
        [data-theme="light"] .nav-logo { color: rgba(10,8,20,0.9) !important; }
        [data-theme="light"] .nav-user { color: rgba(10,8,20,0.5) !important; }
        [data-theme="light"] .nav-link { color: rgba(10,8,20,0.5) !important; }
        [data-theme="light"] .nav-link:hover { color: rgba(10,8,20,0.9) !important; }
        [data-theme="light"] .nav-signout { background: rgba(0,0,0,0.04) !important; border-color: rgba(0,0,0,0.1) !important; color: rgba(10,8,20,0.5) !important; }
        [data-theme="light"] .page { background: #f0eff5; }
        [data-theme="light"] .welcome-title { color: rgba(10,8,20,0.9) !important; }
        [data-theme="light"] .welcome-title em { color: rgba(10,8,20,0.35) !important; }
        [data-theme="light"] .welcome-label { color: #7c3aed !important; }
        [data-theme="light"] .welcome-sub { color: rgba(10,8,20,0.4) !important; }
        [data-theme="light"] .stat-card { background: rgba(0,0,0,0.04) !important; border-color: rgba(0,0,0,0.08) !important; }
        [data-theme="light"] .stat-label { color: rgba(10,8,20,0.4) !important; }
        [data-theme="light"] .stat-value { color: rgba(10,8,20,0.9) !important; }
        [data-theme="light"] .stat-sub { color: rgba(10,8,20,0.35) !important; }
        [data-theme="light"] .section-title { color: rgba(10,8,20,0.9) !important; }
        [data-theme="light"] .audit-card { background: rgba(0,0,0,0.03) !important; border-color: rgba(0,0,0,0.08) !important; }
        [data-theme="light"] .audit-card:hover { border-color: rgba(124,58,237,0.3) !important; }
        [data-theme="light"] .audit-niche { color: rgba(10,8,20,0.9) !important; }
        [data-theme="light"] .audit-meta { color: rgba(10,8,20,0.4) !important; }
        [data-theme="light"] .audit-deal { color: rgba(10,8,20,0.4) !important; }
        [data-theme="light"] .audit-date { color: rgba(10,8,20,0.3) !important; }
        [data-theme="light"] .audit-detail { background: rgba(0,0,0,0.03) !important; border-top-color: rgba(0,0,0,0.06) !important; }
        [data-theme="light"] .detail-card { background: rgba(0,0,0,0.04) !important; border-color: rgba(0,0,0,0.07) !important; }
        [data-theme="light"] .detail-card-label { color: rgba(10,8,20,0.35) !important; }
        [data-theme="light"] .detail-card-value { color: rgba(10,8,20,0.9) !important; }
        [data-theme="light"] .detail-section-label { color: rgba(10,8,20,0.35) !important; }
        [data-theme="light"] .detail-list li { color: rgba(10,8,20,0.6) !important; }
        [data-theme="light"] .detail-list li::before { color: rgba(10,8,20,0.2) !important; }
        [data-theme="light"] .tag { background: rgba(0,0,0,0.04) !important; border-color: rgba(0,0,0,0.08) !important; color: rgba(10,8,20,0.5) !important; }
        [data-theme="light"] .empty-state { background: rgba(0,0,0,0.02) !important; border-color: rgba(0,0,0,0.08) !important; }
        [data-theme="light"] .empty-title { color: rgba(10,8,20,0.6) !important; }
        [data-theme="light"] .empty-sub { color: rgba(10,8,20,0.35) !important; }
        [data-theme="light"] .profile-dropdown { background: #ffffff !important; border-color: rgba(0,0,0,0.1) !important; }
        [data-theme="light"] .pd-header { border-bottom-color: rgba(0,0,0,0.06) !important; }
        [data-theme="light"] .pd-name { color: rgba(10,8,20,0.9) !important; }
        [data-theme="light"] .pd-email { color: rgba(10,8,20,0.4) !important; }
        [data-theme="light"] .pd-stat-val { color: rgba(10,8,20,0.9) !important; }
        [data-theme="light"] .pd-stat-label { color: rgba(10,8,20,0.35) !important; }
        [data-theme="light"] .pd-link { color: rgba(10,8,20,0.5) !important; }
        [data-theme="light"] .pd-link:hover { background: rgba(0,0,0,0.04) !important; color: rgba(10,8,20,0.9) !important; }
        [data-theme="light"] .pd-link-icon { background: rgba(0,0,0,0.05) !important; }
        [data-theme="light"] .pd-divider { background: rgba(0,0,0,0.06) !important; }
        [data-theme="light"] .modal { background: #ffffff !important; border-color: rgba(0,0,0,0.1) !important; }
        [data-theme="light"] .modal-title { color: rgba(10,8,20,0.9) !important; }
        [data-theme="light"] .modal-close { background: rgba(0,0,0,0.04) !important; border-color: rgba(0,0,0,0.08) !important; color: rgba(10,8,20,0.4) !important; }
        [data-theme="light"] .settings-tabs { border-bottom-color: rgba(0,0,0,0.06) !important; }
        [data-theme="light"] .settings-tab { color: rgba(10,8,20,0.35) !important; }
        [data-theme="light"] .settings-tab:hover { color: rgba(10,8,20,0.7) !important; }
        [data-theme="light"] .settings-section-title { color: rgba(10,8,20,0.3) !important; }
        [data-theme="light"] .settings-label { color: rgba(10,8,20,0.7) !important; }
        [data-theme="light"] .settings-sub { color: rgba(10,8,20,0.35) !important; }
        [data-theme="light"] .settings-value { color: rgba(10,8,20,0.5) !important; background: rgba(0,0,0,0.04) !important; border-color: rgba(0,0,0,0.08) !important; }
        [data-theme="light"] .settings-btn-ghost { background: rgba(0,0,0,0.04) !important; border-color: rgba(0,0,0,0.08) !important; color: rgba(10,8,20,0.5) !important; }
        [data-theme="light"] .settings-divider { background: rgba(0,0,0,0.06) !important; }
        [data-theme="light"] .legal-block { background: rgba(0,0,0,0.03) !important; border-color: rgba(0,0,0,0.07) !important; color: rgba(10,8,20,0.45) !important; }
        [data-theme="light"] .toggle-slider { background: rgba(0,0,0,0.12) !important; border-color: rgba(0,0,0,0.1) !important; }
        .profile-wrap { position: relative; }
        .profile-btn { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg,#a78bfa,#818cf8); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #fff; font-family: inherit; flex-shrink: 0; transition: box-shadow 0.2s; }
        .profile-btn:hover { box-shadow: 0 0 0 3px rgba(167,139,250,0.3); }
        .profile-btn img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
        .profile-dropdown { position: absolute; top: calc(100% + 12px); right: 0; width: 300px; background: #0e0e1a; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; box-shadow: 0 24px 64px rgba(0,0,0,0.6); z-index: 200; overflow: hidden; animation: fadeIn 0.15s ease; pointer-events: all; }
        .pd-header { padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 14px; }
        .pd-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg,#a78bfa,#818cf8); display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; color: #fff; flex-shrink: 0; overflow: hidden; }
        .pd-name { font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.9); margin-bottom: 2px; }
        .pd-email { font-size: 12px; color: rgba(255,255,255,0.3); }
        .pd-plan { display: inline-flex; align-items: center; gap: 5px; margin-top: 6px; padding: 3px 10px; border-radius: 99px; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
        .pd-plan.pro { background: rgba(74,222,128,0.1); color: #4ade80; border: 1px solid rgba(74,222,128,0.2); }
        .pd-plan.free { background: rgba(167,139,250,0.1); color: #a78bfa; border: 1px solid rgba(167,139,250,0.2); }
        .pd-stats { padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
        .pd-stat { text-align: center; }
        .pd-stat-val { font-family: "Playfair Display", serif; font-size: 22px; font-weight: 700; color: rgba(255,255,255,0.9); line-height: 1; }
        .pd-stat-label { font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.25); margin-top: 4px; }
        .pd-links { padding: 8px; }
        .pd-link { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 12px; font-size: 13px; color: rgba(255,255,255,0.5); text-decoration: none; cursor: pointer; background: none; border: none; width: 100%; text-align: left; font-family: inherit; transition: all 0.15s; }
        .pd-link:hover { background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.85); }
        .pd-link-icon { width: 28px; height: 28px; border-radius: 8px; background: rgba(255,255,255,0.04); display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
        .pd-divider { height: 1px; background: rgba(255,255,255,0.05); margin: 4px 8px; }
        .pd-link.danger:hover { color: #f87171; background: rgba(248,113,113,0.06); }
        .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 24px; backdrop-filter: blur(4px); }
        .modal { background: #0e0e1a; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; width: 100%; max-width: 480px; overflow: hidden; }
        .modal-header { padding: 24px 28px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: space-between; }
        .modal-title { font-family: "Playfair Display", serif; font-size: 22px; font-weight: 600; color: rgba(255,255,255,0.9); }
        .modal-close { width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.4); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; font-family: inherit; transition: all 0.15s; }
        .modal-close:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.8); }
        .modal-body { padding: 24px 28px; display: flex; flex-direction: column; gap: 20px; }
        .settings-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .settings-label { font-size: 14px; color: rgba(255,255,255,0.7); }
        .settings-sub { font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 2px; }
        .settings-value { font-size: 13px; color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 6px 12px; }
        .settings-btn { padding: 8px 18px; border-radius: 10px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; transition: all 0.15s; border: none; }
        .settings-btn-ghost { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); }
        .settings-btn-ghost:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.8); }
        .settings-btn-danger { background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2); color: #f87171; }
        .settings-btn-danger:hover { background: rgba(248,113,113,0.15); }
        .settings-divider { height: 1px; background: rgba(255,255,255,0.05); }
        .settings-tabs { display: flex; gap: 4px; padding: 16px 28px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .settings-tab { padding: 8px 16px; border-radius: 8px 8px 0 0; font-size: 13px; font-weight: 500; cursor: pointer; background: none; border: none; font-family: inherit; color: rgba(255,255,255,0.35); transition: all 0.15s; border-bottom: 2px solid transparent; margin-bottom: -1px; }
        .settings-tab:hover { color: rgba(255,255,255,0.7); }
        .settings-tab.active { color: #a78bfa; border-bottom-color: #a78bfa; }
        .settings-section-title { font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.2); margin-bottom: 4px; margin-top: 4px; }

        .legal-block { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 16px; font-size: 12px; color: rgba(255,255,255,0.35); line-height: 1.7; max-height: 180px; overflow-y: auto; }
        .legal-block::-webkit-scrollbar { width: 4px; }
        .legal-block::-webkit-scrollbar-track { background: transparent; }
        .legal-block::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }
        .modal { background: #0e0e1a; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; width: 100%; max-width: 520px; overflow: hidden; max-height: 90vh; display: flex; flex-direction: column; }
        .modal-body { padding: 24px 28px; display: flex; flex-direction: column; gap: 16px; overflow-y: auto; }
      `}</style>

      <nav>
        <a className="nav-logo" href="/"><div className="nav-dot" />GhostOS</a>
        <div className="nav-right">
          <span className="nav-user">Hi, {user?.firstName || "Creator"}</span>
          <a href="/pricing" className="nav-link">Pricing</a>
          <a className="nav-btn nav-audit" href="/audit">New Audit →</a>
          <button className="nav-btn nav-signout" onClick={() => signOut(() => router.push("/"))}>Sign out</button>
          <div className="profile-wrap" ref={profileRef}>
            <button className="profile-btn" onClick={() => setProfileOpen(o => !o)}>
              {user?.imageUrl
                ? <img src={user.imageUrl} alt="" style={{borderRadius:"50%"}} />
                : (user?.firstName?.[0] || "C")}
            </button>
            {profileOpen && (
              <>
                <div className="profile-dropdown">
                  <div className="pd-header">
                    <div className="pd-avatar">
                      {user?.imageUrl
                        ? <img src={user.imageUrl} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                        : (user?.firstName?.[0] || "C")}
                    </div>
                    <div>
                      <div className="pd-name">{user?.firstName} {user?.lastName}</div>
                      <div className="pd-email">{user?.emailAddresses?.[0]?.emailAddress}</div>
                      <div className={"pd-plan " + (isPro ? "pro" : "free")}>
                        {isPro ? "● Pro" : "◎ Free"}
                      </div>
                    </div>
                  </div>
                  <div className="pd-stats">
                    <div className="pd-stat">
                      <div className="pd-stat-val">{audits.length}</div>
                      <div className="pd-stat-label">Audits</div>
                    </div>
                    <div className="pd-stat">
                      <div className="pd-stat-val" style={{color: audits.length ? scoreColor(Math.max(...audits.map(a => a.readiness_score))) : "rgba(255,255,255,0.2)"}}>
                        {audits.length ? Math.max(...audits.map(a => a.readiness_score)) : "—"}
                      </div>
                      <div className="pd-stat-label">Best Score</div>
                    </div>
                    <div className="pd-stat">
                      <div className="pd-stat-val" style={{fontSize:"16px"}}>
                        {audits.length ? "$" + Math.max(...audits.map(a => a.deal_target)).toLocaleString() : "—"}
                      </div>
                      <div className="pd-stat-label">Best Deal</div>
                    </div>
                  </div>
                  <div className="pd-links">
                    <a className="pd-link" href="/audit">
                      <span className="pd-link-icon">◎</span>
                      Run New Audit
                    </a>
                    {isPro
                      ? <button className="pd-link" onClick={() => { setProfileOpen(false); handlePortal(); }}>
                          <span className="pd-link-icon">💳</span>
                          Manage Subscription
                        </button>
                      : <button className="pd-link" onClick={() => { setProfileOpen(false); handleUpgrade(); }}>
                          <span className="pd-link-icon">⚡</span>
                          Upgrade to Pro
                        </button>
                    }
                    <a className="pd-link" href="/pricing">
                      <span className="pd-link-icon">◈</span>
                      Pricing
                    </a>
                    <button className="pd-link" onClick={() => { setProfileOpen(false); setSettingsOpen(true); }}>
                      <span className="pd-link-icon">⚙</span>
                      Settings
                    </button>
                    <div className="pd-divider" />
                    <button className="pd-link danger" onClick={() => signOut(() => router.push("/"))}>
                      <span className="pd-link-icon">→</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="page">
        <div className="welcome">
          <div className="welcome-label">Dashboard</div>
          <h1 className="welcome-title">Welcome back, <em>{user?.firstName || "Creator"}</em></h1>
          <p className="welcome-sub">Track your brand deal readiness over time.</p>
        </div>

        {/* Free usage bar */}
        {!isPro && (
          <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"16px",padding:"16px 20px",marginBottom:"16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
              <span style={{fontSize:"12px",color:"rgba(255,255,255,0.4)"}}>Free audits used</span>
              <span style={{fontSize:"12px",fontWeight:500,color:"rgba(255,255,255,0.6)"}}>{audits.length} / 1</span>
            </div>
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{width:`${Math.min(100,(audits.length/1)*100)}%`, background: audits.length >= 1 ? "#f87171" : "linear-gradient(90deg,#a78bfa,#818cf8)"}} />
            </div>
            {freeAuditsLeft === 0 && (
              <div style={{marginTop:"10px",fontSize:"12px",color:"#fca5a5"}}>You've used your 1 free audit. <button onClick={handleUpgrade} style={{color:"#a78bfa",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:"12px",padding:0}}>Upgrade to Pro →</button></div>
            )}
          </div>
        )}

        {/* Upgrade banner */}
        {!isPro && (
          <div style={{background:"linear-gradient(135deg,rgba(167,139,250,0.1),rgba(129,140,248,0.1))",border:"1px solid rgba(167,139,250,0.2)",borderRadius:"20px",padding:"24px 28px",marginBottom:"24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"16px"}}>
            <div>
              <div style={{fontSize:"11px",fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",color:"#a78bfa",marginBottom:"6px"}}>Upgrade to Pro</div>
              <div style={{fontSize:"16px",fontWeight:500,color:"rgba(255,255,255,0.9)",marginBottom:"4px"}}>Unlimited audits + full history</div>
              <div style={{fontSize:"13px",color:"rgba(255,255,255,0.35)"}}>Free plan = 1 audit. Pro = unlimited for $5/month.</div>
            </div>
            <button onClick={handleUpgrade} disabled={upgrading} style={{padding:"12px 28px",borderRadius:"12px",background:"linear-gradient(135deg,#a78bfa,#818cf8)",color:"#fff",fontSize:"14px",fontWeight:600,border:"none",cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",opacity:upgrading?0.6:1}}>
              {upgrading ? "Loading..." : "Upgrade to Pro →"}
            </button>
          </div>
        )}

        {isPro && (
          <div style={{background:"rgba(74,222,128,0.05)",border:"1px solid rgba(74,222,128,0.15)",borderRadius:"20px",padding:"16px 24px",marginBottom:"24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"12px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
              <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 8px #4ade80"}} />
              <span style={{fontSize:"14px",color:"rgba(255,255,255,0.7)"}}>GhostOS Pro — Active</span>
            </div>
            <button onClick={handlePortal} style={{fontSize:"12px",color:"rgba(255,255,255,0.3)",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>Manage subscription →</button>
          </div>
        )}

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Total Audits</div>
            <div className="stat-value">{audits.length}</div>
            <div className="stat-sub">All time</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Best Score</div>
            <div className="stat-value" style={{ color: audits.length ? scoreColor(Math.max(...audits.map(a => a.readiness_score))) : "rgba(255,255,255,0.2)" }}>
              {audits.length ? Math.max(...audits.map(a => a.readiness_score)) : "—"}
            </div>
            <div className="stat-sub">Out of 100</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Best Deal Target</div>
            <div className="stat-value" style={{ fontSize: "28px" }}>
              {audits.length ? `$${Math.max(...audits.map(a => a.deal_target)).toLocaleString()}` : "—"}
            </div>
            <div className="stat-sub">Per deal</div>
          </div>
        </div>

        {/* Score trend */}
        {audits.length > 1 && (
          <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"16px",padding:"20px 24px",marginBottom:"32px"}}>
            <div style={{fontSize:"11px",fontFamily:"DM Mono,monospace",letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.25)",marginBottom:"12px"}}>Score Trend</div>
            <div className="trend-bar">
              {[...audits].reverse().map((a, i) => (
                <div
                  key={a.id}
                  className="trend-bar-item"
                  style={{height:`${a.readiness_score}%`, background: scoreColor(a.readiness_score), opacity: 0.7}}
                  title={`${a.readiness_score}/100 — ${new Date(a.created_at).toLocaleDateString()}`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="section-title">Your Audits</div>

        {audits.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◎</div>
            <div className="empty-title">No audits yet</div>
            <div className="empty-sub">Run your first audit to see your brand deal readiness score.</div>
            <a className="btn-primary" href="/audit">Run Your First Audit →</a>
          </div>
        ) : (
          <>
          {scoreImprovement !== null && scoreImprovement > 0 && (
          <div style={{background:"rgba(74,222,128,0.06)",border:"1px solid rgba(74,222,128,0.15)",borderRadius:"16px",padding:"16px 24px",marginBottom:"16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:"11px",fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:"4px"}}>Score Progress</div>
              <div style={{fontSize:"15px",fontWeight:500,color:"#4ade80"}}>{"↑ You improved " + scoreImprovement + " pts since your first audit"}</div>
            </div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"32px",fontWeight:700,color:"#4ade80"}}>{"+" + scoreImprovement}</div>
          </div>
        )}
        {scoreImprovement !== null && scoreImprovement < 0 && (
          <div style={{background:"rgba(248,113,113,0.06)",border:"1px solid rgba(248,113,113,0.15)",borderRadius:"16px",padding:"16px 24px",marginBottom:"16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:"11px",fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:"4px"}}>Score Progress</div>
              <div style={{fontSize:"15px",fontWeight:500,color:"#f87171"}}>{"↓ Score dropped " + Math.abs(scoreImprovement) + " pts — check your gaps"}</div>
            </div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"32px",fontWeight:700,color:"#f87171"}}>{scoreImprovement}</div>
          </div>
        )}
        <div className="audits-list">
            {audits.map((a) => (
              <div className="audit-card" key={a.id}>
                <div className="audit-card-header" onClick={() => setExpandedAudit(expandedAudit === a.id ? null : a.id)}>
                  <div>
                    <div className="audit-niche">{a.niche}{a.tiktok_handle ? ` · ${a.tiktok_handle}` : ""}</div>
                    <div className="audit-meta">
                      <span>👥 {a.followers.toLocaleString()} followers</span>
                      <span>▶ {a.avg_views.toLocaleString()} avg views</span>
                      <span>◎ {a.engagement_rate}% engagement</span>
                    </div>
                  </div>
                  <div className="audit-right">
                    <div className="audit-score" style={{ color: scoreColor(a.readiness_score) }}>{a.readiness_score}</div>
                    <div className="audit-score-label" style={{ color: scoreColor(a.readiness_score) }}>{scoreLabel(a.readiness_score)}</div>
                    <div className="audit-deal">${a.deal_low.toLocaleString()} – ${a.deal_high.toLocaleString()}</div>
                    <div className="audit-date">{new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                    <div style={{fontSize:"11px",color:"rgba(167,139,250,0.6)",marginTop:"6px"}}>{expandedAudit === a.id ? "▲ collapse" : "▼ view details"}</div>
                  </div>
                </div>

                {expandedAudit === a.id && a.result && (
                  <div className="audit-detail">
                    {/* Deal range */}
                    <div className="detail-grid">
                      <div className="detail-card">
                        <div className="detail-card-label">Conservative</div>
                        <div className="detail-card-value">${a.result.estimated_first_deal_range_usd?.low?.toLocaleString()}</div>
                      </div>
                      <div className="detail-card" style={{borderColor:"rgba(201,184,255,0.15)",background:"rgba(201,184,255,0.03)"}}>
                        <div className="detail-card-label" style={{color:"rgba(167,139,250,0.6)"}}>Target</div>
                        <div className="detail-card-value" style={{color:"#c9b8ff"}}>${a.result.estimated_first_deal_range_usd?.target?.toLocaleString()}</div>
                      </div>
                      <div className="detail-card">
                        <div className="detail-card-label">Best Case</div>
                        <div className="detail-card-value">${a.result.estimated_first_deal_range_usd?.high?.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Brand categories */}
                    {(a.result.best_fit_brands || []).map((b: any) => typeof b === "string" ? b : b.name)?.length > 0 && (
                      <div className="detail-section">
                        <div className="detail-section-label">Brands That Would Work With You</div>
                        <div className="tags">
                          {(a.result.best_fit_brands || []).map((b: any) => typeof b === "string" ? b : b.name).map((c: string, i: number) => (
                            <span className="tag" key={i}>{c}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Why brands pay */}
                    {a.result.why_brands_would_pay?.length > 0 && (
                      <div className="detail-section">
                        <div className="detail-section-label">Why Brands Would Pay You</div>
                        <ul className="detail-list">
                          {a.result.why_brands_would_pay.map((x: string, i: number) => <li key={i}>{x}</li>)}
                        </ul>
                      </div>
                    )}

                    {/* Top gaps */}
                    {a.result.top_gaps_to_fix_next_14_days?.length > 0 && (
                      <div className="detail-section">
                        <div className="detail-section-label">Top Gaps to Fix</div>
                        <ul className="detail-list">
                          {a.result.top_gaps_to_fix_next_14_days.map((x: string, i: number) => (
                            <li key={i} style={{color:"rgba(248,113,113,0.7)"}}>{x}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Rate card */}
                    {a.result.rate_card_usd && (
                      <div className="detail-section">
                        <div className="detail-section-label">Rate Card</div>
                        <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                          {[
                            {label:"Single Post", value:`$${a.result.rate_card_usd.single_post?.toLocaleString()}`},
                            {label:"3-Post Package", value:`$${a.result.rate_card_usd.three_post_package?.toLocaleString()}`},
                            {label:"Ambassador", value:`$${a.result.rate_card_usd.monthly_ambassador?.toLocaleString()}`},
                          ].map(({label,value}) => (
                            <div key={label} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"10px",padding:"10px 14px"}}>
                              <div style={{fontSize:"9px",fontFamily:"DM Mono,monospace",letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.25)",marginBottom:"4px"}}>{label}</div>
                              <div style={{fontSize:"18px",fontFamily:"Playfair Display,serif",color:"rgba(255,255,255,0.85)"}}>{value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <a href="/deal-analyzer" style={{padding:"8px 18px",borderRadius:"99px",fontSize:"13px",fontWeight:500,background:"rgba(201,184,255,0.08)",border:"1px solid rgba(201,184,255,0.15)",color:"#c9b8ff",textDecoration:"none"}}>Deal Analyzer</a>
          <a href="/audit" style={{display:"inline-flex",alignItems:"center",gap:"6px",marginTop:"8px",padding:"10px 20px",borderRadius:"10px",background:"linear-gradient(135deg,#a78bfa,#818cf8)",color:"#fff",fontSize:"13px",fontWeight:600,textDecoration:"none",fontFamily:"inherit"}}>
                      Run New Audit →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
        )}
      </div>
    {settingsOpen && (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setSettingsOpen(false); }}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Settings</div>
              <button className="modal-close" onClick={() => setSettingsOpen(false)}>✕</button>
            </div>
            <div className="settings-tabs">
              {(["account","legal"] as const).map(tab => (
                <button key={tab} className={"settings-tab" + (settingsTab === tab ? " active" : "")} onClick={() => setSettingsTab(tab)}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="modal-body">

              {settingsTab === "account" && <>
                <div className="settings-section-title">Profile</div>
                <div className="settings-row">
                  <div>
                    <div className="settings-label">Name</div>
                    <div className="settings-sub">Managed via your account</div>
                  </div>
                  <div className="settings-value">{user?.firstName} {user?.lastName}</div>
                </div>
                <div className="settings-row">
                  <div>
                    <div className="settings-label">Email</div>
                    <div className="settings-sub">Audit results are sent here</div>
                  </div>
                  <div className="settings-value" style={{fontSize:"11px",maxWidth:"160px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.emailAddresses?.[0]?.emailAddress}</div>
                </div>
                <div className="settings-row">
                  <div>
                    <div className="settings-label">Member Since</div>
                    <div className="settings-sub">Account creation date</div>
                  </div>
                  <div className="settings-value">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US",{month:"short",year:"numeric"}) : "—"}</div>
                </div>
                <div className="settings-divider" />
                <div className="settings-section-title">Subscription</div>
                <div className="settings-row">
                  <div>
                    <div className="settings-label">Current Plan</div>
                    <div className="settings-sub">{isPro ? "Unlimited audits · $5/mo" : "1 free audit total"}</div>
                  </div>
                  {isPro
                    ? <button className="settings-btn settings-btn-ghost" onClick={() => { setSettingsOpen(false); handlePortal(); }}>Manage →</button>
                    : <button className="settings-btn" style={{background:"linear-gradient(135deg,#a78bfa,#818cf8)",color:"#fff",border:"none"}} onClick={() => { setSettingsOpen(false); handleUpgrade(); }}>Upgrade →</button>
                  }
                </div>
                <div className="settings-row">
                  <div>
                    <div className="settings-label">Audits Run</div>
                    <div className="settings-sub">{isPro ? "Unlimited" : `${audits.length} of 3 free used`}</div>
                  </div>
                  <div className="settings-value">{audits.length} total</div>
                </div>
                {audits.length > 0 && (
                  <div className="settings-row">
                    <div>
                      <div className="settings-label">Best Score</div>
                      <div className="settings-sub">Across all audits</div>
                    </div>
                    <div className="settings-value" style={{color: scoreColor(Math.max(...audits.map(a => a.readiness_score)))}}>{Math.max(...audits.map(a => a.readiness_score))} / 100</div>
                  </div>
                )}
                <div className="settings-divider" />
                <div className="settings-row">
                  <div>
                    <div className="settings-label">Sign Out</div>
                    <div className="settings-sub">You'll be returned to the homepage</div>
                  </div>
                  <button className="settings-btn settings-btn-danger" onClick={() => signOut(() => router.push("/"))}>Sign Out</button>
                </div>
              </>}



              {settingsTab === "legal" && <>
                <div className="settings-section-title">Terms of Service</div>
                <div className="legal-block">
                  <strong style={{color:"rgba(255,255,255,0.6)"}}>Last updated: May 2026</strong><br /><br />
                  By using GhostOS ("the Service"), you agree to these Terms. GhostOS provides brand deal intelligence tools for TikTok creators. The Service is provided for informational purposes only.<br /><br />
                  <strong style={{color:"rgba(255,255,255,0.5)"}}>Use of Service.</strong> You must be 18 or older to use GhostOS. You agree not to misuse the Service, attempt to reverse-engineer any part of the platform, or use automated tools to scrape or overload our systems.<br /><br />
                  <strong style={{color:"rgba(255,255,255,0.5)"}}>Accuracy of Results.</strong> Audit scores, deal range estimates, and brand recommendations are generated by AI and are for informational purposes only. GhostOS makes no guarantee that following our recommendations will result in brand deals or specific revenue outcomes.<br /><br />
                  <strong style={{color:"rgba(255,255,255,0.5)"}}>Subscriptions & Billing.</strong> Pro subscriptions are billed at $5/month. You may cancel at any time via the billing portal. Refunds are handled on a case-by-case basis — contact us at hello@ghostos.live.<br /><br />
                  <strong style={{color:"rgba(255,255,255,0.5)"}}>Termination.</strong> We reserve the right to suspend or terminate accounts that violate these Terms at our discretion.<br /><br />
                  <strong style={{color:"rgba(255,255,255,0.5)"}}>Liability.</strong> GhostOS is not liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our total liability is limited to the amount you paid us in the 30 days prior to the claim.
                </div>
                <div className="settings-section-title" style={{marginTop:"8px"}}>Privacy Policy</div>
                <div className="legal-block">
                  <strong style={{color:"rgba(255,255,255,0.6)"}}>Last updated: May 2026</strong><br /><br />
                  GhostOS collects only the data necessary to provide the Service. We do not sell your personal data to third parties.<br /><br />
                  <strong style={{color:"rgba(255,255,255,0.5)"}}>Data We Collect.</strong> Name, email address (via Clerk authentication), TikTok handle (optional), and audit inputs you provide (followers, views, engagement rate, niche, audience geography).<br /><br />
                  <strong style={{color:"rgba(255,255,255,0.5)"}}>How We Use It.</strong> To generate your audit results, send you audit confirmation emails via Resend, and store your audit history in Supabase so you can track progress over time.<br /><br />
                  <strong style={{color:"rgba(255,255,255,0.5)"}}>Third Parties.</strong> We use Clerk (authentication), Supabase (database), Stripe (payments), Resend (email), and OpenAI (AI analysis). Each has their own privacy policy. We do not share your data with brands or advertisers.<br /><br />
                  <strong style={{color:"rgba(255,255,255,0.5)"}}>Data Retention.</strong> Your audit history is stored until you delete your account. You may request deletion of your data at any time by emailing hello@ghostos.live.<br /><br />
                  <strong style={{color:"rgba(255,255,255,0.5)"}}>Cookies.</strong> We use only essential cookies required for authentication. No advertising or tracking cookies are used.
                </div>
                <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
                  <a href="/privacy" target="_blank" className="settings-btn settings-btn-ghost" style={{textDecoration:"none",fontSize:"12px"}}>Full Privacy Policy →</a>
                  <a href="/terms" target="_blank" className="settings-btn settings-btn-ghost" style={{textDecoration:"none",fontSize:"12px"}}>Full Terms →</a>
                </div>
              </>}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
