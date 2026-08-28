export type StepType =
  | "multi-tiles"
  | "single-buttons"
  | "select"
  | "text"
  | "dob"
  | "phone"
  | "email"
  | "interstitial";

export type IconName =
  | "users"
  | "home"
  | "dollar"
  | "brain"
  | "heart"
  | "baby"
  | "shield"
  | "user";

export type Option = {
  value: string;
  label: string;
  icon?: IconName;
};

export type Step = {
  id: string;
  path: string;          // relative to /quote (e.g., "" for entry, "protect" etc.)
  title: string;
  subtitle?: string;
  field?: string;         // key on the lead row (omit for interstitials)
  type: StepType;
  options?: Option[];
  next: string;           // path of next step
  optional?: boolean;
};

export const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming","District of Columbia",
] as const;

export const steps: Step[] = [
  {
    id: "motivation",
    path: "",
    title: "What's motivating you to explore life insurance today?",
    subtitle: "Please select all that apply.",
    field: "motivation",
    type: "multi-tiles",
    options: [
      { value: "family", label: "Protect my family / loved ones", icon: "users" },
      { value: "mortgage", label: "Cover mortgage or other debt", icon: "home" },
      { value: "income", label: "Replace my income", icon: "dollar" },
      { value: "other", label: "Other", icon: "brain" },
    ],
    next: "/quote/quotes-for",
  },
  {
    id: "quotes-for",
    path: "quotes-for",
    title: "I'd like quotes for…",
    subtitle: "Optional — helps us tailor your options.",
    field: "quotes_for",
    type: "single-buttons",
    optional: true,
    options: [
      { value: "self", label: "Just me" },
      { value: "self_and_spouse", label: "Me and my spouse or partner" },
      { value: "self_and_family", label: "Me and my family" },
      { value: "spouse", label: "Just my spouse or partner" },
    ],
    next: "/quote/protect",
  },
  {
    id: "protect",
    path: "protect",
    title: "Who are you most hoping to financially protect?",
    subtitle: "Please select all that apply.",
    field: "who_to_protect",
    type: "multi-tiles",
    options: [
      { value: "spouse", label: "Spouse or Partner", icon: "heart" },
      { value: "children", label: "Children", icon: "baby" },
      { value: "parent", label: "Parent", icon: "user" },
      { value: "other", label: "Other", icon: "shield" },
    ],
    next: "/quote/children",
  },
  {
    id: "children",
    path: "children",
    title: "How many children do you have under 18?",
    field: "children_count",
    type: "single-buttons",
    options: [
      { value: "0", label: "0" },
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4+" },
    ],
    next: "/quote/checkpoint",
  },
  {
    id: "checkpoint",
    path: "checkpoint",
    title: "You're off to a great start!",
    subtitle: "Based on your answers, we'll recommend a coverage type next.",
    type: "interstitial",
    next: "/quote/recommendation",
  },
  {
    id: "recommendation",
    path: "recommendation",
    title: "Based on your inputs, we recommend:",
    subtitle:
      "Term Life gives you simple, affordable protection for the years when your family or business relies on your income most.",
    type: "interstitial",
    next: "/quote/state",
  },
  {
    id: "state",
    path: "state",
    title: "Please select your state of residence.",
    field: "state",
    type: "select",
    options: US_STATES.map((s) => ({ value: s, label: s })),
    next: "/quote/dob",
  },
  {
    id: "dob",
    path: "dob",
    title: "What is your date of birth?",
    field: "dob",
    type: "dob",
    next: "/quote/sex",
  },
  {
    id: "sex",
    path: "sex",
    title: "Please select your sex assigned at birth.",
    field: "sex_at_birth",
    type: "select",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
    ],
    next: "/quote/tobacco",
  },
  {
    id: "tobacco",
    path: "tobacco",
    title: "Please select your tobacco or nicotine use level.",
    field: "tobacco",
    type: "select",
    options: [
      { value: "never", label: "I have never smoked" },
      { value: "former_5plus", label: "Former user, quit 5+ years ago" },
      { value: "former_recent", label: "Former user, quit within 5 years" },
      { value: "current_light", label: "Current — occasional (< 1 pack/week)" },
      { value: "current_regular", label: "Current — regular user" },
    ],
    next: "/quote/health",
  },
  {
    id: "health",
    path: "health",
    title: "Please select your health level.",
    field: "health_level",
    type: "select",
    options: [
      { value: "above_average", label: "Above Average (PREF)" },
      { value: "average", label: "Average" },
      { value: "below_average", label: "Below Average" },
    ],
    next: "/quote/term",
  },
  {
    id: "term",
    path: "term",
    title: "For how long would you want your income covered?",
    subtitle: "Most people choose 20–30 years to cover kids and a mortgage.",
    field: "term_length",
    type: "select",
    options: [
      { value: "10", label: "10-Year Guaranteed Level Term" },
      { value: "15", label: "15-Year Guaranteed Level Term" },
      { value: "20", label: "20-Year Guaranteed Level Term" },
      { value: "25", label: "25-Year Guaranteed Level Term" },
      { value: "30", label: "30-Year Guaranteed Level Term" },
    ],
    next: "/quote/coverage",
  },
  {
    id: "coverage",
    path: "coverage",
    title: "Please select the amount of coverage you would like.",
    subtitle:
      "Not sure? Many people start with a policy that's 10–15× their yearly income.",
    field: "coverage_amount",
    type: "select",
    options: [
      { value: "100000", label: "$100,000" },
      { value: "250000", label: "$250,000" },
      { value: "500000", label: "$500,000" },
      { value: "750000", label: "$750,000" },
      { value: "1000000", label: "$1,000,000" },
      { value: "2000000", label: "$2,000,000" },
      { value: "3000000", label: "$3,000,000" },
      { value: "5000000", label: "$5,000,000" },
    ],
    next: "/quote/first-name",
  },
  {
    id: "first-name",
    path: "first-name",
    title: "What is your first name?",
    field: "first_name",
    type: "text",
    next: "/quote/last-name",
  },
  {
    id: "last-name",
    path: "last-name",
    title: "What is your last name?",
    field: "last_name",
    type: "text",
    next: "/quote/phone",
  },
  {
    id: "phone",
    path: "phone",
    title: "What is your phone number?",
    field: "phone",
    type: "phone",
    next: "/quote/email",
  },
  {
    id: "email",
    path: "email",
    title: "What is your email address?",
    field: "email",
    type: "email",
    next: "/quote/complete",
  },
];

export function findStep(path: string): Step | undefined {
  return steps.find((s) => s.path === path);
}

export function stepIndex(path: string): number {
  return steps.findIndex((s) => s.path === path);
}
