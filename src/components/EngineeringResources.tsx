import { AuthorBadge } from "@/components/AuthorBadge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { engineeringResourceSchema } from "@/lib/engineering-resource";
import { EngineeringTips } from "@/components/EngineeringTips";

const inputClass = "w-full rounded-lg border border-input bg-background px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-ring";

export function EngineeringResources({ topic }: { topic: string }) {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryKey = ["engineering_resources", topic];
  const resources = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase.from("engineering_resources").select("*").eq("topic", topic).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const add = useMutation({
    mutationFn: async (resource: { name: string; why: string; url: string }) => {
      const { error } = await supabase.from("engineering_resources").insert({ ...resource, topic });
      if (error) throw error;
    },
    onSuccess: async () => { await qc.invalidateQueries({ queryKey }); setAdding(false); },
    onError: () => setError("Could not save your resource. Please try again."),
  });

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = engineeringResourceSchema.safeParse({ name: form.get("name"), why: form.get("why"), url: form.get("url") });
    if (!result.success) { setError(result.error.issues[0]?.message ?? "Please check the form."); return; }
    setError(null);
    add.mutate(result.data);
  }

  return <div className="mt-4">
    {!adding && <Button variant="outline" onClick={() => { setAdding(true); setError(null); }}><Plus aria-hidden />Add a resource</Button>}
    {adding && <form onSubmit={submit} className="grid max-w-2xl gap-4 py-4" aria-label={`Add resource for ${topic}`}>
      <label className="grid gap-1 text-sm font-medium">Resource name<input name="name" required maxLength={120} className={inputClass} /></label>
      <label className="grid gap-1 text-sm font-medium">Why recommend it?<textarea name="why" required maxLength={800} rows={3} className={inputClass} /></label>
      <label className="grid gap-1 text-sm font-medium">Link<input name="url" required type="url" maxLength={2000} placeholder="https://…" className={inputClass} /></label>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <div className="flex flex-wrap gap-3"><Button type="submit" disabled={add.isPending}>{add.isPending ? "Saving…" : "Add resource"}</Button><Button type="button" variant="ghost" disabled={add.isPending} onClick={() => { setAdding(false); setError(null); }}>Cancel</Button></div>
    </form>}
    {resources.isPending && <p className="mt-4 text-sm text-muted-foreground">Loading resources…</p>}
    {resources.isError && <div role="alert" className="mt-4 text-sm text-destructive">Could not load resources. <Button variant="link" onClick={() => resources.refetch()}>Try again</Button></div>}
    {resources.isSuccess && resources.data.length === 0 && <p className="mt-4 text-sm text-muted-foreground">No resources added yet.</p>}
    <div className="mt-4 divide-y divide-border">{resources.data?.map((resource) => <article key={resource.id} className="py-4">
      <div className="flex items-start justify-between gap-3"><h4 className="break-words text-lg font-semibold text-forest">{resource.name}</h4><AuthorBadge initials={resource.author_initials} name={resource.author_name} entry={{ table: "engineering_resources", id: resource.id, createdBy: resource.created_by }} /></div>
      <p className="mt-2 whitespace-pre-line break-words text-muted-foreground">{resource.why}</p>
      <Button asChild variant="link" className="mt-2 px-0"><a href={resource.url} target="_blank" rel="noopener noreferrer">Open resource<ExternalLink aria-hidden /></a></Button>
    </article>)}</div>
    <EngineeringTips topic={topic} />
  </div>;
}