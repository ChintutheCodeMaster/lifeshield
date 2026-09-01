import { NextResponse } from "next/server";
import { createServer } from "@/lib/supabase/server";
import { createAdmin } from "@/lib/supabase/admin";
import { brand } from "@/lib/brand";

export const runtime = "nodejs";

const COLUMNS = [
  "id","session_id","created_at","updated_at","is_complete","consent_at",
  "first_name","last_name","email","phone",
  "state","dob","sex_at_birth","tobacco","health_level",
  "tobacco_last_12mo","married","medical_treatment_5yr",
  "term_length","coverage_amount",
  "motivation","quotes_for","who_to_protect","children_count",
] as const;

function esc(v: unknown) {
  if (v == null) return "";
  const s = Array.isArray(v) ? v.join("; ") : String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET() {
  const supabase = await createServer();
  const { data: userRes } = await supabase.auth.getUser();
  if (!userRes.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const admin = createAdmin();
  const { data: adminRow } = await admin
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userRes.user.id)
    .maybeSingle();
  if (!adminRow) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { data: leads, error } = await admin
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const header = COLUMNS.join(",");
  const rows = (leads ?? []).map((r) =>
    COLUMNS.map((c) => esc((r as unknown as Record<string, unknown>)[c])).join(","),
  );
  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${brand.name.toLowerCase()}-leads-${new Date().toISOString().slice(0,10)}.csv"`,
    },
  });
}
