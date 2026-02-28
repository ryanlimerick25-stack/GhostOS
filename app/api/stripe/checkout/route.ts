import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const { userId, sessionClaims } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const email = (sessionClaims?.email as string) || undefined;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    customer_email: email,
    metadata: { userId },
  });

  return Response.json({ url: session.url });
}
