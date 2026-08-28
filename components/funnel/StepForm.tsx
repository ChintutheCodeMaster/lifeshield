"use client";

import { useState, useTransition, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Step, Option } from "@/lib/funnel/steps";
import { OkButton } from "./OkButton";
import { cn } from "@/lib/utils";
import {
  Check,
  Users,
  Home,
  DollarSign,
  Brain,
  Heart,
  Baby,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { IconName } from "@/lib/funnel/steps";

const ICONS = {
  users: Users,
  home: Home,
  dollar: DollarSign,
  brain: Brain,
  heart: Heart,
  baby: Baby,
  shield: ShieldCheck,
  user: UserRound,
} as const;

type Props = { step: Step };

export function StepForm({ step }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // State per input type.
  const [multi, setMulti] = useState<string[]>([]);
  const [single, setSingle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [dob, setDob] = useState({ m: "", d: "", y: "" });

  async function submit(value: unknown) {
    if (!step.field) {
      router.push(step.next);
      return;
    }
    setError(null);
    const body = { patch: { [step.field]: value } };
    startTransition(async () => {
      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j?.error ?? `Request failed (${res.status})`);
        }
        router.push(step.next);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  }

  const canSubmit = useMemo(() => {
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
  }, [step.type, multi, single, text, dob]);

  function onFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || pending) return;
    switch (step.type) {
      case "multi-tiles": return submit(multi);
      case "single-buttons":
      case "select": return submit(single);
      case "text":
      case "email": return submit(text.trim());
      case "phone": return submit(text.replace(/\D/g, ""));
      case "dob": {
        const iso = `${dob.y.padStart(4, "0")}-${dob.m.padStart(2, "0")}-${dob.d.padStart(2, "0")}`;
        return submit(iso);
      }
      case "interstitial": return submit(null);
    }
  }

  return (
    <form onSubmit={onFormSubmit} className="space-y-2">
      {step.type === "multi-tiles" && (
        <TilesGrid options={step.options ?? []} value={multi} onChange={setMulti} multi />
      )}
      {step.type === "single-buttons" && (
        <StackedButtons options={step.options ?? []} value={single} onChange={setSingle} />
      )}
      {step.type === "select" && (
        <SelectField options={step.options ?? []} value={single} onChange={setSingle} />
      )}
      {step.type === "text" && (
        <TextField value={text} onChange={setText} placeholder="Type your answer here..." />
      )}
      {step.type === "email" && (
        <TextField value={text} onChange={setText} placeholder="you@example.com" inputType="email" />
      )}
      {step.type === "phone" && <PhoneField value={text} onChange={setText} />}
      {step.type === "dob" && <DobField value={dob} onChange={setDob} />}
      {step.type === "interstitial" && (
        <p className="text-ink-500 text-sm">Click Continue to keep going.</p>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <OkButton
        label={step.type === "interstitial" ? "Continue" : "OK"}
        disabled={!canSubmit}
        loading={pending}
      />
    </form>
  );
}

/* ---------- inputs ---------- */

function TilesGrid({
  options,
  value,
  onChange,
  multi,
}: {
  options: Option[];
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {options.map((o) => {
        const Icon = o.icon ? ICONS[o.icon as IconName] : undefined;
        const selected = value.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => toggle(o.value)}
            className={cn(
              "relative rounded-2xl border p-5 md:p-6 flex flex-col items-center justify-center gap-3 text-center min-h-[140px] transition-all",
              selected
                ? "bg-mint-100 border-mint-500 ring-2 ring-mint-500/40 shadow-sm"
                : "bg-white border-ink-300/30 hover:border-mint-400 hover:bg-mint-50/60",
            )}
          >
            {selected && (
              <span className="absolute top-2 right-2 rounded-full bg-mint-500 text-white p-0.5">
                <Check size={12} />
              </span>
            )}
            {Icon && (
              <Icon
                size={40}
                strokeWidth={1.5}
                className={selected ? "text-mint-700" : "text-mint-600"}
              />
            )}
            <div className={cn("text-sm font-medium leading-tight", selected ? "text-mint-800" : "text-ink-700")}>
              {o.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function StackedButtons({
  options,
  value,
  onChange,
}: {
  options: Option[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 max-w-md">
      {options.map((o) => {
        const selected = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "text-left rounded-lg px-4 py-3 border transition-all",
              selected
                ? "bg-mint-100 border-mint-500 text-mint-800 font-semibold"
                : "bg-mint-50/60 border-transparent text-ink-700 hover:bg-mint-100/60",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function SelectField({
  options,
  value,
  onChange,
}: {
  options: Option[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full max-w-lg border-b-2 border-mint-500 bg-transparent py-2 text-lg text-mint-800 focus:outline-none focus:border-mint-700"
    >
      <option value="">Select an option…</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function TextField({
  value,
  onChange,
  placeholder,
  inputType = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputType?: "text" | "email";
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);
  return (
    <input
      ref={ref}
      type={inputType}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full max-w-lg border-b-2 border-mint-500 bg-transparent py-2 text-lg text-mint-800 placeholder-mint-300 focus:outline-none focus:border-mint-700"
    />
  );
}

function PhoneField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);
  function format(raw: string) {
    const d = raw.replace(/\D/g, "").slice(0, 10);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  }
  return (
    <div className="flex items-center gap-3 max-w-lg border-b-2 border-mint-500 py-2">
      <span className="text-lg">🇺🇸</span>
      <input
        ref={ref}
        inputMode="tel"
        value={format(value)}
        onChange={(e) => onChange(e.target.value)}
        placeholder="(201) 555-0123"
        className="flex-1 bg-transparent text-lg text-mint-800 placeholder-mint-300 focus:outline-none"
      />
    </div>
  );
}

function DobField({
  value,
  onChange,
}: {
  value: { m: string; d: string; y: string };
  onChange: (v: { m: string; d: string; y: string }) => void;
}) {
  const mRef = useRef<HTMLInputElement>(null);
  const dRef = useRef<HTMLInputElement>(null);
  const yRef = useRef<HTMLInputElement>(null);
  useEffect(() => { mRef.current?.focus(); }, []);

  function set(key: "m" | "d" | "y", v: string, max: number, next?: React.RefObject<HTMLInputElement | null>) {
    const digits = v.replace(/\D/g, "").slice(0, max);
    onChange({ ...value, [key]: digits });
    if (digits.length === max && next?.current) next.current.focus();
  }

  return (
    <div className="flex items-end gap-4">
      <label className="flex flex-col text-xs text-ink-500">
        Month
        <input
          ref={mRef} inputMode="numeric" value={value.m}
          onChange={(e) => set("m", e.target.value, 2, dRef)}
          className="w-16 border-b-2 border-mint-500 bg-transparent py-1.5 text-xl text-mint-800 focus:outline-none focus:border-mint-700"
          placeholder="MM"
        />
      </label>
      <span className="text-2xl text-mint-500 pb-1">/</span>
      <label className="flex flex-col text-xs text-ink-500">
        Day
        <input
          ref={dRef} inputMode="numeric" value={value.d}
          onChange={(e) => set("d", e.target.value, 2, yRef)}
          className="w-16 border-b-2 border-mint-500 bg-transparent py-1.5 text-xl text-mint-800 focus:outline-none focus:border-mint-700"
          placeholder="DD"
        />
      </label>
      <span className="text-2xl text-mint-500 pb-1">/</span>
      <label className="flex flex-col text-xs text-ink-500">
        Year
        <input
          ref={yRef} inputMode="numeric" value={value.y}
          onChange={(e) => set("y", e.target.value, 4)}
          className="w-24 border-b-2 border-mint-500 bg-transparent py-1.5 text-xl text-mint-800 focus:outline-none focus:border-mint-700"
          placeholder="YYYY"
        />
      </label>
    </div>
  );
}
