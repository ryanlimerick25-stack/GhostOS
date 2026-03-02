import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ is_pro: false });

  const { data } = await supabase
    .from("users")
    .select("is_pro, stripe_customer_id")
    .eq("user_id", userId)
    .single();

  return Response.json({ is_pro: data?.is_pro || false });
}
