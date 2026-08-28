"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Step } from "@/lib/funnel/steps";
import { writeAnswers, readAnswers } from "@/lib/funnel-mock/state";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

type Props = {
  groupTitle: string;
  groupSubtitle?: string;
  steps: Step[];
  next: string;
  backHref?: string;
};

type FieldState = Record<string, unknown>;

function initialForStep(step: Step, existing: unknown): unknown {
  switch (step.type) {
    case "multi-tiles":
      return Array.isArray(existing) ? existing : [];
    case "single-buttons":
    case "select":
      return typeof existing === "string" ? existing : "";
    case "text":
    case "email":
    case "phone":
      return typeof existing === "string" ? existing : "";
    case "dob":
      if (typeof existing === "string" && /^\d{4}-\d{2}-\d{2}$/.test(existing)) {
        const [y, m, d] = existing.split("-");
        return { m, d, y };
      }
      return { m: "", d: "", y: "" };
    default:
      return null;
  }
}

function isValid(step: Step, v: unknown, optional?: boolean): boolean {
  if (optional) return true;
  switch (step.type) {
    case "multi-tiles":
      return Array.isArray(v) && v.length > 0;
    case "single-buttons":
    case "select":
    case "text":
      return typeof v === "string" && v.trim().length > 0;
    case "email":
      return typeof v === "string" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim());
    case "phone":
      return typeof v === "string" && v.replace(/\D/g, "").length >= 10;
    case "dob": {
      const dv = v as { m: string; d: string; y: string };
      const m = +dv.m, d = +dv.d, y = +dv.y;
      return m >= 1 && m <= 12 && d >= 1 && d <= 31 && y >= 1900 && y <= new Date().getFullYear();
    }
    case "interstitial":
      return true;
    default:
      return false;
  }
}

function normalize(step: Step, v: unknown): unknown {
  if (step.type === "dob") {
    const dv = v as { m: string; d: string; y: string };
    return `${dv.y.padStart(4, "0")}-${dv.m.padStart(2, "0")}-${dv.d.padStart(2, "0")}`;
  }
  if (step.type === "phone") {
    return (v as string).replace(/\D/g, "");
  }
  if (typeof v === "string") return v.trim();
  return v;
}

export function GroupForm({ groupTitle, groupSubtitle, steps, next, backHref }: Props) {
  const router = useRouter();
  const [state, setState] = useState<FieldState>(() => {
    if (typeof window === "undefined") return {};
    const existing = readAnswers("f1");
    const init: FieldState = {};
    steps.forEach((s) => {
      if (s.field) init[s.id] = initialForStep(s, existing[s.field]);
      else init[s.id] = null;
    });
    return init;
  });

  const allValid = useMemo(() => {
    return steps.every((s) => isValid(s, state[s.id], s.optional));
  }, [state, steps]);

  function set(stepId: string, v: unknown) {
    setState((prev) => ({ ...prev, [stepId]: v }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!allValid) return;
    const patch: Record<string, unknown> = {};
    steps.forEach((s) => {
      if (!s.field) return;
      patch[s.field] = normalize(s, state[s.id]);
    });
    writeAnswers("f1", patch);
    router.push(next);
  }

  return (
    <form onSubmit={onSubmit} className="animate-fade-in">
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-mint-700 mb-4 transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </Link>
      )}
      <h1 className="font-display text-3xl md:text-4xl font-bold text-ink-900 leading-tight">
        {groupTitle}
      </h1>
      {groupSubtitle && (
        <p className="mt-3 text-ink-500 max-w-xl">{groupSubtitle}</p>
      )}

      <div className="mt-10 space-y-14">
        {steps.map((s, i) => (
          <QuestionBlock key={s.id} step={s} index={i + 1}>
            <StepInputF1
              step={s}
              value={state[s.id]}
              onChange={(v) => set(s.id, v)}
            />
          </QuestionBlock>
        ))}
      </div>

      <div className="mt-14 flex items-center gap-4">
        <button
          type="submit"
          disabled={!allValid}
          className={cn(
            "rounded-full bg-mint-500 hover:bg-mint-600 text-white font-semibold px-8 py-3 shadow-sm transition-colors",
            !allValid && "opacity-40 cursor-not-allowed",
          )}
        >
          Continue
        </button>
        <span className="text-xs text-ink-500">
          Your information is private and never sold.
        </span>
      </div>
    </form>
  );
}

