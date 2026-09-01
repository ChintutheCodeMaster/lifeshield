import { ShellF2 } from "@/components/funnel-f2/ShellF2";
import { brand } from "@/lib/brand";
import { ConsentF2 } from "./ConsentF2";

export default function QuoteF2Complete() {
  return (
    <ShellF2>
      <div className="rounded-3xl bg-white border border-mint-100 shadow-[0_20px_60px_-24px_rgba(31,93,66,0.25)] px-6 md:px-10 py-8 animate-fade-in">
        <h2 className="font-display text-xl md:text-2xl font-semibold text-ink-900">
          Thanks — we&apos;re preparing your quotes.
        </h2>
        <p className="mt-3 text-sm text-ink-500 leading-relaxed">
          By clicking <strong>Display Quotes</strong>, you agree to {brand.name}&apos;s{" "}
          <a href="#" className="underline text-mint-700">privacy policy</a> and
          provide your express written consent for {brand.name} to contact you at the
          number(s) and email you entered on this webpage. This consent is not
          required to get a quote.
        </p>
        <ConsentF2 />
      </div>
    </ShellF2>
  );
}
