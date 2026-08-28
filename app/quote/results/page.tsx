import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionId } from "@/lib/funnel/session";
import { createAdmin } from "@/lib/supabase/admin";
import { StepShell } from "@/components/funnel/StepShell";
import { steps } from "@/lib/funnel/steps";
import { brand } from "@/lib/brand";
import { ResultsReveal } from "./ResultsReveal";

function money(n: number) {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function computeQuotes(term: number, coverage: number, age: number, smokes: boolean, healthy: boolean) {
  // Deterministic mock — not a real pricing model.
  const base = 8 + Math.max(0, age - 25) * 0.9;
  const termFactor = 1 + (term - 10) * 0.06;
  const coverageFactor = coverage / 250000;
  const smokerFactor = smokes ? 2.1 : 1;
  const healthFactor = healthy ? 0.85 : 1.15;
  const mid = base * termFactor * coverageFactor * smokerFactor * healthFactor;
  return [
    { name: "MintChoice® Term", price: +(mid * 0.92).toFixed(2), tag: "Best value" },
    { name: "Everyday Term Plus", price: +(mid).toFixed(2), tag: "Most popular" },
    { name: "Guaranteed Level Term", price: +(mid * 1.14).toFixed(2), tag: "Extra flexibility" },
  ];
}

export default async function ResultsPage() {
  const sessionId = await getSessionId();
  if (!sessionId) redirect("/quote");

  const supabase = createAdmin();
  const { data: lead } = await supabase
    .from("leads")
    .select("*")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (!lead || !lead.is_complete) redirect("/quote");

  const now = new Date();
  const dob = lead.dob ? new Date(lead.dob as string) : null;
  const age = dob ? Math.floor((now.getTime() - dob.getTime()) / (365.25 * 24 * 3600 * 1000)) : 35;
  const term = Number(lead.term_length ?? 20);
  const coverage = Number(lead.coverage_amount ?? 500000);
  const smokes = typeof lead.tobacco === "string" && lead.tobacco.startsWith("current");
  const healthy = lead.health_level === "above_average";

  const quotes = computeQuotes(term, coverage, age, smokes, healthy);
  const total = steps.length + 2;

  return (
    <StepShell progress={100} index={total - 1} total={total}>
      <ResultsReveal>
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-mint-900 leading-tight">
            {lead.first_name ? `${lead.first_name}, here are` : "Here are"} your personalized options
          </h2>
          <p className="mt-3 text-ink-500">
            {term}-year term · up to {money(coverage)} coverage
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-mint-100 text-mint-800 text-xs font-medium px-3 py-1.5">
            A licensed agent will call you at {lead.phone ?? brand.phone} shortly to confirm pricing.
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {quotes.map((q, i) => {
            const featured = i === 1;
            return (
              <div
                key={q.name}
                className={
                  "relative rounded-3xl bg-white p-7 border shadow-sm hover:shadow-lg transition " +
                  (featured ? "border-mint-500 ring-1 ring-mint-500/40" : "border-ink-300/20")
                }
              >
                {featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-mint-500 text-white text-xs font-semibold px-3 py-1 shadow">
                    {q.tag}
                  </div>
                )}
                <div className="font-display text-lg font-semibold text-mint-800">{q.name}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-ink-500">
                  {featured ? "Recommended" : q.tag}
                </div>
                <div className="mt-6 text-4xl font-bold text-ink-900">
                  {money(q.price)}
                  <span className="text-base text-ink-500 font-medium ml-1">/mo</span>
                </div>
                <ul className="mt-6 space-y-2 text-sm text-ink-700">
                  <li>✓ {term}-year level term</li>
                  <li>✓ Up to {money(coverage)} coverage</li>
                  <li>✓ No medical exam*</li>
                  <li>✓ Cancel anytime</li>
                </ul>
                <button className="mt-6 w-full rounded-full bg-mint-500 hover:bg-mint-600 text-white font-semibold py-2.5 transition-colors">
                  Apply Now
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-ink-500 hover:text-mint-700 underline">
            Back to home
          </Link>
        </div>
      </ResultsReveal>
    </StepShell>
  );
}
