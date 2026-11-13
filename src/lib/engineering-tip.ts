import { z } from "zod";

export const engineeringTipSchema = z.string()
  .refine((tip) => !/[\r\n]/.test(tip), "Please keep your tip to one line")
  .transform((tip) => tip.trim())
  .pipe(z.string().min(1, "Please add a tip"));