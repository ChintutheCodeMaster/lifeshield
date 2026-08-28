import type { MockAnswers } from "./state";

export type MockQuote = { name: string; price: number; tag: string };

export function money(n: number) {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function ageFromDob(dob?: unknown) {
  if (typeof dob !== "string" || !dob) return 35;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return 35;
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (365.25 * 24 * 3600 * 1000));
}

export function computeMockQuotes(a: MockAnswers): MockQuote[] {
  const age = ageFromDob(a.dob);
  const term = Number(a.term_length ?? 20);
  const coverage = Number(a.coverage_amount ?? 500000);
  const smokes = typeof a.tobacco === "string" && (a.tobacco as string).startsWith("current");
  const healthy = a.health_level === "above_average";

  const base = 8 + Math.max(0, age - 25) * 0.9;
  const termFactor = 1 + (term - 10) * 0.06;
  const coverageFactor = coverage / 250000;
  const smokerFactor = smokes ? 2.1 : 1;
  const healthFactor = healthy ? 0.85 : 1.15;
  const mid = base * termFactor * coverageFactor * smokerFactor * healthFactor;

  return [
    { name: "MintChoice® Term", price: +(mid * 0.92).toFixed(2), tag: "Best value" },
    { name: "Everyday Term Plus", price: +mid.toFixed(2), tag: "Most popular" },
    { name: "Guaranteed Level Term", price: +(mid * 1.14).toFixed(2), tag: "Extra flexibility" },
  ];
}
