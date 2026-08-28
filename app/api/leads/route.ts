import { NextResponse } from "next/server";
import { getOrCreateSessionId } from "@/lib/funnel/session";
import { leadPatchSchema } from "@/lib/funnel/schema";
import { createAdmin } from "@/lib/supabase/admin";
import { notifyLead } from "@/lib/email/notifyLead";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const patchInput = (body as { patch?: unknown })?.patch ?? {};
  const parsed = leadPatchSchema.safeParse(patchInput);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid patch", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const patch = parsed.data;

  const sessionId = await getOrCreateSessionId();
  const isComplete = !!patch.consent_at;

  const supabase = createAdmin();
  const row = {
    session_id: sessionId,
    ...patch,
    ...(isComplete ? { is_complete: true } : {}),
  };

  const { data, error } = await supabase
    .from("leads")
    .upsert(row, { onConflict: "session_id" })
    .select()
    .single();

  if (error) {
    console.error("[leads upsert]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (isComplete) {
    notifyLead(data as Parameters<typeof notifyLead>[0]).catch((e) =>
      console.error("[notifyLead]", e),
    );
  }

  return NextResponse.json({ ok: true, sessionId });
}
