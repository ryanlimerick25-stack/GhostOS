import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div style={{minHeight:"100vh",background:"#04040a",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <SignIn 
        appearance={{
          elements: {
            rootBox: { width: "100%", maxWidth: "440px" },
            card: { background: "#0d0d14", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px" },
            headerTitle: { color: "rgba(255,255,255,0.9)" },
            headerSubtitle: { color: "rgba(255,255,255,0.4)" },
            formButtonPrimary: { background: "linear-gradient(135deg,#a78bfa,#818cf8)", color: "#fff" },
            formFieldInput: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.9)" },
            formFieldLabel: { color: "rgba(255,255,255,0.5)" },
            footerActionLink: { color: "#a78bfa" },
            dividerLine: { background: "rgba(255,255,255,0.08)" },
            dividerText: { color: "rgba(255,255,255,0.3)" },
          }
        }}
      />
    </div>
  );
}
