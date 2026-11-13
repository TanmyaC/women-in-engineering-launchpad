import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthCard } from "./auth";
import { INVITE_STORAGE_KEY, normalizeInviteCode } from "@/lib/invite";

export const Route = createFileRoute("/join")({
  validateSearch: (s: Record<string, unknown>): { code?: string } => ({ code: typeof s["code"] === "string" ? s["code"] : undefined }),
  head: () => ({
    meta: [
      { title: "Join · Miro Women In Engineering" },
      { name: "description", content: "You've been invited to join the Miro Women In Engineering community." },
      { property: "og:title", content: "Join Miro Women In Engineering" },
      { property: "og:description", content: "You've been invited to join the Miro Women In Engineering community." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: JoinPage,
});

function JoinPage() {
  const { code } = Route.useSearch();
  const valid = normalizeInviteCode(code);
  const [error, setError] = useState<string | null>(valid ? null : "This invite link looks incomplete. Ask for a fresh link.");
  useEffect(() => { if (valid) sessionStorage.setItem(INVITE_STORAGE_KEY, valid); }, [valid]);
  return <AuthCard title="You're invited" text="Join our community with your Google account." error={error} onError={setError} />;
}
