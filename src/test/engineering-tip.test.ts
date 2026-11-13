import { describe, expect, it } from "vitest";
import { engineeringTipSchema } from "@/lib/engineering-tip";

describe("One-line engineering tips", () => {
  it("accepts a one-line tip", () => {
    expect(engineeringTipSchema.parse("Explain your thinking as you code.")).toBe("Explain your thinking as you code.");
  });
  it("rejects multiple lines", () => {
    expect(engineeringTipSchema.safeParse("First tip\nSecond tip").success).toBe(false);
  });
  it("requires a tip", () => {
    expect(engineeringTipSchema.safeParse("   ").success).toBe(false);
  });
});