import { AuthorBadge } from "@/components/AuthorBadge";
import { ChevronDown } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { cardClass } from "@/components/SiteShell";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  title: z.string().trim().min(1, "Please add a name for the tool").max(100),
  description: z.string().trim().min(1, "Please add a short description").max(600),
  url: z.union([z.literal(""), z.string().trim().max(300).url("Please paste a full link").startsWith("https://", "Link must start with https://")]).transform((v) => v || null),
});
const input = "w-full rounded-lg border border-input bg-background px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-ring";

export function JobTools() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: tools = [], isLoading } = useQuery({
    queryKey: ["job_tools"],
    queryFn: async () => {
      const { data, error } = await supabase.from("job_tools").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const add = useMutation({
    mutationFn: async (t: z.infer<typeof schema>) => {
      const { error } = await supabase.from("job_tools").insert(t);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["job_tools"] }); setOpen(false); },
    onError: () => setError("Something went wrong. Please try again."),
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const parsed = schema.safeParse({ title: f.get("title"), description: f.get("description"), url: String(f.get("url") ?? "").trim() });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Please check the form");
    setError(null);
    add.mutate(parsed.data);
  }

  return (
    <section className="mx-auto max-w-6xl px-6 pb-16">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-10">
        <button type="button" onClick={() => setExpanded((x) => !x)} aria-expanded={expanded} className="group flex w-full items-center justify-between gap-4 text-left">
          <div>
          <h2 className="text-3xl font-bold text-forest">Tools we recommend</h2>
          <p className="mt-1 text-muted-foreground">Job boards, CV helpers, AI tools — share what worked for you.</p>
          </div>
          <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-primary shadow-sm transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground ${expanded ? "rotate-180" : ""}`} aria-hidden><ChevronDown size={22} strokeWidth={2.5} /></span>
        </button>
      {expanded && (<>
      {!open && <div className="mt-6"><button onClick={() => setOpen(true)} className="rounded-full border border-forest px-6 py-3 font-medium text-forest transition hover:bg-secondary">+ Add a tool</button></div>}
      {open && (
        <form onSubmit={submit} className={`${cardClass} mt-6 grid gap-4`}>
          <label className="grid gap-1 text-sm font-medium">Tool name<input name="title" placeholder="e.g. Teal resume builder" className={input} maxLength={100} /></label>
          <label className="grid gap-1 text-sm font-medium">Description<textarea name="description" rows={3} placeholder="What is it and how did it help you?" className={input} maxLength={600} /></label>
          <label className="grid gap-1 text-sm font-medium">Link <span className="text-xs font-normal text-muted-foreground">GitHub, website or doc (optional)</span><input name="url" placeholder="https://github.com/…" className={input} maxLength={300} /></label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-3">
            <button disabled={add.isPending} className="rounded-full bg-primary px-6 py-2.5 font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60">{add.isPending ? "Saving…" : "Add tool"}</button>
            <button type="button" onClick={() => { setOpen(false); setError(null); }} className="rounded-full px-6 py-2.5 text-muted-foreground hover:bg-muted">Cancel</button>
          </div>
        </form>
      )}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && <p className="text-muted-foreground">Loading tools…</p>}
        {!isLoading && tools.length === 0 && <p className="text-muted-foreground">No tools yet — be the first to add one!</p>}
        {tools.map((t) => (
          <div key={t.id} className={cardClass}>
            <div className="flex items-start justify-between gap-3"><h3 className="text-xl font-bold text-forest">{t.title}</h3><AuthorBadge initials={t.author_initials} entry={{ table: "job_tools", id: t.id, createdBy: t.created_by }} /></div>
            <p className="mt-2 whitespace-pre-line text-muted-foreground">{t.description}</p>
            {t.url && <a href={t.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-medium text-primary underline-offset-4 hover:underline">Open link ↗</a>}
          </div>
        ))}
      </div>
      </>)}
      </div>
    </section>
  );
}
