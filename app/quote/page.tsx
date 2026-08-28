import { redirect } from "next/navigation";
import { steps, stepIndex } from "@/lib/funnel/steps";
import { StepShell } from "@/components/funnel/StepShell";
import { StepQuestion } from "@/components/funnel/StepQuestion";
import { StepForm } from "@/components/funnel/StepForm";

export default function QuoteEntry() {
  const step = steps[0];
  if (!step) redirect("/");
  const idx = stepIndex(step.path);
  const total = steps.length + 2; // + complete + results
  return (
    <StepShell progress={((idx + 1) / total) * 100} index={idx} total={total}>
      <StepQuestion index={idx + 1} title={step.title} subtitle={step.subtitle}>
        <StepForm step={step} />
      </StepQuestion>
    </StepShell>
  );
}
