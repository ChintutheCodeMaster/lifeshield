"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ConsentF1() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return (
    <div className="mt-8">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setPending(true);
          router.push("/quotef1/results");
        }}
        className="rounded-full bg-mint-500 hover:bg-mint-600 text-white font-semibold px-8 py-3.5 shadow-md transition-colors disabled:opacity-60"
      >
        {pending ? "Preparing…" : "Show my quotes"}
      </button>
    </div>
  );
}
