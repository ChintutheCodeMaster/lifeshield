import { notFound } from "next/navigation";
import { steps } from "@/lib/funnel/steps";
import { findStepF2, stepHrefF2, totalF2 } from "@/lib/funnel-mock/nav-f2";
import { ShellF2 } from "@/components/funnel-f2/ShellF2";
import { CardStep } from "@/components/funnel-f2/CardStep";

export default async function QuoteF2StepPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step: segment } = await params;
  const step = findStepF2(segment);
  if (!step) notFound();

  const idx = steps.findIndex((s) => s.id === step.id);
  const nextStep = idx < steps.length - 1 ? steps[idx + 1] : undefined;
  const prevStep = idx > 0 ? steps[idx - 1] : undefined;
  const nextHref = nextStep ? stepHrefF2(nextStep) : "/quotef2/complete";
  const prevHref = prevStep ? stepHrefF2(prevStep) : undefined;

  return (
    <ShellF2>
      <CardStep
        step={step}
        index={idx}
        total={totalF2()}
        nextHref={nextHref}
        prevHref={prevHref}
      />
    </ShellF2>
  );
}
