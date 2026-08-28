import { steps, type Step } from "@/lib/funnel/steps";

// Linear order in f2 mirrors the step order in lib/funnel/steps.
export function findStepF2(pathSegment: string): Step | undefined {
  // f2 entry uses "start" for the very first step (whose real path is "")
  if (pathSegment === "start") return steps[0];
  return steps.find((s) => s.path === pathSegment);
}

export function stepIndexF2(step: Step): number {
  return steps.findIndex((s) => s.id === step.id);
}

export function stepHrefF2(step: Step | undefined): string {
  if (!step) return "/quotef2/complete";
  return `/quotef2/${step.path === "" ? "start" : step.path}`;
}

export function totalF2(): number {
  return steps.length + 2; // + complete + results
}

export { steps };
