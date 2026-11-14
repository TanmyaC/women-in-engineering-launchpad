import { AuthorBadge } from "@/components/AuthorBadge";
import { Check, ChevronDown, Copy, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { cardClass } from "@/components/SiteShell";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import type { Database } from "@/integrations/supabase/types";

type PromptEntry = Database["public"]["Tables"]["prompts"]["Row"];

const schema = z.object({
  title: z.string().trim().min(1, "Please add a heading").max(120),
  description: z.string().trim().min(1, "Please add a short description").max(800),
  prompt: z.string().trim().min(1, "Please paste the prompt").max(5000),
});
const input = "w-full rounded-lg border border-input bg-background px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-ring";

export function PromptLibrary() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PromptEntry | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: tools = [], isLoading } = useQuery({
    queryKey: ["prompts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("prompts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const add = useMutation({
    mutationFn: async ({ values, id }: { values: z.infer<typeof schema>; id?: string }) => {
      const { error } = id
        ? await supabase.from("prompts").update(values).eq("id", id).select("id").single()
        : await supabase.from("prompts").insert(values);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["prompts"] }); setOpen(false); setEditing(null); },
    onError: () => setError("Something went wrong. Please try again."),
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const parsed = schema.safeParse({ title: f.get("title"), description: f.get("description"), prompt: f.get("prompt") });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Please check the form");
    setError(null);
    add.mutate({ values: parsed.data, id: editing?.id });
  }

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-10">
        <button type="button" onClick={() => setExpanded((x) => !x)} aria-expanded={expanded} className="group flex w-full items-center justify-between gap-4 text-left">
          <div>
          <h2 className="text-3xl font-bold text-forest">Prompt library</h2>
          <p className="mt-1 text-muted-foreground">Useful AI prompts shared by members — copy and adapt.</p>
          </div>
          <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-primary shadow-sm transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground ${expanded ? "rotate-180" : ""}`} aria-hidden><ChevronDown size={22} strokeWidth={2.5} /></span>
        </button>
      {expanded && (<>
      {!open && <div className="mt-6"><Button variant="outline" onClick={() => { setEditing(null); setError(null); setOpen(true); }} className="h-auto rounded-full border-forest px-6 py-3 text-base text-forest">+ Add a prompt</Button></div>}
      {open && (
        <form key={editing?.id ?? "new"} onSubmit={submit} className={`${cardClass} mt-6 grid gap-4`}>
          {editing && <h3 className="text-xl font-bold text-forest">Edit prompt</h3>}
          <label className="grid gap-1 text-sm font-medium">Heading<input name="title" defaultValue={editing?.title ?? ""} placeholder="e.g. Tailor my résumé to a job post" className={input} maxLength={120} /></label>
          <label className="grid gap-1 text-sm font-medium">Description<textarea name="description" defaultValue={editing?.description ?? ""} rows={3} placeholder="When to use it and why it works" className={input} maxLength={800} /></label>
          <label className="grid gap-1 text-sm font-medium">Prompt<textarea name="prompt" defaultValue={editing?.prompt ?? ""} rows={6} placeholder="Paste the prompt here…" className={`${input} font-mono text-sm`} maxLength={5000} /></label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-3">
            <Button type="submit" disabled={add.isPending} className="h-auto rounded-full px-6 py-2.5 text-base">{add.isPending ? "Saving…" : editing ? "Save changes" : "Add prompt"}</Button>
            <Button variant="ghost" type="button" disabled={add.isPending} onClick={() => { setOpen(false); setEditing(null); setError(null); }} className="h-auto rounded-full px-6 py-2.5 text-base text-muted-foreground">Cancel</Button>
          </div>
        </form>
      )}
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {isLoading && <p className="text-muted-foreground">Loading prompts…</p>}
        {!isLoading && tools.length === 0 && <p className="text-muted-foreground">No prompts yet — share the first one!</p>}
        {tools.map((t) => (
          <div key={t.id} className={cardClass}>
            <div className="flex items-start justify-between gap-3"><h3 className="text-xl font-bold text-forest">{t.title}</h3><AuthorBadge initials={t.author_initials} name={t.author_name} entry={{ table: "prompts", id: t.id, createdBy: t.created_by }} onEdit={add.isPending ? undefined : () => { setEditing(t); setError(null); setOpen(true); }} /></div>
            <p className="mt-2 whitespace-pre-line text-muted-foreground">{t.description}</p>
            <PromptBox title={t.title} text={t.prompt} />
          </div>
        ))}
      </div>
      </>)}
      </div>
    </section>
  );
}

function PromptBox({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-full border border-forest px-4 py-1.5 text-sm font-medium text-forest transition hover:bg-secondary">
          <Eye size={15} aria-hidden="true" /> View prompt
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle className="text-forest">{title}</DialogTitle></DialogHeader>
        <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-lg bg-muted p-4 font-mono text-sm text-foreground">{text}</pre>
        <div className="flex justify-end">
          <button type="button" onClick={copy} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90">
            {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />} {copied ? "Copied!" : "Copy to clipboard"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
