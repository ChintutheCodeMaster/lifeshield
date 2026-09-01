export type StepType =
  | "multi-tiles"
  | "single-buttons"
  | "select"
  | "text"
  | "dob"
  | "phone"
  | "email"
  | "interstitial"
  | "group";

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

export type GroupFieldType = "select" | "dob" | "text" | "phone" | "email" | "yesno";

export type GroupField = {
  key: string;                 // db column on leads
  label: string;               // small label above the input
  type: GroupFieldType;
  options?: Option[];          // for "select"
  placeholder?: string;        // for "text" / "email"
};

export type Step = {
  id: string;
  path: string;          // relative to /quote (e.g., "" for entry, "protect" etc.)
  title: string;
  subtitle?: string;
  field?: string;         // key on the lead row (omit for interstitials and groups)
  type: StepType;
  options?: Option[];
  fields?: GroupField[];  // only for "group"
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

const COVERAGE_OPTIONS: Option[] = [
  { value: "100000", label: "$100,000" },
  { value: "250000", label: "$250,000" },
  { value: "500000", label: "$500,000" },
  { value: "750000", label: "$750,000" },
  { value: "1000000", label: "$1,000,000" },
  { value: "2000000", label: "$2,000,000" },
  { value: "3000000", label: "$3,000,000" },
  { value: "5000000", label: "$5,000,000" },
];

const TERM_OPTIONS: Option[] = [
  { value: "10", label: "10-Year Guaranteed Level Term" },
  { value: "15", label: "15-Year Guaranteed Level Term" },
  { value: "20", label: "20-Year Guaranteed Level Term" },
  { value: "25", label: "25-Year Guaranteed Level Term" },
  { value: "30", label: "30-Year Guaranteed Level Term" },
];

const SEX_OPTIONS: Option[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const STATE_OPTIONS: Option[] = US_STATES.map((s) => ({ value: s, label: s }));

export const steps: Step[] = [
  {
    id: "protect",
    path: "",
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
    next: "/quote/coverage-term",
  },
  {
    id: "coverage-term",
    path: "coverage-term",
    title: "How much cover, and for how long?",
    subtitle:
      "Not sure? Many people start with 10–15× their yearly income for 20–30 years.",
    type: "group",
    fields: [
      { key: "coverage_amount", label: "Coverage amount", type: "select", options: COVERAGE_OPTIONS },
      { key: "term_length",     label: "Term length",     type: "select", options: TERM_OPTIONS },
    ],
    next: "/quote/about-you",
  },
  /* Removed 2026-09-02 — redundant given `who_to_protect` already captures "children" as an option.
   * {
   *   id: "children",
   *   path: "children",
   *   title: "How many children do you have under 18?",
   *   field: "children_count",
   *   type: "single-buttons",
   *   options: [
   *     { value: "0", label: "0" },
   *     { value: "1", label: "1" },
   *     { value: "2", label: "2" },
   *     { value: "3", label: "3" },
   *     { value: "4", label: "4+" },
   *   ],
   *   next: "/quote/about-you",
   * },
   */
  {
    id: "about-you",
    path: "about-you",
    title: "A bit about you",
    subtitle: "Just the essentials to price your quote accurately.",
    type: "group",
    fields: [
      { key: "dob",          label: "Date of birth",      type: "dob" },
      { key: "sex_at_birth", label: "Sex assigned at birth", type: "select", options: SEX_OPTIONS },
      { key: "state",        label: "State of residence", type: "select", options: STATE_OPTIONS },
    ],
    next: "/quote/health-lifestyle",
  },
  {
    id: "health-lifestyle",
    path: "health-lifestyle",
    title: "A few quick health & lifestyle questions",
    subtitle: "These help us prequalify your coverage.",
    type: "group",
    fields: [
      { key: "tobacco_last_12mo",     label: "Have you smoked or used tobacco in the last 12 months?", type: "yesno" },
      { key: "married",               label: "Are you married?",                                       type: "yesno" },
      { key: "medical_treatment_5yr", label: "In the past 5 years, have you received treatment for any medical conditions?", type: "yesno" },
    ],
    next: "/quote/what-to-cover",
  },
  {
    id: "what-to-cover",
    path: "what-to-cover",
    title: "What would you like to cover?",
    subtitle: "Optional — helps us tailor your options.",
    field: "motivation",
    type: "multi-tiles",
    optional: true,
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
    next: "/quote/name",
  },
  {
    id: "name",
    path: "name",
    title: "What's your name?",
    type: "group",
    fields: [
      { key: "first_name", label: "First name", type: "text", placeholder: "First name" },
      { key: "last_name",  label: "Last name",  type: "text", placeholder: "Last name"  },
    ],
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
  /* ----------------------------------------------------------------
   * REMOVED FROM ACTIVE FUNNEL (kept for reference — do not re-add
   * without product sign-off). Motivation was renamed to
   * "what-to-cover" above and moved to the optional block.
   * Coverage / term / dob / sex / state / first-name / last-name
   * were clubbed into the "coverage-term", "about-you", and "name"
   * group steps above (same DB field keys).
   * ----------------------------------------------------------------
   *
   * { id: "motivation", ...  }    // → renamed to "what-to-cover"
   * { id: "checkpoint", ... }     // interstitial, removed
   * { id: "recommendation", ... } // interstitial, removed
   * { id: "tobacco", ... }        // removed (defaults to non-smoker in pricing)
   * { id: "health", ... }         // removed (defaults to average in pricing)
   * { id: "coverage", ... }       // clubbed into "coverage-term"
   * { id: "term", ... }           // clubbed into "coverage-term"
   * { id: "state", ... }          // clubbed into "about-you"
   * { id: "dob", ... }            // clubbed into "about-you"
   * { id: "sex", ... }            // clubbed into "about-you"
   * { id: "first-name", ... }     // clubbed into "name"
   * { id: "last-name", ... }      // clubbed into "name"
   */
];

export function findStep(path: string): Step | undefined {
  return steps.find((s) => s.path === path);
}

export function stepIndex(path: string): number {
  return steps.findIndex((s) => s.path === path);
}
