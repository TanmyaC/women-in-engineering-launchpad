import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Lightbulb, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { engineeringTipSchema } from "@/lib/engineering-tip";

export function EngineeringTips({ topic }: { topic: string }) {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryKey = ["engineering_tips", topic];
  const tips = useQuery({ queryKey, queryFn: async () => {
    const { data, error } = await supabase.from("engineering_tips").select("*").eq("topic", topic).order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  } });
  const add = useMutation({
    mutationFn: async (tip: string) => {
      const { error } = await supabase.from("engineering_tips").insert({ topic, tip });
      if (error) throw error;
    },
    onSuccess: async () => { await qc.invalidateQueries({ queryKey }); setAdding(false); },
    onError: () => setError("Could not save your tip. Please try again."),
  });
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = engineeringTipSchema.safeParse(new FormData(event.currentTarget).get("tip"));
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Please check your tip."); return; }
    setError(null);
    add.mutate(parsed.data);
  }
  return <section className="mt-6 border-t border-border pt-5" aria-label={`Tips for ${topic}`}>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h4 className="flex items-center gap-2 font-semibold text-forest"><Lightbulb size={18} aria-hidden />Community tips</h4>
      {!adding && <Button variant="outline" onClick={() => { setAdding(true); setError(null); }}><Plus aria-hidden />Add a tip</Button>}
    </div>
    {adding && <form onSubmit={submit} className="mt-4 grid max-w-2xl gap-3" aria-label={`Add tip for ${topic}`}>
      <label className="grid gap-1 text-sm font-medium">Your tip<input name="tip" required className="w-full rounded-lg border border-input bg-background px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-ring" /></label>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-3"><Button disabled={add.isPending} type="submit">{add.isPending ? "Saving…" : "Add tip"}</Button><Button variant="ghost" type="button" disabled={add.isPending} onClick={() => { setAdding(false); setError(null); }}>Cancel</Button></div>
    </form>}
    {tips.isPending && <p className="mt-3 text-sm text-muted-foreground">Loading tips…</p>}
    {tips.isError && <p role="alert" className="mt-3 text-sm text-destructive">Could not load tips. <Button variant="link" onClick={() => tips.refetch()}>Try again</Button></p>}
    {tips.isSuccess && tips.data.length === 0 && <p className="mt-3 text-sm text-muted-foreground">No tips added yet.</p>}
    <ul className="mt-3 space-y-2">{tips.data?.map((tip) => <li key={tip.id} className="flex gap-3 py-2 text-foreground"><span aria-hidden className="text-primary">•</span><span className="min-w-0 break-words">{tip.tip}</span></li>)}</ul>
  </section>;
}