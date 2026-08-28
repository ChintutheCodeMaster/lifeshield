"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readAnswers } from "@/lib/funnel-mock/state";
import { computeMockQuotes, money, type MockQuote } from "@/lib/funnel-mock/quotes";
import { brand } from "@/lib/brand";

export function ResultsF2() {
  const [ready, setReady] = useState(false);
  const [quotes, setQuotes] = useState<MockQuote[]>([]);
  const [firstName, setFirstName] = useState<string | undefined>();
  const [term, setTerm] = useState(20);
  const [coverage, setCoverage] = useState(500000);
  const [phone, setPhone] = useState<string | undefined>();

  useEffect(() => {
    const a = readAnswers("f2");
    setQuotes(computeMockQuotes(a));
    setFirstName(typeof a.first_name === "string" ? (a.first_name as string) : undefined);
    setTerm(Number(a.term_length ?? 20));
    setCoverage(Number(a.coverage_amount ?? 500000));
    setPhone(typeof a.phone === "string" ? (a.phone as string) : undefined);
    const t = setTimeout(() => setReady(true), 800);
    return () => clearTimeout(t);
  }, []);

  if (!ready) {
    return (
      <div className="rounded-3xl bg-white border border-mint-100 shadow-[0_20px_60px_-24px_rgba(31,93,66,0.25)] p-12 text-center">
        <div className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-mint-500 animate-pulse" />
          <span className="h-3 w-3 rounded-full bg-mint-500 animate-pulse [animation-delay:120ms]" />
          <span className="h-3 w-3 rounded-full bg-mint-500 animate-pulse [animation-delay:240ms]" />
        </div>
        <div className="mt-4 text-sm text-ink-500">Building your quotes…</div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white border border-mint-100 shadow-[0_20px_60px_-24px_rgba(31,93,66,0.25)] px-6 md:px-10 py-8 animate-fade-in">
      <h2 className="font-display text-xl md:text-2xl font-semibold text-ink-900">
        {firstName ? `${firstName}, here are` : "Here are"} your quotes
      </h2>
      <p className="mt-1 text-sm text-ink-500">
        {term}-year term · up to {money(coverage)} coverage
      </p>
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-mint-100 text-mint-800 text-xs font-medium px-3 py-1.5">
        A licensed agent will call {phone ? `you at ${phone}` : brand.phone} shortly.
      </p>

      <div className="mt-6 divide-y divide-mint-100">
        {quotes.map((q, i) => (
          <div key={q.name} className="py-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-ink-900">{q.name}</div>
              <div className="text-[10px] text-mint-700 uppercase tracking-widest font-semibold">
                {i === 1 ? "Recommended" : q.tag}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xl font-bold text-ink-900 tabular-nums">
                  {money(q.price)}
                </div>
                <div className="text-[10px] text-ink-500 uppercase tracking-wider">
                  per month
                </div>
              </div>
              <button className="rounded-full bg-mint-500 hover:bg-mint-600 text-white text-xs font-semibold uppercase tracking-wider px-4 py-2 transition-colors">
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="text-xs text-ink-500 hover:text-mint-700 underline">
          Back to home
        </Link>
      </div>
    </div>
  );
}
