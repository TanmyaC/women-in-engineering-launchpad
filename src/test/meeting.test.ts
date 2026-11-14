import { describe, expect, it } from "vitest";
import { meetingSchema } from "@/lib/meeting";

const now = new Date("2026-11-14T10:00:00");
const ok = { topic: "Salary negotiation", description: "", date: "2026-11-20", time: "18:00", meet_url: "https://meet.google.com/abc-defg-hij" };
describe("Meeting form", () => {
  it("accepts a future meeting with a Google Meet link", () => {
    expect(meetingSchema(now).safeParse(ok).success).toBe(true);
  });
  it("rejects links that aren't Google Meet", () => {
    expect(meetingSchema(now).safeParse({ ...ok, meet_url: "https://zoom.us/j/123" }).success).toBe(false);
  });
  it("rejects meetings in the past", () => {
    expect(meetingSchema(now).safeParse({ ...ok, date: "2026-11-13" }).success).toBe(false);
  });
  it("requires a topic", () => {
    expect(meetingSchema(now).safeParse({ ...ok, topic: " " }).success).toBe(false);
  });
});
