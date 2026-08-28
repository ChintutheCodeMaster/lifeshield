import Link from "next/link";

export function ShellF2({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f5f7]">
      <header className="bg-white border-b border-ink-300/30">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-1">
            <span className="text-xl font-display font-bold text-mint-800">Mint</span>
            <span className="text-xl font-display font-light text-mint-500">Life</span>
            <span className="ml-2 text-[10px] uppercase tracking-widest text-ink-500 hidden sm:inline">
              Coverage Qualifier
            </span>
          </Link>
          <a
            href="tel:+18669127775"
            className="text-mint-700 hover:text-mint-800 text-sm md:text-base font-semibold"
          >
            (866) 912-7775
          </a>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-12">
        <h1 className="text-center font-display text-2xl md:text-3xl font-bold text-ink-900 max-w-3xl">
          Next Step:{" "}
          <span className="text-ink-900">
            Fill Out The Form Below To Prequalify For Coverage!
          </span>
        </h1>
        <div className="mt-8 w-full max-w-xl">{children}</div>
      </main>

      <footer className="bg-white border-t border-ink-300/30">
        <div className="mx-auto max-w-5xl px-6 py-4 text-center text-xs text-ink-500">
          <a href="#" className="hover:text-mint-700">Terms Of Service</a>
          <span className="mx-2">|</span>
          <a href="#" className="hover:text-mint-700">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}
