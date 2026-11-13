import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, Download } from "lucide-react";
import { PageHeader, cardClass } from "@/components/SiteShell";
import { sessions } from "@/data/content";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PdfViewer } from "@/components/PdfViewer";

export const Route = createFileRoute("/sessions/")({
  head: () => ({ meta: [{ title: "Session notes — Miro Women In Engineering" }, { name: "description", content: "Notes from Miro Women In Engineering sessions, ready to preview or download." }, { property: "og:title", content: "Session notes — Miro Women In Engineering" }, { property: "og:description", content: "Notes from Miro Women In Engineering sessions, ready to preview or download." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Sessions,
});

const iconBtn = "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-primary transition hover:bg-primary hover:text-primary-foreground";

function Sessions() {
  const [open, setOpen] = useState<(typeof sessions)[number] | null>(null);
  return (
    <>
      <PageHeader eyebrow="Session notes" title="Learn from every session" intro="Missed a session or want a refresher? Preview or download the notes." />
      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-20 md:grid-cols-2">
        {sessions.map((s) => (
          <div key={s.slug} className={`${cardClass} flex flex-col`}>
            <div className="flex items-center gap-2 text-sm">
              <span className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">{s.theme}</span>
              <span className="text-muted-foreground">{new Date(s.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-forest">{s.title}</h2>
            <p className="mt-1 text-sm font-medium text-primary">{s.subtitle}</p>
            <div className="mt-auto flex gap-2 pt-5">
              <button type="button" onClick={() => setOpen(s)} className={iconBtn} aria-label={`Preview ${s.title}`} title="Preview"><Eye className="h-4 w-4" /></button>
              <a href={s.pdf.url} download={s.pdf.filename} className={iconBtn} aria-label={`Download ${s.title}`} title="Download"><Download className="h-4 w-4" /></a>
            </div>
          </div>
        ))}
      </section>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogTitle>{open?.title}</DialogTitle>
          {open && <PdfViewer url={open.pdf.url} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
