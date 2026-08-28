import Link from "next/link";
import { redirect } from "next/navigation";
import { createServer } from "@/lib/supabase/server";
import { createAdmin } from "@/lib/supabase/admin";
import { SignOutButton } from "./SignOutButton";

async function requireAdmin() {
  const supabase = await createServer();
  const { data: userRes } = await supabase.auth.getUser();
  if (!userRes.user) redirect("/admin/login");
  const admin = createAdmin();
  const { data } = await admin
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userRes.user.id)
    .maybeSingle();
  if (!data) redirect("/admin/login?forbidden=1");
  return userRes.user;
}

function fmt(v: unknown) {
  if (v == null || v === "") return "—";
  if (Array.isArray(v)) return v.join(", ");
  return String(v);
}

export default async function AdminHome({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  await requireAdmin();
  const { view } = await searchParams;
  const showAll = view === "all";

  const admin = createAdmin();
  let q = admin
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (!showAll) q = q.eq("is_complete", true);
  const { data: leads, error } = await q;

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-ink-300/30 bg-white">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Link href="/admin" className="flex items-baseline gap-1">
            <span className="text-xl font-display font-bold text-mint-800">Mint</span>
            <span className="text-xl font-display font-light text-mint-500">Life</span>
            <span className="ml-2 text-xs font-semibold uppercase tracking-widest text-ink-500">Admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="/api/leads/export"
              className="text-sm font-medium rounded-full border border-ink-300/40 px-4 py-2 hover:bg-mint-50 transition-colors"
            >
              Export CSV
            </a>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-mint-900">Leads</h1>
            <p className="text-sm text-ink-500 mt-1">
              {leads?.length ?? 0} {showAll ? "total (including partial)" : "completed"} leads
            </p>
          </div>
          <div className="flex text-sm">
            <Link
              href="/admin"
              className={`px-4 py-2 rounded-l-full border ${!showAll ? "bg-mint-500 text-white border-mint-500" : "border-ink-300/40 bg-white"}`}
            >
              Completed
            </Link>
            <Link
              href="/admin?view=all"
              className={`px-4 py-2 rounded-r-full border-l-0 border ${showAll ? "bg-mint-500 text-white border-mint-500" : "border-ink-300/40 bg-white"}`}
            >
              All (incl. partial)
            </Link>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 text-red-800 p-4 mb-6 text-sm">
            {error.message}
          </div>
        )}

        <div className="rounded-2xl bg-white border border-ink-300/20 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-mint-50 text-mint-800 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">State</th>
                <th className="px-4 py-3 font-semibold">Term</th>
                <th className="px-4 py-3 font-semibold">Coverage</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-300/20">
              {(leads ?? []).map((l) => (
                <tr key={l.id as string} className="hover:bg-mint-50/40">
                  <td className="px-4 py-3 text-ink-500 whitespace-nowrap">
                    {new Date(l.created_at as string).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {fmt([l.first_name, l.last_name].filter(Boolean).join(" ") || null)}
                  </td>
                  <td className="px-4 py-3">{fmt(l.email)}</td>
                  <td className="px-4 py-3">{fmt(l.phone)}</td>
                  <td className="px-4 py-3">{fmt(l.state)}</td>
                  <td className="px-4 py-3">{fmt(l.term_length)}</td>
                  <td className="px-4 py-3">
                    {l.coverage_amount ? `$${Number(l.coverage_amount).toLocaleString()}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {l.is_complete ? (
                      <span className="inline-flex items-center rounded-full bg-mint-100 text-mint-800 text-xs font-semibold px-2.5 py-0.5">
                        Complete
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5">
                        Partial
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {(!leads || leads.length === 0) && (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-ink-500">
                    No leads yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
