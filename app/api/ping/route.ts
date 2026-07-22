import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET() {
  try {
    const { error } = await supabase
      .from("audits")
      .select("id", { count: "exact", head: true });

    if (error) {
      console.error("PING_DB_ERROR:", error);
      return Response.json({ ok: false, db: false, ts: Date.now() }, { status: 500 });
    }

    return Response.json({ ok: true, db: true, ts: Date.now() });
  } catch (err) {
    console.error("PING_ERROR:", err);
    return Response.json({ ok: false, db: false, ts: Date.now() }, { status: 500 });
  }
}
