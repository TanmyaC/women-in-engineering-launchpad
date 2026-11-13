import { AuthorBadge } from "@/components/AuthorBadge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

type Topic = { id: string; title: string; votes: number; created_at: string; author_initials?: string | null; created_by?: string | null };
const KEY = "mwie-voted-topics";
const titleSchema = z.string().trim().min(3, "A few more words please").max(120, "Keep it under 120 characters");

export function TopicBoard() {
  const qc = useQueryClient();
  const [voted, setVoted] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pop, setPop] = useState<string | null>(null);

  useEffect(() => {
    try { setVoted(JSON.parse(localStorage.getItem(KEY) ?? "[]")); } catch { /* ignore */ }
  }, []);
  const remember = (id: string) => {
    const next = [...voted, id];
    setVoted(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const { data: topics = [], isLoading } = useQuery({
    queryKey: ["topics"],
    queryFn: async () => {
      const { data, error } = await supabase.from("topics").select("*").order("votes", { ascending: false }).order("created_at");
      if (error) throw error;
      return data as Topic[];
    },
  });

  const upvote = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc("upvote_topic", { _id: id });
      if (error) throw error;
    },
    onMutate: (id) => {
      remember(id);
      setPop(id);
      setTimeout(() => setPop(null), 600);
      qc.setQueryData<Topic[]>(["topics"], (old = []) => old.map((t) => (t.id === id ? { ...t, votes: t.votes + 1 } : t)));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["topics"] }),
  });

  const add = useMutation({
    mutationFn: async (title: string) => {
      const { data, error } = await supabase.from("topics").insert({ title }).select().single();
      if (error) throw error;
      return data as Topic;
    },
    onSuccess: (t) => { remember(t.id); setDraft(""); qc.invalidateQueries({ queryKey: ["topics"] }); },
    onError: () => setError("Couldn't add that topic — please try again."),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = titleSchema.safeParse(draft);
    if (!p.success) return setError(p.error.issues[0]?.message ?? "Please check your topic");
    setError(null);
    add.mutate(p.data);
  };

  const max = Math.max(1, ...topics.map((t) => t.votes));
  const totalVotes = topics.reduce((s, t) => s + t.votes, 0);

  return (
    <div className="relative overflow-hidden rounded-[calc(var(--radius)+12px)] bg-forest p-6 text-forest-foreground shadow-soft md:p-10">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-sage/40 blur-3xl" />
      <div className="relative grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-forest-foreground/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" /> Live · You decide
          </span>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">What is on top<br />of your mind <br />lately?</h2>
          <p className="mt-4 opacity-80">Pitch a topic or upvote the ones you'd love to see. The most wanted ideas become our next discussion.</p>
          <div className="mt-6 flex gap-6">
            <div><p className="font-display text-3xl font-bold text-accent">{topics.length}</p><p className="text-sm opacity-70">ideas</p></div>
            <div><p className="font-display text-3xl font-bold text-accent">{totalVotes}</p><p className="text-sm opacity-70">votes cast</p></div>
          </div>
          <form onSubmit={submit} className="mt-8">
            <label htmlFor="topic" className="text-sm font-medium opacity-90">Got an idea?</label>
            <div className="mt-2 flex gap-2 rounded-full bg-background p-1.5 focus-within:ring-2 focus-within:ring-accent">
              <input id="topic" value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={120} placeholder="e.g. Negotiating your first senior offer" className="min-w-0 flex-1 bg-transparent px-4 text-foreground outline-none placeholder:text-muted-foreground" />
              <button disabled={add.isPending} className="shrink-0 rounded-full bg-primary px-5 py-2.5 font-medium text-primary-foreground transition hover:scale-105 disabled:opacity-60">{add.isPending ? "Adding…" : "Pitch it"}</button>
            </div>
            {error && <p className="mt-2 text-sm text-accent">{error}</p>}
          </form>
        </div>

        <ul className="relative space-y-3">
          {isLoading && <li className="opacity-70">Loading ideas…</li>}
          {!isLoading && topics.length === 0 && (
            <li className="rounded-2xl border border-dashed border-forest-foreground/30 p-8 text-center opacity-80">No ideas yet — be the first to pitch one! ✨</li>
          )}
          {topics.slice(0, 8).map((t, i) => {
            const has = voted.includes(t.id);
            return (
              <li key={t.id} className="group relative flex items-center gap-4 overflow-hidden rounded-2xl bg-forest-foreground/10 p-3 pr-4 transition hover:bg-forest-foreground/15">
                <div className="absolute inset-y-0 left-0 bg-forest-foreground/10 transition-all duration-700" style={{ width: `${(t.votes / max) * 100}%` }} />
                <button
                  onClick={() => !has && upvote.mutate(t.id)}
                  disabled={has}
                  aria-label={has ? "You voted for this" : `Upvote ${t.title}`}
                  className={`relative flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl font-display font-bold transition ${has ? "bg-accent text-accent-foreground" : "bg-background text-forest hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"} ${pop === t.id ? "scale-125" : ""}`}
                >
                  <span className="text-xs leading-none">▲</span>
                  <span className="text-lg leading-tight">{t.votes}</span>
                </button>
                <div className="relative min-w-0 flex-1">
                  <p className="truncate font-medium">{t.title}</p>
                  <p className="text-xs opacity-60">{i === 0 ? "🔥 Most wanted" : i < 3 ? "Trending" : has ? "You're in" : "Tap to upvote"}</p>
                </div>
                <AuthorBadge initials={t.author_initials} entry={{ table: "topics", id: t.id, createdBy: t.created_by }} className="relative text-forest-foreground [&_.badge-initials]:bg-forest-foreground/20 [&_.badge-initials]:text-forest-foreground" />
                <span className="relative font-display text-sm opacity-50">#{i + 1}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
