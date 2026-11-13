import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, cardClass } from "@/components/SiteShell";
import { sessions } from "@/data/content";

export const Route = createFileRoute("/sessions/")({
  head: () => ({ meta: [{ title: "Session notes — Miro Women In Engineering" }, { name: "description", content: "Summaries and key takeaways from Miro Women In Engineering sessions." }, { property: "og:title", content: "Session notes — Miro Women In Engineering" }, { property: "og:description", content: "Summaries and key takeaways from Miro Women In Engineering sessions." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Sessions,
});

function Sessions() {
  return (
    <>
      <PageHeader eyebrow="Session notes" title="Learn from every session" intro="Missed a session or want a refresher? Here are the summaries and takeaways." />
      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-20 md:grid-cols-2">
        {sessions.map((s) => (
          <Link key={s.slug} to="/sessions/$slug" params={{ slug: s.slug }} className={`${cardClass} transition hover:-translate-y-1`}>
            <div className="flex items-center gap-2 text-sm">
              <span className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">{s.theme}</span>
              <span className="text-muted-foreground">{new Date(s.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-forest">{s.title}</h2>
            <p className="mt-1 text-sm font-medium text-primary">{s.subtitle}</p>
            <p className="mt-2 text-muted-foreground">{s.summary}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
