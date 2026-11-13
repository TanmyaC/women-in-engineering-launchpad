import { AuthorBadge } from "@/components/AuthorBadge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { cardClass } from "@/components/SiteShell";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  title: z.string().trim().min(1, "Please add the book name").max(150),
  why: z.string().trim().min(1, "Please tell us why you recommend it").max(800),
  theme: z.string().trim().min(1, "Please pick a theme").max(60),
});
const THEMES = ["Leadership", "Career growth", "Management", "Product", "Design", "Communication", "Mindset"];
const input = "w-full rounded-lg border border-input bg-background px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-ring";

const TAGS: Record<string, string> = { leadership: "tag-leadership", "career growth": "tag-career", management: "tag-management", product: "tag-product", design: "tag-design", communication: "tag-communication", mindset: "tag-mindset" };
const tagClass = (t: string) => TAGS[t.toLowerCase()] ?? "tag-other";

export function BookShelf() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const { data, error } = await supabase.from("books").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const add = useMutation({
    mutationFn: async (book: z.infer<typeof schema>) => {
      const { error } = await supabase.from("books").insert(book);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["books"] }); setOpen(false); },
    onError: () => setError("Something went wrong. Please try again."),
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const parsed = schema.safeParse({ title: f.get("title"), why: f.get("why"), theme: f.get("theme") });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Please check the form");
    setError(null);
    add.mutate(parsed.data);
  }

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-forest">Books we recommend</h2>
          <p className="mt-1 text-muted-foreground">Reads that shaped your career — share them with the group.</p>
        </div>
        {!open && <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-md transition hover:-translate-y-0.5 hover:opacity-90">+ Add a book</button>}
      </div>
      {open && (
        <form onSubmit={submit} className={`${cardClass} mt-6 grid gap-4`}>
          <label className="grid gap-1 text-sm font-medium">Book name<input name="title" placeholder="e.g. The Manager's Path" className={input} maxLength={150} /></label>
          <label className="grid gap-1 text-sm font-medium">Theme<input name="theme" list="book-themes" placeholder="e.g. Leadership, Product, Mindset" className={input} maxLength={60} /><datalist id="book-themes">{THEMES.map((t) => <option key={t} value={t} />)}</datalist></label>
          <label className="grid gap-1 text-sm font-medium">Why you recommend it<textarea name="why" rows={3} placeholder="What did you take away from it?" className={input} maxLength={800} /></label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-3">
            <button disabled={add.isPending} className="rounded-full bg-primary px-6 py-2.5 font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60">{add.isPending ? "Saving…" : "Add book"}</button>
            <button type="button" onClick={() => { setOpen(false); setError(null); }} className="rounded-full px-6 py-2.5 text-muted-foreground hover:bg-muted">Cancel</button>
          </div>
        </form>
      )}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading && <p className="text-muted-foreground">Loading books…</p>}
        {!isLoading && books.length === 0 && <p className="text-muted-foreground">No books yet — add the first one!</p>}
        {books.map((b) => (
          <div key={b.id} className="flex flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-card shadow-soft transition hover:-translate-y-1">
            <div className="p-5">
              <div className="mb-3 flex items-center justify-between gap-2"><BookOpen className="h-7 w-7 text-primary" /><span className="flex items-center gap-2">{b.theme && <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tagClass(b.theme)}`}>{b.theme}</span>}<AuthorBadge initials={b.author_initials} name={b.author_name} entry={{ table: "books", id: b.id, createdBy: b.created_by }} /></span></div>
              <h3 className="text-lg font-bold text-forest">{b.title}</h3>
              <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{b.why}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
