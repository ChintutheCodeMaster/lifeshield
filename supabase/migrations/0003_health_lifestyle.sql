alter table public.leads
  add column if not exists tobacco_last_12mo boolean,
  add column if not exists married boolean,
  add column if not exists medical_treatment_5yr boolean;
