"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function ConsentForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ patch: { consent_at: new Date().toISOString() } }),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j?.error ?? `Request failed (${res.status})`);
        }
        router.push("/quote/results");
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 flex flex-col items-center gap-3">
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-mint-500 hover:bg-mint-600 text-white font-semibold px-8 py-3.5 transition-colors shadow-md disabled:opacity-60"
      >
        {pending ? "Preparing…" : "Display Quotes"}
      </button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  );
}
