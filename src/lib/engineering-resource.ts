import { z } from "zod";

export const engineeringResourceSchema = z.object({
  name: z.string().trim().min(1, "Please add a resource name").max(120),
  why: z.string().trim().min(1, "Please share why you recommend it").max(800),
  url: z.string().trim().url("Please paste a full link").startsWith("https://", "Link must start with https://").max(2000),
});