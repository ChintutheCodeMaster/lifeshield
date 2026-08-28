"use client";

import { useEffect, useState } from "react";

export function ResultsReveal({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 900);
    return () => clearTimeout(t);
  }, []);

  if (!ready) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="inline-flex items-center gap-3">
          <span className="w-4 h-4 rounded-full bg-mint-500 animate-pulse" />
          <span className="w-4 h-4 rounded-full bg-mint-500 animate-pulse [animation-delay:120ms]" />
          <span className="w-4 h-4 rounded-full bg-mint-500 animate-pulse [animation-delay:240ms]" />
        </div>
        <h2 className="mt-6 font-display text-2xl md:text-3xl font-semibold text-mint-800">
          Almost there — loading your personalized options
        </h2>
      </div>
    );
  }
  return <div className="animate-fade-in">{children}</div>;
}
