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
      <ProgressBar value={progress} />
      <header className="px-6 md:px-10 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-1">
          <span className="text-2xl font-display font-bold text-mint-800">Mint</span>
          <span className="text-2xl font-display font-light text-mint-500">Life</span>
        </Link>
        <div className="text-xs font-medium text-ink-500">
          Step {index + 1} of {total}
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
