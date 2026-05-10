"use client";
import { useEffect } from "react";

const LIGHT_STYLES = `
  html[data-theme="light"], html[data-theme="light"] body {
    background: #f0eff5 !important;
    color: rgba(10,8,20,0.9) !important;
  }
  html[data-theme="light"] * {
    border-color: rgba(0,0,0,0.08) !important;
  }
  html[data-theme="light"] canvas { opacity: 0.1 !important; }

  /* NAV */
  html[data-theme="light"] nav {
    background: rgba(240,239,245,0.95) !important;
    border-bottom-color: rgba(0,0,0,0.08) !important;
  }

  /* Force all text dark — then re-allow exceptions */
  html[data-theme="light"] h1,
  html[data-theme="light"] h2,
  html[data-theme="light"] h3,
  html[data-theme="light"] h4,
  html[data-theme="light"] h5,
  html[data-theme="light"] h6,
  html[data-theme="light"] p,
  html[data-theme="light"] span,
  html[data-theme="light"] li,
  html[data-theme="light"] a,
  html[data-theme="light"] button,
  html[data-theme="light"] label,
  html[data-theme="light"] div {
    color: rgba(10,8,20,0.85) !important;
  }

  /* Muted text elements */
  html[data-theme="light"] .nav-link,
  html[data-theme="light"] .nav-user,
  html[data-theme="light"] .welcome-sub,
  html[data-theme="light"] .stat-sub,
  html[data-theme="light"] .audit-deal,
  html[data-theme="light"] .audit-date,
  html[data-theme="light"] .stat-label,
  html[data-theme="light"] .detail-card-label,
  html[data-theme="light"] .detail-section-label,
  html[data-theme="light"] .empty-sub,
  html[data-theme="light"] .pd-email,
  html[data-theme="light"] .pd-stat-label,
  html[data-theme="light"] .settings-sub,
  html[data-theme="light"] .settings-section-title,
  html[data-theme="light"] .footer-link {
    color: rgba(10,8,20,0.4) !important;
  }

  /* Keep white text on gradient/purple buttons */
  html[data-theme="light"] .nav-primary,
  html[data-theme="light"] .btn-primary,
  html[data-theme="light"] .nav-audit,
  html[data-theme="light"] .profile-btn {
    color: #fff !important;
  }
  html[data-theme="light"] a[style*="background: linear-gradient"],
  html[data-theme="light"] button[style*="background: linear-gradient"],
  html[data-theme="light"] div[style*="background: linear-gradient"],
  html[data-theme="light"] a[style*="background:linear-gradient"],
  html[data-theme="light"] button[style*="background:linear-gradient"] {
    color: #fff !important;
  }
  html[data-theme="light"] a[style*="background: linear-gradient"] *,
  html[data-theme="light"] button[style*="background: linear-gradient"] *,
  html[data-theme="light"] a[style*="background:linear-gradient"] *,
  html[data-theme="light"] button[style*="background:linear-gradient"] * {
    color: #fff !important;
  }

  /* Keep score colors */
  html[data-theme="light"] .audit-score { color: inherit !important; }

  /* Purple accents stay purple */
  html[data-theme="light"] .welcome-label,
  html[data-theme="light"] .nav-dot { color: #7c3aed !important; }
  html[data-theme="light"] .nav-dot { background: #7c3aed !important; }

  /* Backgrounds */
  html[data-theme="light"] .page,
  html[data-theme="light"] .audit-detail { background: #f0eff5 !important; }
  html[data-theme="light"] .stat-card,
  html[data-theme="light"] .audit-card,
  html[data-theme="light"] .detail-card,
  html[data-theme="light"] .empty-state,
  html[data-theme="light"] .tag {
    background: rgba(0,0,0,0.04) !important;
    border-color: rgba(0,0,0,0.08) !important;
  }
  html[data-theme="light"] .profile-dropdown,
  html[data-theme="light"] .modal { 
    background: #ffffff !important; 
    border-color: rgba(0,0,0,0.1) !important;
    box-shadow: 0 16px 48px rgba(0,0,0,0.12) !important;
  }
  html[data-theme="light"] .modal-backdrop {
    background: rgba(160,158,180,0.5) !important;
  }
  html[data-theme="light"] .pd-divider,
  html[data-theme="light"] .settings-divider { background: rgba(0,0,0,0.07) !important; }
  html[data-theme="light"] .progress-bar-wrap { background: rgba(0,0,0,0.08) !important; }
  html[data-theme="light"] .legal-block { 
    background: rgba(0,0,0,0.03) !important; 
    border-color: rgba(0,0,0,0.07) !important; 
  }

  /* Inputs */
  html[data-theme="light"] input,
  html[data-theme="light"] select,
  html[data-theme="light"] textarea {
    background: rgba(0,0,0,0.04) !important;
    border-color: rgba(0,0,0,0.1) !important;
    color: rgba(10,8,20,0.9) !important;
  }
  html[data-theme="light"] input::placeholder { color: rgba(10,8,20,0.3) !important; }

  /* Settings tabs */
  html[data-theme="light"] .settings-tab.active { color: #7c3aed !important; border-bottom-color: #7c3aed !important; }

  /* Plan badges */
  html[data-theme="light"] .pd-plan.free { background: rgba(124,58,237,0.1) !important; color: #7c3aed !important; }
  html[data-theme="light"] .pd-plan.pro { background: rgba(34,197,94,0.1) !important; color: #16a34a !important; }

  /* Nav buttons */
  html[data-theme="light"] .nav-ghost { 
    background: rgba(0,0,0,0.05) !important; 
    border-color: rgba(0,0,0,0.12) !important; 
    color: rgba(10,8,20,0.75) !important; 
  }
  html[data-theme="light"] .nav-signout { 
    background: rgba(0,0,0,0.04) !important; 
    border-color: rgba(0,0,0,0.1) !important; 
    color: rgba(10,8,20,0.5) !important; 
  }
  html[data-theme="light"] .nav-logo { color: rgba(10,8,20,0.9) !important; }
`;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const saved = localStorage.getItem("ghostos-theme") || "dark";
    document.documentElement.setAttribute("data-theme", saved);

    // Inject style tag if not already present
    if (!document.getElementById("ghostos-theme-styles")) {
      const style = document.createElement("style");
      style.id = "ghostos-theme-styles";
      style.textContent = LIGHT_STYLES;
      document.head.appendChild(style);
    }
  }, []);

  return <>{children}</>;
}
