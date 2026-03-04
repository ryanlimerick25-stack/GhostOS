import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { clerkClient } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    if (userId) {
      // Update Supabase
      await supabase.from("users").upsert({
        user_id: userId,
        stripe_customer_id: session.customer as string,
        is_pro: true,
        pro_since: new Date().toISOString(),
      });
      // Update Clerk publicMetadata so frontend can read it
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        publicMetadata: { is_pro: true },
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    // Update Supabase
    const { data } = await supabase
      .from("users")
      .update({ is_pro: false })
      .eq("stripe_customer_id", sub.customer as string)
      .select("user_id")
      .single();
    // Update Clerk publicMetadata
    if (data?.user_id) {
      const client = await clerkClient();
      await client.users.updateUserMetadata(data.user_id, {
        publicMetadata: { is_pro: false },
      });
    }
  }

  return Response.json({ received: true });
}
