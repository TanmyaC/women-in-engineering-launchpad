import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/SiteShell";
import { interviewPrep } from "@/data/content";

export const Route = createFileRoute("/interview-prep")({
  head: () => ({ meta: [{ title: "Interview prep — Miro Women In Engineering" }, { name: "description", content: "General interview tips and role-specific guides for engineering, management, product and data." }, { property: "og:title", content: "Interview prep — Miro Women In Engineering" }, { property: "og:description", content: "General interview tips and role-specific guides for engineering, management, product and data." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Prep,
});

function Section({ title, items, mark }: { title: string; items: string[]; mark: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="group flex w-full items-center justify-between gap-4 text-left">
        <h2 className="text-2xl font-bold text-forest">{title}</h2>
        <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-primary shadow-sm transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground ${open ? "rotate-180" : ""}`} aria-hidden><ChevronDown size={22} strokeWidth={2.5} /></span>
      </button>
      {open && <ul className="mt-5 grid gap-3 text-muted-foreground md:grid-cols-2">{items.map((i) => <li key={i}>{mark} {i}</li>)}</ul>}
    </div>
  );
}

function Prep() {
  return (
    <>
      <PageHeader eyebrow="Interview prep" title="Walk in prepared" intro="Start with the basics that apply everywhere, then go deeper for your function." />
      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-20">
        <Section title="For every interview" items={interviewPrep.generic} mark="✓" />
        {interviewPrep.functions.map((f) => <Section key={f.name} title={f.name} items={f.items} mark="—" />)}
      </section>
    </>
  );
}
