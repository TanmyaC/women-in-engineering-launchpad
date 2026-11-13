import { describe, expect, it } from "vitest";
import { normalizeInviteCode } from "@/lib/invite";

describe("normalizeInviteCode", () => {
  it("accepts a valid code", () => expect(normalizeInviteCode(" It3trlSwcQ5- ")).toBe("It3trlSwcQ5-"));
  it("rejects missing or malformed codes", () => {
    expect(normalizeInviteCode(undefined)).toBeNull();
    expect(normalizeInviteCode("a b<script>")).toBeNull();
  });
});