function QuestionBlock({
  step,
  index,
  children,
}: {
  step: Step;
  index: number;
  children: React.ReactNode;
}) {
  if (step.type === "interstitial") {
    return (
      <div className="rounded-2xl border border-mint-200 bg-mint-50/70 p-6 md:p-7">
        <div className="font-display text-xl md:text-2xl font-semibold text-mint-800">
          {step.title}
        </div>
        {step.subtitle && (
          <p className="mt-2 text-sm text-ink-500 leading-relaxed">{step.subtitle}</p>
        )}
      </div>
    );
  }
  return (
    <div className="grid md:grid-cols-[1fr_1.4fr] gap-8 md:gap-12 items-start">
      <div>
        <div className="flex items-start gap-3">
          <span className="inline-flex items-center justify-center rounded-full border border-ink-300 text-ink-700 text-sm h-7 w-7 shrink-0 mt-0.5">
            {index}
          </span>
          <div>
            <h3 className="font-display text-lg md:text-xl font-bold text-ink-900 leading-snug">
              {step.title}
            </h3>
            {step.subtitle && (
              <p className="mt-2 text-sm text-ink-500 leading-relaxed">{step.subtitle}</p>
            )}
          </div>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

/* --- inputs (Zebra-flavored) --- */

function StepInputF1({
  step,
  value,
  onChange,
}: {
  step: Step;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  switch (step.type) {
    case "multi-tiles":
      return (
        <RadioList
          multi
          options={step.options ?? []}
          value={(value as string[]) ?? []}
          onChange={(v) => onChange(v)}
        />
      );
    case "single-buttons":
      return (
        <RadioList
          options={step.options ?? []}
          value={typeof value === "string" && value ? [value] : []}
          onChange={(v) => onChange(v[0] ?? "")}
        />
      );
    case "select":
      return (
        <select
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-ink-300 bg-white px-4 py-3 text-base text-ink-900 focus:outline-none focus:border-mint-600 focus:ring-2 focus:ring-mint-500/20"
        >
          <option value="">Select…</option>
          {(step.options ?? []).map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      );
    case "text":
      return (
        <input
          type="text"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your answer"
          className="w-full rounded-lg border border-ink-300 bg-white px-4 py-3 text-base text-ink-900 focus:outline-none focus:border-mint-600 focus:ring-2 focus:ring-mint-500/20"
        />
      );
    case "email":
      return (
        <input
          type="email"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-ink-300 bg-white px-4 py-3 text-base text-ink-900 focus:outline-none focus:border-mint-600 focus:ring-2 focus:ring-mint-500/20"
        />
      );
    case "phone":
      return (
        <input
          type="tel"
          inputMode="tel"
          value={formatPhone((value as string) ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder="(201) 555-0123"
          className="w-full rounded-lg border border-ink-300 bg-white px-4 py-3 text-base text-ink-900 focus:outline-none focus:border-mint-600 focus:ring-2 focus:ring-mint-500/20"
        />
      );
    case "dob":
      return <DobInline value={value as { m: string; d: string; y: string }} onChange={onChange} />;
    default:
      return null;
  }
}

function RadioList({
  options,
  value,
  onChange,
  multi,
}: {
  options: { value: string; label: string }[];
  value: string[];
  onChange: (v: string[]) => void;
  multi?: boolean;
}) {
  function toggle(v: string) {
    if (multi) {
      onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
    } else {
      onChange([v]);
    }
  }
  return (
    <div className="flex flex-col gap-2">
      {options.map((o) => {
        const selected = value.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => toggle(o.value)}
            className={cn(
              "flex items-center gap-3 rounded-lg border bg-white px-4 py-3 text-left text-sm md:text-base transition-all",
              selected
                ? "border-mint-500 ring-2 ring-mint-500/30 text-ink-900"
                : "border-ink-300 hover:border-mint-400 text-ink-700",
            )}
          >
            <span
              className={cn(
                multi
                  ? "rounded-md h-4 w-4 border-2 flex items-center justify-center"
                  : "rounded-full h-4 w-4 border-2 flex items-center justify-center",
                selected ? "border-mint-500 bg-mint-500" : "border-ink-300",
              )}
            >
              {selected && (
                <span className={cn("bg-white", multi ? "h-1.5 w-1.5" : "h-1.5 w-1.5 rounded-full")} />
              )}
            </span>
            <span>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function DobInline({
  value,
  onChange,
}: {
  value: { m: string; d: string; y: string };
  onChange: (v: { m: string; d: string; y: string }) => void;
}) {
  const v = value ?? { m: "", d: "", y: "" };
  function set(k: "m" | "d" | "y", raw: string, max: number) {
    const digits = raw.replace(/\D/g, "").slice(0, max);
    onChange({ ...v, [k]: digits });
  }
  return (
    <div className="grid grid-cols-3 gap-3 max-w-md">
      <input
        placeholder="MM"
        inputMode="numeric"
        value={v.m}
        onChange={(e) => set("m", e.target.value, 2)}
        className="rounded-lg border border-ink-300 bg-white px-3 py-3 text-center text-base text-ink-900 focus:outline-none focus:border-mint-600 focus:ring-2 focus:ring-mint-500/20"
      />
      <input
        placeholder="DD"
        inputMode="numeric"
        value={v.d}
        onChange={(e) => set("d", e.target.value, 2)}
        className="rounded-lg border border-ink-300 bg-white px-3 py-3 text-center text-base text-ink-900 focus:outline-none focus:border-mint-600 focus:ring-2 focus:ring-mint-500/20"
      />
      <input
        placeholder="YYYY"
        inputMode="numeric"
        value={v.y}
        onChange={(e) => set("y", e.target.value, 4)}
        className="rounded-lg border border-ink-300 bg-white px-3 py-3 text-center text-base text-ink-900 focus:outline-none focus:border-mint-600 focus:ring-2 focus:ring-mint-500/20"
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
