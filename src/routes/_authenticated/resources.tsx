import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, cardClass } from "@/components/SiteShell";
import { resources } from "@/data/content";
import { BookShelf } from "@/components/BookShelf";

export const Route = createFileRoute("/_authenticated/resources")({
  head: () => ({ meta: [{ title: "Useful resources — Miro Women In Engineering" }, { name: "description", content: "Hand-picked links, tools and communities for women in engineering." }, { property: "og:title", content: "Useful resources — Miro Women In Engineering" }, { property: "og:description", content: "Hand-picked links, tools and communities for women in engineering." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Resources,
});

function Resources() {
  return (
    <>
      <PageHeader eyebrow="Useful resources" title="Links worth bookmarking" intro="Tools, guides and communities our members recommend." />
      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-16 md:grid-cols-2">
        {resources.map((r) => (
          <a key={r.url} href={r.url} target="_blank" rel="noreferrer" className={`${cardClass} flex items-center justify-between transition hover:-translate-y-1`}>
            <div>
              <p className="text-xs uppercase tracking-widest text-primary">{r.category}</p>
              <h2 className="mt-1 text-lg font-bold text-forest">{r.title}</h2>
            </div>
            <span className="text-2xl text-primary">↗</span>
          </a>
        ))}
      </section>
      <BookShelf />
    </>
  );
}
