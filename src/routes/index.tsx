import { createFileRoute, Link } from "@tanstack/react-router";
import { cardClass } from "@/components/SiteShell";
import { sessions } from "@/data/content";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Resource hub — Miro Women In Engineering" }, { name: "description", content: "Session notes, job search help, interview prep and mentorship for Miro Women In Engineering." }, { property: "og:title", content: "Resource hub — Miro Women In Engineering" }, { property: "og:description", content: "Session notes, job search help, interview prep and mentorship for Miro Women In Engineering." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Index,
});

const themes = [
  { to: "/sessions", title: "Session notes", text: "Summaries and takeaways from our past sessions." },
  { to: "/jobs", title: "Finding a job", text: "Where to look, CVs, LinkedIn and negotiation." },
  { to: "/interview-prep", title: "Interview prep", text: "General tips plus guides for each function." },
  { to: "/mentorship", title: "Mentorship", text: "Book time with a mentor from our community." },
  { to: "/resources", title: "Useful resources", text: "Hand-picked links, tools and communities." },
] as const;

function Index() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Our resource hub</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-bold leading-[1.05] text-forest md:text-7xl">
          Everything we've learned, <span className="bg-gradient-warm bg-clip-text text-transparent">shared in one place.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Session notes, job search guides, interview prep and mentorship from Miro Women In Engineering.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/sessions" className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-soft transition hover:opacity-90">Read session notes</Link>
          <Link to="/mentorship" className="rounded-full border border-forest px-6 py-3 font-medium text-forest transition hover:bg-secondary">Book a mentor</Link>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((t, i) => (
          <Link key={t.to} to={t.to} className={`${cardClass} group transition hover:-translate-y-1 ${i === 0 ? "bg-forest text-forest-foreground" : ""}`}>
            <span className="text-sm text-primary">0{i + 1}</span>
            <h2 className="mt-3 text-2xl font-bold">{t.title}</h2>
            <p className={`mt-2 ${i === 0 ? "opacity-80" : "text-muted-foreground"}`}>{t.text}</p>
            {i === 0 && <p className="mt-4 text-sm opacity-80">{sessions.length} summary so far</p>}
          </Link>
        ))}
      </section>
    </>
  );
}
