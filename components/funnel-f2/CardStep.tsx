"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Step } from "@/lib/funnel/steps";
import { readAnswers, writeAnswers } from "@/lib/funnel-mock/state";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Props = {
  step: Step;
  index: number;
  total: number;
  nextHref: string;
  prevHref?: string;
};

type DobShape = { m: string; d: string; y: string };

function initial(step: Step, existing: unknown) {
  switch (step.type) {
    case "multi-tiles":
      return { multi: Array.isArray(existing) ? (existing as string[]) : [] };
    case "single-buttons":
    case "select":
      return { single: typeof existing === "string" ? existing : "" };
    case "text":
    case "email":
    case "phone":
      return { text: typeof existing === "string" ? existing : "" };
    case "dob":
      if (typeof existing === "string" && /^\d{4}-\d{2}-\d{2}$/.test(existing)) {
        const [y, m, d] = existing.split("-");
        return { dob: { m, d, y } as DobShape };
      }
      return { dob: { m: "", d: "", y: "" } as DobShape };
    default:
      return {};
  }
}

export function CardStep({ step, index, total, nextHref, prevHref }: Props) {
  const router = useRouter();
  const [multi, setMulti] = useState<string[]>([]);
  const [single, setSingle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [dob, setDob] = useState<DobShape>({ m: "", d: "", y: "" });

  useEffect(() => {
    const a = readAnswers("f2");
    const existing = step.field ? a[step.field] : undefined;
    const init = initial(step, existing);
    if ("multi" in init && init.multi) setMulti(init.multi);
    if ("single" in init && init.single !== undefined) setSingle(init.single);
    if ("text" in init && init.text !== undefined) setText(init.text);
    if ("dob" in init && init.dob) setDob(init.dob);
  }, [step]);

  const canNext = useMemo(() => {
    if (step.optional) return true;
    switch (step.type) {
      case "multi-tiles": return multi.length > 0;
      case "single-buttons":
      case "select": return single.length > 0;
      case "text": return text.trim().length > 0;
      case "phone": return text.replace(/\D/g, "").length >= 10;
      case "email": return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(text.trim());
      case "dob": {
        const m = +dob.m, d = +dob.d, y = +dob.y;
        return m >= 1 && m <= 12 && d >= 1 && d <= 31 && y >= 1900 && y <= new Date().getFullYear();
      }
      case "interstitial": return true;
      default: return false;
    }
  }, [step, multi, single, text, dob]);

  function persistAndNext(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!canNext) return;
    if (step.field) {
      let val: unknown = null;
      switch (step.type) {
        case "multi-tiles": val = multi; break;
        case "single-buttons":
        case "select": val = single; break;
        case "text":
        case "email": val = text.trim(); break;
        case "phone": val = text.replace(/\D/g, ""); break;
        case "dob":
          val = `${dob.y.padStart(4, "0")}-${dob.m.padStart(2, "0")}-${dob.d.padStart(2, "0")}`;
          break;
      }
      writeAnswers("f2", { [step.field]: val });
    }
    router.push(nextHref);
  }

  const pct = Math.max(4, Math.round(((index + 1) / total) * 100));

  return (
    <form onSubmit={persistAndNext} className="animate-fade-in">
      <div className="relative rounded-3xl bg-white border border-mint-100 shadow-[0_20px_60px_-24px_rgba(31,93,66,0.25)] overflow-hidden">
        <div className="h-1.5 w-full bg-mint-50">
          <div
            className="h-full bg-gradient-to-r from-mint-400 to-mint-600 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="px-6 md:px-10 pt-7 pb-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-50 border border-mint-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-mint-700">
              <span className="h-1.5 w-1.5 rounded-full bg-mint-500" />
              Question {index + 1}
              <span className="text-mint-400 font-normal">/ {total}</span>
            </span>
            {step.optional && (
              <span className="text-[10px] uppercase tracking-widest text-ink-500">
                Optional
              </span>
            )}
          </div>

          <h2 className="font-display text-xl md:text-2xl font-semibold text-ink-900 leading-snug">
            {step.title}
          </h2>
          {step.subtitle && (
            <p className="mt-2 text-sm text-ink-500 leading-relaxed">{step.subtitle}</p>
          )}

          <div className="mt-6">
            {step.type === "multi-tiles" && (
              <CheckboxList options={step.options ?? []} value={multi} onChange={setMulti} />
            )}
            {step.type === "single-buttons" && (
              <RadioList options={step.options ?? []} value={single} onChange={setSingle} />
            )}
            {step.type === "select" && (
              <select
                value={single}
                onChange={(e) => setSingle(e.target.value)}
                className="w-full rounded-xl border border-ink-300/60 bg-mint-50/30 px-4 py-3 text-base text-ink-900 focus:outline-none focus:border-mint-500 focus:bg-white focus:ring-2 focus:ring-mint-500/20"
              >
                <option value="">Select an option…</option>
                {(step.options ?? []).map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            )}
            {step.type === "text" && (
              <input
                type="text"
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your answer"
                className="w-full rounded-xl border border-ink-300/60 bg-mint-50/30 px-4 py-3 text-base text-ink-900 placeholder-ink-500/60 focus:outline-none focus:border-mint-500 focus:bg-white focus:ring-2 focus:ring-mint-500/20"
              />
            )}
            {step.type === "email" && (
              <input
                type="email"
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-ink-300/60 bg-mint-50/30 px-4 py-3 text-base text-ink-900 placeholder-ink-500/60 focus:outline-none focus:border-mint-500 focus:bg-white focus:ring-2 focus:ring-mint-500/20"
              />
            )}
            {step.type === "phone" && (
              <input
                type="tel"
                inputMode="tel"
                autoFocus
                value={formatPhone(text)}
                onChange={(e) => setText(e.target.value)}
                placeholder="(201) 555-0123"
                className="w-full rounded-xl border border-ink-300/60 bg-mint-50/30 px-4 py-3 text-base text-ink-900 placeholder-ink-500/60 focus:outline-none focus:border-mint-500 focus:bg-white focus:ring-2 focus:ring-mint-500/20"
              />
            )}
            {step.type === "dob" && <DobRow value={dob} onChange={setDob} />}
            {step.type === "interstitial" && (
              <div className="rounded-xl bg-mint-50 border border-mint-100 px-4 py-3 text-sm text-mint-800">
                Tap <strong>Continue</strong> to keep going.
              </div>
            )}
          </div>
        </div>

        <div className="px-6 md:px-10 py-4 border-t border-mint-100 bg-gradient-to-b from-white to-mint-50/40 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => prevHref && router.push(prevHref)}
            disabled={!prevHref}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border border-ink-300/60 bg-white px-4 py-2 text-sm font-semibold text-ink-700 hover:border-mint-400 hover:text-mint-700 transition-colors",
              !prevHref && "opacity-40 cursor-not-allowed",
            )}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <button
            type="submit"
            disabled={!canNext}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full bg-mint-500 hover:bg-mint-600 text-white px-5 py-2 text-sm font-semibold shadow-sm transition-colors",
              !canNext && "opacity-40 cursor-not-allowed hover:bg-mint-500",
            )}
          >
            {step.type === "interstitial" ? "Continue" : "Next"} <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </form>
  );
}

