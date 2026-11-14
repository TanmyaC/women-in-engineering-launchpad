import { z } from "zod";

export const meetUrlPattern = /^https:\/\/meet\.google\.com\/[a-z0-9-]+(\?.*)?$/i;

export function meetingSchema(now: Date = new Date()) {
  return z.object({
    topic: z.string().trim().min(3, "Please add a topic").max(120, "Keep the topic under 120 characters"),
    description: z.string().trim().max(500, "Keep the description under 500 characters"),
    date: z.string().min(1, "Please pick a date"),
    time: z.string().min(1, "Please pick a time"),
    meet_url: z.string().trim().regex(meetUrlPattern, "Use a Google Meet link, like https://meet.google.com/abc-defg-hij"),
  }).transform((v, ctx) => {
    const startsAt = new Date(`${v.date}T${v.time}`);
    if (Number.isNaN(startsAt.getTime())) { ctx.addIssue({ code: "custom", message: "Please check the date and time" }); return z.NEVER; }
    if (startsAt <= now) { ctx.addIssue({ code: "custom", message: "Pick a time in the future" }); return z.NEVER; }
    return { topic: v.topic, description: v.description, starts_at: startsAt.toISOString(), meet_url: v.meet_url };
  });
}
