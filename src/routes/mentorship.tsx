import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { PageHeader, cardClass } from "@/components/SiteShell";
import { supabase } from "@/integrations/supabase/client";
import { Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mentorProfileSchema as schema } from "@/lib/mentor-profile";

export const Route = createFileRoute("/mentorship")({
  head: () => ({ meta: [{ title: "Mentorship — Miro Women In Engineering" }, { name: "description", content: "Book a session with a mentor or add yourself as a mentor." }, { property: "og:title", content: "Mentorship — Miro Women In Engineering" }, { property: "og:description", content: "Book a session with a mentor or add yourself as a mentor." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Mentorship,
});

const input = "w-full rounded-lg border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring";

function Mentorship() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const { data: mentors = [], isLoading } = useQuery({
    queryKey: ["mentors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("mentors").select("*").order("created_at");
      if (error) throw error;
      return data;
    },
  });
  const add = useMutation({
    mutationFn: async (m: z.infer<typeof schema>) => {
      const { error } = await supabase.from("mentors").insert(m);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["mentors"] }); setOpen(false); setDone(true); },
    onError: () => setError("Something went wrong saving your profile. Please try again."),
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: f.get("name"), role: f.get("role"), booking_url: f.get("booking_url"), linkedin_url: f.get("linkedin_url") ?? "",
      topics: String(f.get("topics") ?? "").split(",").map((t) => t.trim()).filter(Boolean),
    });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Please check the form");
    setError(null);
    add.mutate(parsed.data);
  }

  return (
    <>
      <PageHeader eyebrow="Mentorship" title="Book time with a mentor" intro="Pick a mentor whose experience matches what you're working on and grab a slot — or add yourself and help others grow." />
      <section className="mx-auto max-w-6xl px-6 pb-8">
        {done && <p className="mb-4 rounded-lg bg-secondary px-4 py-3 text-secondary-foreground">Thank you! You're now listed as a mentor.</p>}
        {!open ? (
          <Button variant="outline" onClick={() => { setOpen(true); setDone(false); }} className="h-auto rounded-full border-forest px-6 py-3 text-forest hover:bg-secondary">+ Add yourself as a mentor</Button>
        ) : (
          <form onSubmit={submit} className={`${cardClass} grid gap-4 md:grid-cols-2`}>
            <h2 className="text-2xl font-bold text-forest md:col-span-2">Become a mentor</h2>
            <label className="grid content-start gap-1 text-sm font-medium">Name<input name="name" className={input} maxLength={100} /></label>
            <label className="grid content-start gap-1 text-sm font-medium">Function<input name="role" list="functions" placeholder="e.g. Engineering, Product, Design" className={input} maxLength={100} /><datalist id="functions">{["Engineering", "Product", "Design", "Data", "Engineering Management", "Research"].map((f) => <option key={f} value={f} />)}</datalist></label>
            <label className="grid content-start gap-1 text-sm font-medium">Topics you can help with<input name="topics" placeholder="Career growth, System design" className={input} /><span className="text-xs font-normal text-muted-foreground">Separate with commas</span></label>
            <label className="grid content-start gap-1 text-sm font-medium">Booking link<input name="booking_url" placeholder="https://calendly.com/your-name" className={input} maxLength={300} /></label>
            <label className="grid content-start gap-1 text-sm font-medium md:col-span-2">LinkedIn profile (optional)<input name="linkedin_url" type="url" placeholder="https://www.linkedin.com/in/your-name" className={input} maxLength={300} /></label>
            {error && <p className="text-sm text-destructive md:col-span-2">{error}</p>}
            <div className="flex gap-3 md:col-span-2">
              <Button disabled={add.isPending} className="h-auto rounded-full px-6 py-2.5">{add.isPending ? "Saving…" : "Add me"}</Button>
              <Button variant="ghost" type="button" onClick={() => setOpen(false)} className="h-auto rounded-full px-6 py-2.5 text-muted-foreground hover:bg-muted">Cancel</Button>
            </div>
          </form>
        )}
      </section>
      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && <p className="text-muted-foreground">Loading mentors…</p>}
        {!isLoading && mentors.length === 0 && <p className="text-muted-foreground">No mentors yet — be the first!</p>}
        {mentors.map((m) => (
          <div key={m.id} className={`${cardClass} flex flex-col`}>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-warm font-display text-xl font-bold text-primary-foreground">{m.name[0]}</div>
            <h2 className="mt-4 text-xl font-bold text-forest">{m.name}</h2>
            <p className="text-muted-foreground">{m.role}</p>
            {m.linkedin_url && <Button asChild variant="link" className="mt-2 h-auto justify-start self-start p-0 text-forest"><a href={m.linkedin_url} target="_blank" rel="noopener noreferrer"><Linkedin aria-hidden="true" />LinkedIn profile</a></Button>}
            <div className="mt-3 flex flex-wrap gap-2">{m.topics.map((t) => <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">{t}</span>)}</div>
            <a href={m.booking_url} target="_blank" rel="noreferrer" className="mt-auto pt-6"><span className="block rounded-full bg-primary px-5 py-2.5 text-center font-medium text-primary-foreground transition hover:opacity-90">Book a session</span></a>
          </div>
        ))}
      </section>
    </>
  );
}
