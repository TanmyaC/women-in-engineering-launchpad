import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, cardClass } from "@/components/SiteShell";
import { mentors } from "@/data/content";

export const Route = createFileRoute("/mentorship")({
  head: () => ({ meta: [{ title: "Mentorship — Miro Women In Engineering" }, { name: "description", content: "Book a session with a mentor from Miro Women In Engineering." }, { property: "og:title", content: "Mentorship — Miro Women In Engineering" }, { property: "og:description", content: "Book a session with a mentor from Miro Women In Engineering." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Mentorship,
});

function Mentorship() {
  return (
    <>
      <PageHeader eyebrow="Mentorship" title="Book time with a mentor" intro="Pick a mentor whose experience matches what you're working on and grab a slot." />
      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {mentors.map((m, i) => (
          <div key={i} className={`${cardClass} flex flex-col`}>
            <div className="h-14 w-14 rounded-full bg-gradient-warm" />
            <h2 className="mt-4 text-xl font-bold text-forest">{m.name}</h2>
            <p className="text-muted-foreground">{m.role}</p>
            <div className="mt-3 flex flex-wrap gap-2">{m.topics.map((t) => <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">{t}</span>)}</div>
            <a href={m.bookingUrl} target="_blank" rel="noreferrer" className="mt-6 rounded-full bg-primary px-5 py-2.5 text-center font-medium text-primary-foreground transition hover:opacity-90">Book a session</a>
          </div>
        ))}
      </section>
    </>
  );
}
