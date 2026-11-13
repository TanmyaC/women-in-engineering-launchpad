import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, cardClass } from "@/components/SiteShell";
import { interviewPrep } from "@/data/content";

export const Route = createFileRoute("/interview-prep")({
  head: () => ({ meta: [{ title: "Interview prep — Miro Women In Engineering" }, { name: "description", content: "General interview tips and role-specific guides for engineering, management, product and data." }, { property: "og:title", content: "Interview prep — Miro Women In Engineering" }, { property: "og:description", content: "General interview tips and role-specific guides for engineering, management, product and data." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Prep,
});

function Prep() {
  return (
    <>
      <PageHeader eyebrow="Interview prep" title="Walk in prepared" intro="Start with the basics that apply everywhere, then go deeper for your function." />
      <section className="mx-auto max-w-6xl px-6">
        <div className={`${cardClass} bg-forest text-forest-foreground`}>
          <h2 className="text-2xl font-bold">For every interview</h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">{interviewPrep.generic.map((g) => <li key={g} className="opacity-90">✓ {g}</li>)}</ul>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-5 px-6 py-10 pb-20 md:grid-cols-2">
        {interviewPrep.functions.map((f) => (
          <div key={f.name} className={cardClass}>
            <h3 className="text-xl font-bold text-forest">{f.name}</h3>
            <ul className="mt-3 space-y-2 text-muted-foreground">{f.items.map((i) => <li key={i}>— {i}</li>)}</ul>
          </div>
        ))}
      </section>
    </>
  );
}
