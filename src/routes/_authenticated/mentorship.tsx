import { AuthorBadge } from "@/components/AuthorBadge";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { PageHeader, cardClass } from "@/components/SiteShell";
import { supabase } from "@/integrations/supabase/client";
import { Check, Copy, UserPlus } from "lucide-react";
import linkedinLogo from "@/assets/linkedin-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { mentorProfileSchema as schema } from "@/lib/mentor-profile";

export const Route = createFileRoute("/_authenticated/mentorship")({
  head: () => ({ meta: [{ title: "Mentorship — Miro Women In Engineering" }, { name: "description", content: "Connect with a mentor on LinkedIn or add yourself as a mentor." }, { property: "og:title", content: "Mentorship — Miro Women In Engineering" }, { property: "og:description", content: "Connect with a mentor on LinkedIn or add yourself as a mentor." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Mentorship,
});

const input = "w-full rounded-lg border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring";

function Mentorship() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [copyStatus, setCopyStatus] = useState<Record<string, "copied" | "failed">>({});
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
      name: f.get("name"), role: f.get("role"), linkedin_url: f.get("linkedin_url") ?? "",
      topics: String(f.get("topics") ?? "").split(",").map((t) => t.trim()).filter(Boolean),
    });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Please check the form");
    setError(null);
    add.mutate(parsed.data);
  }

  async function copyLinkedIn(id: string, url: string) {
    let copied = false;
    try {
      await navigator.clipboard.writeText(url);
      copied = true;
    } catch {
      const field = document.createElement("textarea");
      field.value = url;
      field.setAttribute("readonly", "");
      field.className = "fixed left-0 top-0 opacity-0";
      document.body.appendChild(field);
      field.select();
      try { copied = document.execCommand("copy"); } catch { copied = false; }
      field.remove();
    }
    setCopyStatus((previous) => ({ ...previous, [id]: copied ? "copied" : "failed" }));
  }

  return (
    <>
      <PageHeader eyebrow="Mentorship" title="Connect with a mentor" intro="Find a mentor whose experience matches what you're working on and reach out on LinkedIn to arrange a conversation — or add yourself and help others grow." />
      <section className="mx-auto max-w-6xl px-6 pb-8">
        {done && <p className="mb-4 rounded-lg bg-secondary px-4 py-3 text-secondary-foreground">Thank you! You're now listed as a mentor.</p>}
        {!open ? (
          <Button size="lg" onClick={() => { setOpen(true); setDone(false); }} className="h-12 w-full rounded-lg px-6 text-base font-semibold shadow-soft sm:w-auto"><UserPlus aria-hidden="true" />Add yourself as a mentor</Button>
        ) : (
          <form onSubmit={submit} className={`${cardClass} grid gap-4 md:grid-cols-2`}>
            <h2 className="text-2xl font-bold text-forest md:col-span-2">Become a mentor</h2>
            <label className="grid content-start gap-1 text-sm font-medium">Name<input name="name" className={input} maxLength={100} /></label>
            <label className="grid content-start gap-1 text-sm font-medium">Function<input name="role" list="functions" placeholder="e.g. Engineering, Product, Design" className={input} maxLength={100} /><datalist id="functions">{["Engineering", "Product", "Design", "Data", "Engineering Management", "Research"].map((f) => <option key={f} value={f} />)}</datalist></label>
            <label className="grid content-start gap-1 text-sm font-medium">Topics you can help with<input name="topics" placeholder="Career growth, System design" className={input} /><span className="text-xs font-normal text-muted-foreground">Separate with commas</span></label>
            <label className="grid content-start gap-1 text-sm font-medium">LinkedIn profile<input name="linkedin_url" type="url" required placeholder="https://www.linkedin.com/in/your-name" className={input} maxLength={300} /><span className="text-xs font-normal text-muted-foreground">Members will reach out to you on LinkedIn.</span></label>
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
          <div key={m.id} className="flex min-w-0 flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-sage">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-lg font-semibold text-secondary-foreground">{m.name[0]}</div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold leading-snug text-forest [overflow-wrap:anywhere]">{m.name}</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">{m.role}</p>
              </div>
              <AuthorBadge initials={m.author_initials} className="ml-auto self-start" />
            </div>
            <div className="mb-4 mt-4 flex flex-wrap gap-1.5">{m.topics.map((t) => <span key={t} className="rounded-md bg-secondary/60 px-2.5 py-1 text-xs text-secondary-foreground">{t}</span>)}</div>
            <div className="relative mt-auto border-t border-border pt-3">{m.linkedin_url ? <>
              <div className="flex items-center gap-2">
                <a href={m.linkedin_url} title={m.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex min-w-0 flex-1 items-center gap-2 rounded-sm text-xs leading-relaxed text-forest underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><img src={linkedinLogo.url} alt="" width={18} height={18} className="h-4.5 w-4.5 shrink-0" /><span className="min-w-0 flex-1 truncate">{m.linkedin_url}</span></a>
                <TooltipProvider><Tooltip><TooltipTrigger asChild>
                  <Button type="button" variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground hover:text-forest" aria-label={`Copy LinkedIn link for ${m.name}`} onClick={() => { if (m.linkedin_url) void copyLinkedIn(m.id, m.linkedin_url); }}>
                    {copyStatus[m.id] === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                  </Button>
                </TooltipTrigger><TooltipContent>Copy LinkedIn link</TooltipContent></Tooltip></TooltipProvider>
              </div>
              <p role="status" className={copyStatus[m.id] ? "mt-1 text-xs text-muted-foreground" : "sr-only"}>{copyStatus[m.id] === "copied" ? "Link copied!" : copyStatus[m.id] === "failed" ? "Copy unavailable. Select the link below." : ""}</p>
              {copyStatus[m.id] === "failed" && <input aria-label={`LinkedIn link for ${m.name}`} readOnly value={m.linkedin_url} onFocus={(event) => event.currentTarget.select()} className={`${input} mt-1 text-xs`} />}
            </> : <p className="text-sm text-muted-foreground">LinkedIn profile not yet added.</p>}</div>
          </div>
        ))}
      </section>
    </>
  );
}
