import { steps as allSteps, type Step } from "@/lib/funnel/steps";

export type GroupDef = {
  slug: string;         // route segment: /quotef1/<slug>
  label: string;        // sidebar label
  title: string;        // page heading
  subtitle?: string;
  stepIds: string[];    // ids from lib/funnel/steps
  next: string;         // href to advance to
};

function pick(ids: string[]): Step[] {
  return ids
    .map((id) => allSteps.find((s) => s.id === id))
    .filter((s): s is Step => Boolean(s));
}

export const groupsF1: GroupDef[] = [
  {
    slug: "start",
    label: "Start",
    title: "Tell us why you're here",
    subtitle: "We'll use this to tailor your options — takes about two minutes.",
    stepIds: ["motivation", "quotes-for", "protect", "children"],
    next: "/quotef1/plan",
  },
  {
    slug: "plan",
    label: "Plan",
    title: "Here's what we'll build for you",
    subtitle: "Based on your answers, Term Life is usually the strongest starting point.",
    stepIds: ["checkpoint", "recommendation"],
    next: "/quotef1/you",
  },
  {
    slug: "you",
    label: "About you",
    title: "A little about you",
    subtitle: "We'll only ask what insurance carriers need to price your policy.",
    stepIds: ["state", "dob", "sex", "tobacco", "health"],
    next: "/quotef1/coverage",
  },
  {
    slug: "coverage",
    label: "Coverage",
    title: "Design your coverage",
    subtitle: "Pick a term length and a coverage amount that fits your life stage.",
    stepIds: ["term", "coverage"],
    next: "/quotef1/contact",
  },
  {
    slug: "contact",
    label: "Contact",
    title: "Where should we send your quotes?",
    subtitle: "A licensed agent will call to confirm — no spam, ever.",
    stepIds: ["first-name", "last-name", "phone", "email"],
    next: "/quotef1/complete",
  },
];

export function findGroupF1(slug: string): GroupDef | undefined {
  return groupsF1.find((g) => g.slug === slug);
}

export function groupIndexF1(slug: string): number {
  return groupsF1.findIndex((g) => g.slug === slug);
}

export function groupStepsF1(g: GroupDef): Step[] {
  return pick(g.stepIds);
}
