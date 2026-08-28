"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBrowser } from "@/lib/supabase/browser";

export function SignOutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <button
      onClick={() =>
        startTransition(async () => {
          const supabase = createBrowser();
          await supabase.auth.signOut();
          router.push("/admin/login");
          router.refresh();
        })
      }
      className="text-sm font-medium rounded-full border border-ink-300/40 px-4 py-2 hover:bg-mint-50 transition-colors disabled:opacity-60"
      disabled={pending}
    >
      {pending ? "…" : "Sign out"}
    </button>
  );
}
