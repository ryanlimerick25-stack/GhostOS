"use client";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  return (
    <div style={{ background: "#04040a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)", fontFamily: "DM Sans, sans-serif" }}>
      <AuthenticateWithRedirectCallback />
      <p>Signing you in...</p>
    </div>
  );
}
