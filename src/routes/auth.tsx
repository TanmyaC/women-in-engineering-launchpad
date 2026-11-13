import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GoogleButton } from "@/components/GoogleButton";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): { needInvite?: boolean | undefined } => ({ needInvite: s["needInvite"] === true || s["needInvite"] === "true" ? true : undefined }),
  head: () => ({
    meta: [
      { title: "Sign in · Miro Women In Engineering" },
      { name: "description", content: "Members-only sign in for the Miro Women In Engineering community." },
      { property: "og:title", content: "Sign in · Miro Women In Engineering" },
      { property: "og:description", content: "Members-only sign in for the Miro Women In Engineering community." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

export function AuthCard({ title, text, error, onError }: { title: string; text: string; error: string | null; onError: (m: string) => void }) {
  return (
    <section className="mx-auto flex max-w-md flex-col gap-5 px-6 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">Members only</p>
      <h1 className="text-4xl font-bold text-forest">{title}</h1>
      <p className="text-muted-foreground">{text}</p>
      {error && <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
      <GoogleButton onError={onError} />
    </section>
  );
}

function AuthPage() {
  const { needInvite } = Route.useSearch();
  const [error, setError] = useState<string | null>(
    needInvite ? "You need an invite link to join. Ask a community organiser to share it with you." : null,
  );
  return <AuthCard title="Welcome back" text="Sign in with Google to access our community hub." error={error} onError={setError} />;
}
