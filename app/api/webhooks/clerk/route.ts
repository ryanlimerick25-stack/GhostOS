import { Resend } from "resend";
import { headers } from "next/headers";
import { Webhook } from "svix";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) return Response.json({ error: "No webhook secret" }, { status: 500 });

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return Response.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: any;
  try {
    evt = wh.verify(body, { "svix-id": svix_id, "svix-timestamp": svix_timestamp, "svix-signature": svix_signature });
  } catch {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (evt.type === "user.created") {
    const { email_addresses, first_name } = evt.data;
    const email = email_addresses?.[0]?.email_address;
    const name = first_name || "Creator";

    if (email) {
      await resend.emails.send({
        from: "GhostOS <onboarding@resend.dev>",
        to: email,
        subject: "Welcome to GhostOS — here's how to get your first brand deal",
        html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>
  body { margin: 0; padding: 0; background: #04040a; font-family: 'Helvetica Neue', Arial, sans-serif; color: #e8e6e1; }
  .wrap { max-width: 560px; margin: 0 auto; padding: 48px 24px; }
  .logo { font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 40px; }
  .dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #a78bfa; margin-right: 6px; }
  h1 { font-size: 28px; font-weight: 700; color: #fff; line-height: 1.2; margin: 0 0 16px; letter-spacing: -0.02em; }
  p { font-size: 15px; color: rgba(255,255,255,0.55); line-height: 1.7; margin: 0 0 16px; }
  .highlight { color: rgba(255,255,255,0.85); }
  .btn { display: inline-block; margin: 24px 0; padding: 14px 32px; background: linear-gradient(135deg,#a78bfa,#818cf8); color: #fff; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 15px; }
  .steps { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 24px 28px; margin: 28px 0; }
  .step { display: flex; gap: 14px; margin-bottom: 18px; align-items: flex-start; }
  .step:last-child { margin-bottom: 0; }
  .step-num { width: 24px; height: 24px; border-radius: 50%; background: rgba(167,139,250,0.15); color: #a78bfa; font-size: 11px; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
  .step-text { font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.5; }
  .step-text strong { color: rgba(255,255,255,0.85); }
  .divider { height: 1px; background: rgba(255,255,255,0.06); margin: 32px 0; }
  .footer { font-size: 12px; color: rgba(255,255,255,0.2); line-height: 1.6; }
  .footer a { color: rgba(167,139,250,0.6); text-decoration: none; }
</style></head>
<body>
<div class="wrap">
  <div class="logo"><span class="dot"></span>GhostOS</div>
  <h1>Welcome, ${name}. Let's get you paid.</h1>
  <p>You just joined <span class="highlight">GhostOS</span> — the brand deal intelligence tool built for TikTok creators who are serious about monetizing their audience.</p>
  <p>Here's exactly what to do next:</p>
  <div class="steps">
    <div class="step">
      <div class="step-num">1</div>
      <div class="step-text"><strong>Open TikTok Analytics</strong> — go to your profile, tap Analytics, and note your 28-day average views and engagement rate.</div>
    </div>
    <div class="step">
      <div class="step-num">2</div>
      <div class="step-text"><strong>Run your free audit</strong> — enter your stats and get your brand deal readiness score, real rate card, and outreach templates in 30 seconds.</div>
    </div>
    <div class="step">
      <div class="step-num">3</div>
      <div class="step-text"><strong>Follow your action plan</strong> — your audit gives you a personalized 14-day plan. Creators who follow it land their first deal in under 2 weeks on average.</div>
    </div>
  </div>
  <a href="https://ghostos.live/audit" class="btn">Run Your Free Audit →</a>
  <p style="font-size:13px;color:rgba(255,255,255,0.3)">You get 3 free audits. No credit card required.</p>
  <div class="divider"></div>
  <div class="footer">
    You're receiving this because you signed up at ghostos.live.<br>
    <a href="https://ghostos.live">ghostos.live</a> · Questions? Reply to this email.
  </div>
</div>
</body>
</html>`,
      });
    }
  }

  return Response.json({ received: true });
}
