import { describe, expect, it } from "vitest";
import { mentorProfileSchema } from "@/lib/mentor-profile";

describe("Mentor LinkedIn profiles", () => {
  const mentor = { name: "Test mentor", role: "Engineering", topics: ["Career growth"] };
  it("accepts a LinkedIn profile", () => {
    const result = mentorProfileSchema.parse({ ...mentor, linkedin_url: "https://www.linkedin.com/in/test-mentor/" });
    expect(result.linkedin_url).toBe("https://www.linkedin.com/in/test-mentor/");
  });
  it("requires a LinkedIn profile", () => {
    expect(mentorProfileSchema.safeParse({ ...mentor, linkedin_url: "" }).success).toBe(false);
    expect(mentorProfileSchema.safeParse(mentor).success).toBe(false);
  });
  it("accepts a mentor without a booking link", () => {
    const result = mentorProfileSchema.safeParse({ ...mentor, linkedin_url: "https://www.linkedin.com/in/test-mentor/" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).not.toHaveProperty("booking_url");
  });
  it.each(["javascript:alert(1)", "https://linkedin.com.evil.org/in/test", "https://example.org/in/test", "https://www.linkedin.com/company/test"])("rejects non-profile link %s", (linkedin_url) => {
    expect(mentorProfileSchema.safeParse({ ...mentor, linkedin_url }).success).toBe(false);
  });
});