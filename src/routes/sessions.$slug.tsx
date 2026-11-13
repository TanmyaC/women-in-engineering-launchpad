import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { cardClass } from "@/components/SiteShell";
import { sessions } from "@/data/content";
import { useState } from "react";
import { PdfViewer } from "@/components/PdfViewer";

export const Route = createFileRoute("/sessions/$slug")({
  loader: ({ params }) => {
    const session = sessions.find((s) => s.slug === params.slug);
    if (!session) throw notFound();
    return session;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Miro Women In Engineering` },
          { name: "description", content: loaderData.summary },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: loaderData.summary },
          { property: "og:type", content: "article" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Session not found" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-3xl font-bold text-forest">Session not found</h1>
      <Link to="/sessions" className="mt-4 inline-block text-primary underline">Back to session notes</Link>
    </div>
  ),
  component: SessionPage,
});

function SessionPage() {
  const s = Route.useLoaderData();
  const [open, setOpen] = useState(false);
  return (
    <article className="mx-auto max-w-5xl px-6 pb-20 pt-14">
      <Link to="/sessions" className="text-sm text-primary">← All session notes</Link>
      <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-primary">{s.theme}</p>
      <h1 className="mt-2 text-4xl font-bold text-forest md:text-5xl">{s.title}</h1>
      <p className="mt-2 text-xl text-muted-foreground">{s.subtitle}</p>
      <p className="mt-3 text-muted-foreground">{s.speaker && `${s.speaker} · `}{new Date(s.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={() => setOpen((o) => !o)} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-medium text-primary-foreground transition hover:opacity-90">{open ? "Hide preview" : "👁 Preview document"}</button>
        <a href={s.pdf.url} download={s.pdf.filename} className="inline-flex items-center gap-2 rounded-full border border-primary px-5 py-2.5 font-medium text-primary transition hover:bg-primary/10">↓ Download PDF</a>
      </div>
      {open && <div className="mt-8"><PdfViewer url={s.pdf.url} /></div>}
    </article>
  );
}
