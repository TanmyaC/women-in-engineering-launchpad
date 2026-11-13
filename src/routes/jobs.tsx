import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, cardClass } from "@/components/SiteShell";
import { jobTopics } from "@/data/content";

export const Route = createFileRoute("/jobs")({
  head: () => ({ meta: [{ title: "Finding a job — Miro Women In Engineering" }, { name: "description", content: "Job search guidance: where to look, CVs, LinkedIn and negotiation." }, { property: "og:title", content: "Finding a job — Miro Women In Engineering" }, { property: "og:description", content: "Job search guidance: where to look, CVs, LinkedIn and negotiation." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Jobs,
});

function Jobs() {
  return (
    <>
      <PageHeader eyebrow="Finding a job" title="Land your next role" intro="Practical advice gathered from our community on searching, applying and negotiating." />
      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-20 md:grid-cols-3">
        {jobTopics.map((t) => (
          <div key={t.title} className={cardClass}>
            <h2 className="text-xl font-bold text-forest">{t.title}</h2>
            <ul className="mt-3 space-y-2 text-muted-foreground">{t.items.map((i) => <li key={i}>— {i}</li>)}</ul>
          </div>
        ))}
      </section>
    </>
  );
}