function CheckboxList({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((o) => {
        const on = value.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() =>
              onChange(on ? value.filter((v) => v !== o.value) : [...value, o.value])
            }
            className={cn(
              "flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all",
              on
                ? "border-mint-500 bg-mint-50 text-ink-900 ring-2 ring-mint-500/30"
                : "border-ink-300/50 bg-white hover:border-mint-400 hover:bg-mint-50/60 text-ink-700",
            )}
          >
            <span
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-md border-2 shrink-0",
                on ? "border-mint-500 bg-mint-500" : "border-ink-300",
              )}
            >
              {on && <span className="h-1.5 w-1.5 bg-white rounded-[1px]" />}
            </span>
            <span>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function RadioList({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((o) => {
        const on = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all",
              on
                ? "border-mint-500 bg-mint-50 text-ink-900 ring-2 ring-mint-500/30"
                : "border-ink-300/50 bg-white hover:border-mint-400 hover:bg-mint-50/60 text-ink-700",
            )}
          >
            <span
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-full border-2 shrink-0",
                on ? "border-mint-500 bg-mint-500" : "border-ink-300",
              )}
            >
              {on && <span className="h-1.5 w-1.5 bg-white rounded-full" />}
            </span>
            <span>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function DobRow({
  value,
  onChange,
}: {
  value: { m: string; d: string; y: string };
  onChange: (v: { m: string; d: string; y: string }) => void;
}) {
  function set(k: "m" | "d" | "y", raw: string, max: number) {
    const digits = raw.replace(/\D/g, "").slice(0, max);
    onChange({ ...value, [k]: digits });
  }
  return (
    <div className="grid grid-cols-3 gap-3 max-w-sm">
      <input
        placeholder="MM"
        inputMode="numeric"
        value={value.m}
        onChange={(e) => set("m", e.target.value, 2)}
        className="rounded-xl border border-ink-300/60 bg-mint-50/30 px-3 py-3 text-center text-base text-ink-900 focus:outline-none focus:border-mint-500 focus:bg-white focus:ring-2 focus:ring-mint-500/20"
      />
      <input
        placeholder="DD"
        inputMode="numeric"
        value={value.d}
        onChange={(e) => set("d", e.target.value, 2)}
        className="rounded-xl border border-ink-300/60 bg-mint-50/30 px-3 py-3 text-center text-base text-ink-900 focus:outline-none focus:border-mint-500 focus:bg-white focus:ring-2 focus:ring-mint-500/20"
      />
      <input
        placeholder="YYYY"
        inputMode="numeric"
        value={value.y}
        onChange={(e) => set("y", e.target.value, 4)}
        className="rounded-xl border border-ink-300/60 bg-mint-50/30 px-3 py-3 text-center text-base text-ink-900 focus:outline-none focus:border-mint-500 focus:bg-white focus:ring-2 focus:ring-mint-500/20"
      />
    </div>
  );
}

function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
