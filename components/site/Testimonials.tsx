"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { brand } from "@/lib/brand";

const quotes = [
  {
    name: "Carmen",
    role: "Policyholder since 2023",
    text: "My agent was very patient and explained my options thoroughly. He worked with me to find an affordable policy I could pay even on a fixed income.",
  },
  {
    name: "Jordan",
    role: "Policyholder since 2024",
    text: "Got approved online in under 20 minutes. No medical exam, no awkward calls — just clear pricing and coverage that made sense for our family.",
  },
  {
    name: "Priya",
    role: "Policyholder since 2022",
    text: "The whole thing felt honest. No pressure, no upselling. When my premium came in $12 lower than the quote, I knew I'd picked the right company.",
  },
  {
    name: "Marcus",
    role: "Policyholder since 2021",
    text: `Buying life insurance always felt intimidating. ${brand.name} made it feel like just another Sunday errand. Peace of mind, sorted.`,
  },
  {
    name: "Elena",
    role: "Policyholder since 2025",
    text: `As a small business owner, I needed something flexible. ${brand.name}'s 20-year term is protecting both my family and my company. Couldn't be happier.`,
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const q = quotes[i];
  return (
    <section className="mx-auto max-w-4xl px-6 py-20 md:py-28 text-center">
      <div className="text-xs font-semibold uppercase tracking-widest text-mint-600 mb-6">
        What our policyholders say
      </div>
      <blockquote className="min-h-[140px] transition-opacity">
        <p className="font-display text-2xl md:text-3xl leading-snug italic text-ink-700">
          &ldquo;{q.text}&rdquo;
        </p>
      </blockquote>
      <div className="mt-8 flex flex-col items-center gap-1">
        <div className="w-12 h-12 rounded-full bg-mint-200 flex items-center justify-center font-bold text-mint-800">
          {q.name.charAt(0)}
        </div>
        <div className="font-semibold text-ink-900 mt-2">{q.name}</div>
        <div className="text-sm text-ink-500">{q.role}</div>
      </div>
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={() => setI((v) => (v - 1 + quotes.length) % quotes.length)}
          className="rounded-full border border-ink-300/40 p-2 hover:bg-mint-100 hover:border-mint-300 transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex gap-2">
          {quotes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Go to testimonial ${idx + 1}`}
              className={cn(
                "h-2 rounded-full transition-all",
                idx === i ? "bg-mint-600 w-6" : "bg-ink-300/40 w-2 hover:bg-mint-300",
              )}
            />
          ))}
        </div>
        <button
          onClick={() => setI((v) => (v + 1) % quotes.length)}
          className="rounded-full border border-ink-300/40 p-2 hover:bg-mint-100 hover:border-mint-300 transition-colors"
          aria-label="Next"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}
