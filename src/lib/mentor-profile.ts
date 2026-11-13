import { z } from "zod";

export const mentorProfileSchema = z.object({
  name: z.string().trim().min(1, "Please add your name").max(100),
  role: z.string().trim().min(1, "Please add your function").max(100),
  topics: z.array(z.string().trim().min(1).max(40)).max(8, "Up to 8 topics"),
  linkedin_url: z.string().trim().min(1, "Please add your LinkedIn profile").max(300).refine(
    (value) => /^https:\/\/(www\.)?linkedin\.com\/in\/[^\s]+$/.test(value),
    "Please paste a LinkedIn profile link starting with https://www.linkedin.com/in/",
  ),
});