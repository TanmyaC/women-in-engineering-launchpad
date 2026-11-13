import { AuthorBadge } from "@/components/AuthorBadge";
import { ChevronDown } from "lucide-react";
import { CompanyContacts, useCompanyContacts } from "@/components/CompanyContacts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { cardClass } from "@/components/SiteShell";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(1, "Please add the company name").max(100),
  note: z.string().trim().max(400).transform((v) => v || null),
  url: z.union([z.literal(""), z.string().trim().max(300).url("Please paste a full link").startsWith("https://", "Link must start with https://")]).transform((v) => v || null),
});
const input = "w-full rounded-lg border border-input bg-background px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-ring";

export function TargetCompanies() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["target_companies"],
    queryFn: async () => {
      const { data, error } = await supabase.from("target_companies").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const { data: contacts = [] } = useCompanyContacts();
  const add = useMutation({
    mutationFn: async (c: z.infer<typeof schema>) => {
      const { error } = await supabase.from("target_companies").insert(c);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["target_companies"] }); setOpen(false); },
    onError: () => setError("Something went wrong. Please try again."),
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const parsed = schema.safeParse({ name: f.get("name"), note: String(f.get("note") ?? ""), url: String(f.get("url") ?? "").trim() });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Please check the form");
    setError(null);
    add.mutate(parsed.data);
  }

  return (
    <section className="mx-auto max-w-6xl px-6 pb-16">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-10">
        <button type="button" onClick={() => setExpanded((x) => !x)} aria-expanded={expanded} className="group flex w-full items-center justify-between gap-4 text-left">
          <div>
          <h2 className="text-3xl font-bold text-forest">Companies we're targeting</h2>
          <p className="mt-1 text-muted-foreground">Share where you're applying — find others aiming for the same place.</p>
          </div>
          <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-primary shadow-sm transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground ${expanded ? "rotate-180" : ""}`} aria-hidden><ChevronDown size={22} strokeWidth={2.5} /></span>
        </button>
      {expanded && (<>
      {!open && <div className="mt-6"><button onClick={() => setOpen(true)} className="rounded-full border border-forest px-6 py-3 font-medium text-forest transition hover:bg-secondary">+ Add a company</button></div>}
      {open && (
        <form onSubmit={submit} className={`${cardClass} mt-6 grid gap-4`}>
          <label className="grid gap-1 text-sm font-medium">Company name<input name="name" placeholder="e.g. Adyen" className={input} maxLength={100} /></label>
          <label className="grid gap-1 text-sm font-medium">Note <span className="text-xs font-normal text-muted-foreground">Roles, why it's interesting, tips (optional)</span><textarea name="note" rows={2} className={input} maxLength={400} /></label>
          <label className="grid gap-1 text-sm font-medium">Careers link <span className="text-xs font-normal text-muted-foreground">(optional)</span><input name="url" placeholder="https://…" className={input} maxLength={300} /></label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-3">
            <button disabled={add.isPending} className="rounded-full bg-primary px-6 py-2.5 font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60">{add.isPending ? "Saving…" : "Add company"}</button>
            <button type="button" onClick={() => { setOpen(false); setError(null); }} className="rounded-full px-6 py-2.5 text-muted-foreground hover:bg-muted">Cancel</button>
          </div>
        </form>
      )}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && <p className="text-muted-foreground">Loading companies…</p>}
        {!isLoading && companies.length === 0 && <p className="text-muted-foreground">No companies yet — add the first one!</p>}
        {companies.map((c) => (
          <div key={c.id} className={cardClass}>
            <div className="flex items-start justify-between gap-3"><h3 className="text-xl font-bold text-forest">🏢 {c.name}</h3><AuthorBadge initials={c.author_initials} entry={{ table: "target_companies", id: c.id, createdBy: c.created_by }} /></div>
            {c.note && <p className="mt-2 whitespace-pre-line text-muted-foreground">{c.note}</p>}
            {c.url && <a href={c.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-medium text-primary underline-offset-4 hover:underline">Careers page ↗</a>}
            <CompanyContacts companyId={c.id} contacts={contacts.filter((x) => x.company_id === c.id)} />
          </div>
        ))}
      </div>
      </>)}
      </div>
    </section>
  );
}
