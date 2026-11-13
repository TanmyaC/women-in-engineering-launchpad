import { ChevronDown } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { cardClass } from "@/components/SiteShell";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  title: z.string().trim().min(1, "Please add a heading").max(120),
  description: z.string().trim().min(1, "Please add a short description").max(800),
});
const input = "w-full rounded-lg border border-input bg-background px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-ring";

export function BestPractices() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: tools = [], isLoading } = useQuery({
    queryKey: ["best_practices"],
    queryFn: async () => {
      const { data, error } = await supabase.from("best_practices").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const add = useMutation({
    mutationFn: async (t: z.infer<typeof schema>) => {
      const { error } = await supabase.from("best_practices").insert(t);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["best_practices"] }); setOpen(false); },
    onError: () => setError("Something went wrong. Please try again."),
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const parsed = schema.safeParse({ title: f.get("title"), description: f.get("description") });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Please check the form");
    setError(null);
    add.mutate(parsed.data);
  }

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-10">
        <button type="button" onClick={() => setExpanded((x) => !x)} aria-expanded={expanded} className="group flex w-full items-center justify-between gap-4 text-left">
          <div>
          <h2 className="text-3xl font-bold text-forest">Best practices</h2>
          <p className="mt-1 text-muted-foreground">Habits and tips that made a difference in your job search.</p>
          </div>
          <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-primary shadow-sm transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground ${expanded ? "rotate-180" : ""}`} aria-hidden><ChevronDown size={22} strokeWidth={2.5} /></span>
        </button>
      {expanded && (<>
      {!open && <div className="mt-6"><button onClick={() => setOpen(true)} className="rounded-full border border-forest px-6 py-3 font-medium text-forest transition hover:bg-secondary">+ Add a best practice</button></div>}
      {open && (
        <form onSubmit={submit} className={`${cardClass} mt-6 grid gap-4`}>
          <label className="grid gap-1 text-sm font-medium">Heading<input name="title" placeholder="e.g. Follow up within 24 hours" className={input} maxLength={100} /></label>
          <label className="grid gap-1 text-sm font-medium">Description<textarea name="description" rows={3} placeholder="What do you do and why does it work?" className={input} maxLength={600} /></label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-3">
            <button disabled={add.isPending} className="rounded-full bg-primary px-6 py-2.5 font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60">{add.isPending ? "Saving…" : "Add best practice"}</button>
            <button type="button" onClick={() => { setOpen(false); setError(null); }} className="rounded-full px-6 py-2.5 text-muted-foreground hover:bg-muted">Cancel</button>
          </div>
        </form>
      )}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && <p className="text-muted-foreground">Loading best practices…</p>}
        {!isLoading && tools.length === 0 && <p className="text-muted-foreground">No best practices yet — share the first one!</p>}
        {tools.map((t) => (
          <div key={t.id} className={cardClass}>
            <h3 className="text-xl font-bold text-forest">{t.title}</h3>
            <p className="mt-2 whitespace-pre-line text-muted-foreground">{t.description}</p>
          </div>
        ))}
      </div>
      </>)}
      </div>
    </section>
  );
}
