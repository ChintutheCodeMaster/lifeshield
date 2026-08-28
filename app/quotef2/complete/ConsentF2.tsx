"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export function ConsentF2() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        setPending(true);
        router.push("/quotef2/results");
      }}
      className="mt-6 inline-flex items-center gap-2 rounded-full bg-mint-500 hover:bg-mint-600 text-white font-semibold text-sm px-6 py-3 shadow-sm transition-colors disabled:opacity-60"
    >
      {pending ? "Preparing…" : "Display Quotes"} <ArrowRight size={16} />
    </button>
  );
}
