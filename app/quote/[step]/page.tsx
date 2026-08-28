import { notFound } from "next/navigation";
import { findStep, steps, stepIndex } from "@/lib/funnel/steps";
import { StepShell } from "@/components/funnel/StepShell";
import { StepQuestion } from "@/components/funnel/StepQuestion";
import { StepForm } from "@/components/funnel/StepForm";

export default async function QuoteStep({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step: pathSegment } = await params;
  const step = findStep(pathSegment);
  if (!step) notFound();

  const idx = stepIndex(step.path);
  const total = steps.length + 2;
  const prev = idx > 0 ? steps[idx - 1] : null;
  const backHref = prev ? (prev.path === "" ? "/quote" : `/quote/${prev.path}`) : undefined;

  return (
    <StepShell
      progress={((idx + 1) / total) * 100}
      index={idx}
      total={total}
      backHref={backHref}
    >
      <StepQuestion
        index={step.type === "interstitial" ? undefined : idx + 1}
        title={step.title}
        subtitle={step.subtitle}
      >
        <StepForm step={step} />
      </StepQuestion>
    </StepShell>
  );
}
