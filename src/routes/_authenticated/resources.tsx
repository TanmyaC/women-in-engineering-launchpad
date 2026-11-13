import { createFileRoute } from "@tanstack/react-router";
import { cardClass } from "@/components/SiteShell";
import { resources } from "@/data/content";
import { BookShelf } from "@/components/BookShelf";
import { PromptLibrary } from "@/components/PromptLibrary";

export const Route = createFileRoute("/_authenticated/resources")({
  head: () => ({ meta: [{ title: "Useful resources — Miro Women In Engineering" }, { name: "description", content: "Hand-picked links, tools and communities for women in engineering." }, { property: "og:title", content: "Useful resources — Miro Women In Engineering" }, { property: "og:description", content: "Hand-picked links, tools and communities for women in engineering." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Resources,
});

function Resources() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-14">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Useful resources</p>
        <h1 className="mt-3 text-3xl font-bold text-forest">Links worth bookmarking</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">Tools, guides and communities our members recommend.</p>
      </section>
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
      <PromptLibrary />
      <BookShelf />
    </>
  );
}
