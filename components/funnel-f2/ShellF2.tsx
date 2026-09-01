import Link from "next/link";
import { brand } from "@/lib/brand";

export function ShellF2({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink-900">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-mint-100/60 to-transparent"
      />

      <header className="relative bg-white/70 backdrop-blur border-b border-mint-100">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-1">
            <span className="text-xl font-display font-bold text-mint-800">{brand.wordmark.primary}</span>
            <span className="text-xl font-display font-light text-mint-500">{brand.wordmark.secondary}</span>
          </Link>
          <a
            href="tel:+18669127775"
            className="text-mint-700 hover:text-mint-800 text-sm md:text-base font-semibold tabular-nums"
          >
            (866) 912-7775
          </a>
        </div>
      </header>

      <main className="relative flex-1 flex flex-col items-center px-4 py-14">
        <div className="text-center max-w-2xl mb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-mint-100 text-mint-700 text-[11px] font-semibold uppercase tracking-widest px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-mint-500" />
            You&apos;re prequalifying
          </span>
          <h1 className="mt-4 font-display text-2xl md:text-3xl font-bold text-ink-900 leading-tight">
            Answer a few quick questions to see your rates.
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            Takes about two minutes — no medical exam required.
          </p>
        </div>
        <div className="w-full max-w-xl">{children}</div>
      </main>

      <footer className="relative bg-white/70 border-t border-mint-100">
        <div className="mx-auto max-w-5xl px-6 py-4 text-center text-xs text-ink-500">
          <a href="#" className="hover:text-mint-700">Terms Of Service</a>
          <span className="mx-2 text-ink-300">·</span>
          <a href="#" className="hover:text-mint-700">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}
