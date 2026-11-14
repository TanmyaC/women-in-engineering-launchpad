import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync("drizzle/migrations/0027_allow_authors_to_edit_prompts.sql", "utf8");

describe("Prompt edit permissions", () => {
  it("requires membership and the original author for both the existing and saved row", () => {
    expect(migration).toMatch(/USING\s*\(public\.is_member\(auth\.uid\(\)\) AND created_by = auth\.uid\(\)\)/i);
    expect(migration).toMatch(/WITH CHECK\s*\(public\.is_member\(auth\.uid\(\)\) AND created_by = auth\.uid\(\)\)/i);
  });
  it("allows changing prompt content without granting changes to ownership", () => {
    expect(migration).toMatch(/GRANT UPDATE \(title, description, prompt\) ON public\.prompts TO authenticated/i);
    expect(migration).not.toMatch(/GRANT UPDATE(?:\s+ON|\s*\([^)]*created_by)/i);
  });
});