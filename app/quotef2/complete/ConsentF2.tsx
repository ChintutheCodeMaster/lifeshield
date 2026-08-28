"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
      className="mt-6 rounded-sm bg-[#2563eb] hover:bg-[#1d4fd8] text-white font-semibold uppercase tracking-wider text-sm px-6 py-2.5 shadow disabled:opacity-60"
    >
      {pending ? "Preparing…" : "Display Quotes"}
    </button>
  );
}
