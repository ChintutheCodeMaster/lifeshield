import Link from "next/link";
import { ProgressBar } from "./ProgressBar";
import { ArrowLeft } from "lucide-react";

export function StepShell({
  progress,
  index,
  total,
  backHref,
  children,
}: {
  progress: number;
  index: number;
  total: number;
  backHref?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <header className="px-6 md:px-10 pt-6 pb-4">
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="flex items-baseline gap-1 shrink-0">
            <span className="text-2xl font-display font-bold text-mint-800">Mint</span>
            <span className="text-2xl font-display font-light text-mint-500">Life</span>
          </Link>
          <ProgressBar value={progress} className="flex-1 max-w-xl mx-auto" />
          <div className="hidden sm:block text-xs font-medium text-ink-500 shrink-0 tabular-nums">
            Step {index + 1} of {total}
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-start md:items-center justify-center px-6 pb-16">
        <div className="w-full max-w-2xl">
          {backHref && (
            <Link
              href={backHref}
              className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-mint-700 mb-4 transition-colors"
            >
              <ArrowLeft size={14} /> Back
            </Link>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
