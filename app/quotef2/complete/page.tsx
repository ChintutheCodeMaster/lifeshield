import { ShellF2 } from "@/components/funnel-f2/ShellF2";
import { ConsentF2 } from "./ConsentF2";

export default function QuoteF2Complete() {
  return (
    <ShellF2>
      <div className="rounded-md bg-white shadow-md px-6 md:px-8 py-8 animate-fade-in">
        <h2 className="text-lg font-semibold text-ink-900">
          Thanks — we&apos;re preparing your quotes.
        </h2>
        <p className="mt-3 text-sm text-ink-500 leading-relaxed">
          By clicking <strong>Display Quotes</strong>, you agree to MintLife&apos;s{" "}
          <a href="#" className="underline text-mint-700">privacy policy</a> and
          provide your express written consent for MintLife to contact you at the
          number(s) and email you entered on this webpage. This consent is not
          required to get a quote.
        </p>
        <ConsentF2 />
      </div>
    </ShellF2>
  );
}
