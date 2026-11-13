import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { cardClass } from "@/components/SiteShell";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  title: z.string().trim().min(1, "Please add the book name").max(150),
  why: z.string().trim().min(1, "Please tell us why you recommend it").max(800),
});
const input = "w-full rounded-lg border border-input bg-background px-3 py-2 font-normal outline-none focus:ring-2 focus:ring-ring";
const BUCKET = "book-covers";

export function BookShelf() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const { data, error } = await supabase.from("books").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      const paths = data.map((b) => b.cover_path).filter((p): p is string => !!p);
      const urls: Record<string, string> = {};
      if (paths.length) {
        const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrls(paths, 60 * 60 * 24);
        signed?.forEach((s) => { if (s.path && s.signedUrl) urls[s.path] = s.signedUrl; });
      }
      return data.map((b) => ({ ...b, coverUrl: b.cover_path ? urls[b.cover_path] : undefined }));
    },
  });
  const add = useMutation({
    mutationFn: async ({ book, file }: { book: z.infer<typeof schema>; file: File | null }) => {
      let cover_path: string | null = null;
      if (file) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        cover_path = `${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from(BUCKET).upload(cover_path, file, { contentType: file.type });
        if (error) throw error;
      }
      const { error } = await supabase.from("books").insert({ ...book, cover_path });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["books"] }); setOpen(false); },
    onError: () => setError("Something went wrong. Please try again."),
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const parsed = schema.safeParse({ title: f.get("title"), why: f.get("why") });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Please check the form");
    const raw = f.get("cover");
    const file = raw instanceof File && raw.size > 0 ? raw : null;
    if (file && !file.type.startsWith("image/")) return setError("The photo must be an image");
    if (file && file.size > 5 * 1024 * 1024) return setError("The photo must be under 5 MB");
    setError(null);
    add.mutate({ book: parsed.data, file });
  }

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-forest">Books we recommend</h2>
          <p className="mt-1 text-muted-foreground">Reads that shaped your career — share them with the group.</p>
        </div>
        {!open && <button onClick={() => setOpen(true)} className="rounded-full border border-forest px-6 py-3 font-medium text-forest transition hover:bg-secondary">+ Add a book</button>}
      </div>
      {open && (
        <form onSubmit={submit} className={`${cardClass} mt-6 grid gap-4`}>
          <label className="grid gap-1 text-sm font-medium">Book name<input name="title" placeholder="e.g. The Manager's Path" className={input} maxLength={150} /></label>
          <label className="grid gap-1 text-sm font-medium">Why you recommend it<textarea name="why" rows={3} placeholder="What did you take away from it?" className={input} maxLength={800} /></label>
          <label className="grid gap-1 text-sm font-medium">Photo of the book <span className="text-xs font-normal text-muted-foreground">(optional, up to 5 MB)</span><input name="cover" type="file" accept="image/*" className={input} /></label>
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
          <div key={b.id} className={`${cardClass} flex flex-col p-0 overflow-hidden transition hover:-translate-y-1`}>
            <div className="flex aspect-[3/4] items-center justify-center bg-secondary">
              {b.coverUrl ? <img src={b.coverUrl} alt={`Cover of ${b.title}`} loading="lazy" className="h-full w-full object-cover" /> : <BookOpen className="h-12 w-12 text-forest/50" />}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-forest">{b.title}</h3>
              <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{b.why}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
