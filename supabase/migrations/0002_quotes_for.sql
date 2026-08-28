alter table public.leads
  add column if not exists quotes_for text;
