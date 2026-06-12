"use client";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div style={{minHeight:"100vh",background:"#04040a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"DM Sans,sans-serif",padding:"24px"}}>
      <div style={{marginBottom:"32px",textAlign:"center"}}>
        <a href="/" style={{display:"inline-flex",alignItems:"center",gap:"8px",textDecoration:"none",marginBottom:"24px"}}>
          <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#a78bfa",boxShadow:"0 0 10px #a78bfa"}} />
          <span style={{fontFamily:"Playfair Display,serif",fontSize:"22px",fontWeight:700,color:"rgba(255,255,255,0.9)"}}>GhostOS</span>
        </a>
        <h1 style={{fontSize:"28px",fontWeight:700,color:"rgba(255,255,255,0.93)",margin:"0 0 8px",letterSpacing:"-0.02em"}}>Create your account</h1>
        <p style={{fontSize:"15px",color:"rgba(255,255,255,0.35)",margin:0}}>Start finding out what brands should pay you</p>
      </div>
      <SignUp
        forceRedirectUrl={typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("redirect_url") || "/audit" : "/audit"}
        appearance={{
          variables: {
            colorPrimary: "#a78bfa",
            colorBackground: "#0d0d18",
            colorText: "rgba(255,255,255,0.9)",
            colorTextSecondary: "rgba(255,255,255,0.45)",
            colorInputBackground: "rgba(255,255,255,0.04)",
            colorInputText: "rgba(255,255,255,0.9)",
            borderRadius: "12px",
            fontFamily: "DM Sans, sans-serif",
          },
          elements: {
            rootBox: { width: "100%", maxWidth: "420px" },
            card: { background: "#0d0d18", border: "none", borderRadius: "20px", boxShadow: "none", padding: "32px" },
            headerTitle: { display: "none" },
            headerSubtitle: { display: "none" },
            socialButtonsBlockButton: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)", borderRadius: "10px" },
            socialButtonsBlockButtonText: { color: "rgba(255,255,255,0.8)" },
            dividerLine: { background: "rgba(255,255,255,0.08)" },
            dividerText: { color: "rgba(255,255,255,0.25)" },
            formFieldLabel: { color: "rgba(255,255,255,0.5)", fontSize: "13px" },
            formFieldInput: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.9)", borderRadius: "10px" },
            formButtonPrimary: { background: "linear-gradient(135deg,#a78bfa,#818cf8)", borderRadius: "10px", fontSize: "15px", fontWeight: "600" },
            footerActionLink: { color: "#a78bfa" },
            footerActionText: { color: "rgba(255,255,255,0.35)" },
          }
        }}
      />
    </div>
  );
}
