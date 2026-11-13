import { describe, expect, it } from "vitest";
import { engineeringResourceSchema } from "@/lib/engineering-resource";

describe("Resource contributions", () => {
  const resource = { name: "Coding practice", why: "Useful exercises", url: "https://example.org/practice" };
  it("accepts a name, recommendation reason and link", () => {
    expect(engineeringResourceSchema.safeParse(resource).success).toBe(true);
  });
  it.each(["name", "why", "url"])("requires %s", (field) => {
    expect(engineeringResourceSchema.safeParse({ ...resource, [field]: "" }).success).toBe(false);
  });
  it("rejects unsafe links", () => {
    expect(engineeringResourceSchema.safeParse({ ...resource, url: "javascript:alert(1)" }).success).toBe(false);
  });
});