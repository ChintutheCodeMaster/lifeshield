import { LayoutF1 } from "@/components/funnel-f1/Layout";
import { brand } from "@/lib/brand";
import { ConsentF1 } from "./ConsentF1";

export default function QuoteF1Complete() {
  return (
    <LayoutF1 activeSlug="contact">
      <div className="max-w-2xl animate-fade-in">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-ink-900 leading-tight">
          Thanks — we&apos;re building your quotes.
        </h1>
        <p className="mt-3 text-ink-500 leading-relaxed">
          By clicking <strong>Show my quotes</strong>, you agree to {brand.name}&apos;s{" "}
          <a href="#" className="underline text-mint-700">privacy policy</a> and
          provide your express written consent for {brand.name} to contact you at the
          number(s) and email you entered on this webpage. Consent is not
          required to get a quote.
        </p>
        <ConsentF1 />
      </div>
    </LayoutF1>
  );
}
