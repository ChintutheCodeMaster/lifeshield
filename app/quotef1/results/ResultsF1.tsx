"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readAnswers } from "@/lib/funnel-mock/state";
import { computeMockQuotes, money, type MockQuote } from "@/lib/funnel-mock/quotes";
import { brand } from "@/lib/brand";

export function ResultsF1() {
  const [ready, setReady] = useState(false);
  const [quotes, setQuotes] = useState<MockQuote[]>([]);
  const [firstName, setFirstName] = useState<string | undefined>();
  const [term, setTerm] = useState(20);
  const [coverage, setCoverage] = useState(500000);
  const [phone, setPhone] = useState<string | undefined>();

  useEffect(() => {
    const a = readAnswers("f1");
    setQuotes(computeMockQuotes(a));
    setFirstName(typeof a.first_name === "string" ? (a.first_name as string) : undefined);
    setTerm(Number(a.term_length ?? 20));
    setCoverage(Number(a.coverage_amount ?? 500000));
    setPhone(typeof a.phone === "string" ? (a.phone as string) : undefined);
    const t = setTimeout(() => setReady(true), 900);
    return () => clearTimeout(t);
  }, []);

  if (!ready) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="inline-flex items-center gap-3">
          <span className="w-4 h-4 rounded-full bg-mint-500 animate-pulse" />
          <span className="w-4 h-4 rounded-full bg-mint-500 animate-pulse [animation-delay:120ms]" />
          <span className="w-4 h-4 rounded-full bg-mint-500 animate-pulse [animation-delay:240ms]" />
        </div>
        <h2 className="mt-6 font-display text-2xl md:text-3xl font-semibold text-mint-800">
          Almost there — building your personalized quotes
        </h2>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-ink-900 leading-tight">
        {firstName ? `${firstName}, here are` : "Here are"} your quotes
      </h1>
      <p className="mt-3 text-ink-500">
        {term}-year term · up to {money(coverage)} coverage
      </p>
      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-mint-100 text-mint-800 text-xs font-medium px-3 py-1.5">
        A licensed agent will call {phone ? `you at ${phone}` : brand.phone} to
        confirm pricing.
      </div>

      <div className="mt-10 grid md:grid-cols-3 gap-5">
        {quotes.map((q, i) => {
          const featured = i === 1;
          return (
            <div
              key={q.name}
              className={
                "relative rounded-2xl bg-white p-6 border shadow-sm hover:shadow-lg transition " +
                (featured ? "border-mint-500 ring-1 ring-mint-500/40" : "border-ink-300/40")
              }
            >
              {featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-mint-500 text-white text-xs font-semibold px-3 py-1 shadow">
                  {q.tag}
                </div>
              )}
              <div className="font-display text-lg font-semibold text-mint-800">
                {q.name}
              </div>
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

      <div className="mt-8">
        <Link href="/" className="text-sm text-ink-500 hover:text-mint-700 underline">
          Back to home
        </Link>
      </div>
    </div>
  );
}
