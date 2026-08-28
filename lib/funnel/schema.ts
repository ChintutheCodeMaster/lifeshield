import { z } from "zod";

const arrayCoerce = (v: unknown) => (Array.isArray(v) ? v : v == null ? undefined : [v]);

export const leadPatchSchema = z
  .object({
    motivation: z.preprocess(arrayCoerce, z.array(z.string()).optional()),
    quotes_for: z.string().nullable().optional(),
    who_to_protect: z.preprocess(arrayCoerce, z.array(z.string()).optional()),
    children_count: z.coerce.number().int().min(0).max(20).optional(),
    state: z.string().optional(),
    dob: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "dob must be YYYY-MM-DD")
      .optional(),
    sex_at_birth: z.enum(["male", "female"]).optional(),
    tobacco: z.string().optional(),
    health_level: z.string().optional(),
    term_length: z.coerce.number().int().min(5).max(40).optional(),
    coverage_amount: z.coerce.number().int().min(10000).max(10000000).optional(),
    first_name: z.string().min(1).max(80).optional(),
    last_name: z.string().min(1).max(80).optional(),
    phone: z.string().min(7).max(30).optional(),
    email: z.string().email().optional(),
    consent_at: z.string().datetime().optional(),
  })
  .strict();

export type LeadPatch = z.infer<typeof leadPatchSchema>;
