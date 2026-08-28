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

  return (
    <form onSubmit={persistAndNext} className="animate-fade-in">
      <div className="rounded-md bg-white shadow-md overflow-hidden">
        <div className="px-6 md:px-8 py-6 md:py-8">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-base md:text-lg font-semibold text-ink-900 leading-snug">
              {step.title}
              {!step.optional && step.type !== "interstitial" && (
                <span className="text-red-600 ml-1">*</span>
              )}
            </h2>
            <span className="text-xs text-ink-500 shrink-0 tabular-nums">
              Step {index + 1} of {total}
            </span>
          </div>
          {step.subtitle && (
            <p className="mt-2 text-sm text-ink-500 leading-relaxed">{step.subtitle}</p>
          )}

          <div className="mt-5">
            {step.type === "multi-tiles" && (
              <CheckboxList options={step.options ?? []} value={multi} onChange={setMulti} />
            )}
            {(step.type === "single-buttons") && (
              <RadioList options={step.options ?? []} value={single} onChange={setSingle} />
            )}
            {step.type === "select" && (
              <select
                value={single}
                onChange={(e) => setSingle(e.target.value)}
                className="w-full rounded border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-mint-600"
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
                className="w-full rounded border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-mint-600"
              />
            )}
            {step.type === "email" && (
              <input
                type="email"
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-mint-600"
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
                className="w-full rounded border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 focus:outline-none focus:border-mint-600"
              />
            )}
            {step.type === "dob" && <DobRow value={dob} onChange={setDob} />}
            {step.type === "interstitial" && (
              <p className="text-sm text-ink-500 italic">Click Next to continue.</p>
            )}
          </div>
        </div>

        <div className="bg-[#2563eb] px-6 md:px-8 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => prevHref && router.push(prevHref)}
            disabled={!prevHref}
            className={cn(
              "inline-flex items-center gap-2 text-white text-sm font-semibold uppercase tracking-wider",
              !prevHref && "opacity-40 cursor-not-allowed",
            )}
          >
            <ArrowLeft size={16} /> Prev
          </button>
          <button
            type="submit"
            disabled={!canNext}
            className={cn(
              "inline-flex items-center gap-2 text-white text-sm font-semibold uppercase tracking-wider",
              !canNext && "opacity-40 cursor-not-allowed",
            )}
          >
            Next <ArrowRight size={16} />
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
          <label
            key={o.value}
            className="flex items-center gap-2 text-sm text-ink-900 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={on}
              onChange={() =>
                onChange(on ? value.filter((v) => v !== o.value) : [...value, o.value])
              }
              className="h-4 w-4 accent-[#2563eb]"
            />
            {o.label}
          </label>
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
      {options.map((o) => (
        <label
          key={o.value}
          className="flex items-center gap-2 text-sm text-ink-900 cursor-pointer"
        >
          <input
            type="radio"
            checked={value === o.value}
            onChange={() => onChange(o.value)}
            className="h-4 w-4 accent-[#2563eb]"
          />
          {o.label}
        </label>
      ))}
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
    <div className="grid grid-cols-3 gap-2 max-w-sm">
      <input
        placeholder="MM"
        inputMode="numeric"
        value={value.m}
        onChange={(e) => set("m", e.target.value, 2)}
        className="rounded border border-ink-300 bg-white px-2 py-2 text-center text-sm text-ink-900 focus:outline-none focus:border-mint-600"
      />
      <input
        placeholder="DD"
        inputMode="numeric"
        value={value.d}
        onChange={(e) => set("d", e.target.value, 2)}
        className="rounded border border-ink-300 bg-white px-2 py-2 text-center text-sm text-ink-900 focus:outline-none focus:border-mint-600"
      />
      <input
        placeholder="YYYY"
        inputMode="numeric"
        value={value.y}
        onChange={(e) => set("y", e.target.value, 4)}
        className="rounded border border-ink-300 bg-white px-2 py-2 text-center text-sm text-ink-900 focus:outline-none focus:border-mint-600"
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
