import { StepShell } from "@/components/funnel/StepShell";
import { steps } from "@/lib/funnel/steps";
import { ConsentForm } from "./ConsentForm";

export default function CompletePage() {
  const total = steps.length + 2;
  const idx = steps.length; // second-to-last screen
  return (
    <StepShell progress={(idx + 1) / total * 100} index={idx} total={total} backHref={`/quote/${steps[steps.length - 1].path}`}>
      <div className="animate-fade-in text-center max-w-xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-mint-900 leading-tight">
          Thank you! We&apos;re preparing your personalized quotes now.
        </h2>
        <p className="mt-6 text-sm text-ink-500 leading-relaxed">
          By clicking on <strong>Display Quotes</strong>, you agree to
          MintLife&apos;s{" "}
          <a href="#" className="underline text-mint-700">privacy policy</a>{" "}
          and provide your express written consent for MintLife to contact you
          at the number(s) and email you entered on this webpage (which may
          involve the use of an automatic dialing system, artificial or
          prerecorded voice, or text message) to market our products and
          services. This consent is not required to get a quote or buy anything
          from MintLife, and you may instead reach us at (866) 912-7775.
        </p>
        <ConsentForm />
      </div>
    </StepShell>
  );
}
