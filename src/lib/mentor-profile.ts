import { z } from "zod";

export const mentorProfileSchema = z.object({
  name: z.string().trim().min(1, "Please add your name").max(100),
  role: z.string().trim().min(1, "Please add your function").max(100),
  topics: z.array(z.string().trim().min(1).max(40)).max(8, "Up to 8 topics"),
  booking_url: z.string().trim().max(300).url("Please paste a full link").startsWith("https://", "Link must start with https://"),
  linkedin_url: z.string().trim().max(300).refine(
    (value) => value === "" || /^https:\/\/(www\.)?linkedin\.com\/in\/[^\s]+$/.test(value),
    "Please paste a LinkedIn profile link starting with https://www.linkedin.com/in/",
  ).transform((value) => value || null),
});