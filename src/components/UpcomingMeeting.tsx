import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CalendarDays, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthorBadge } from "@/components/AuthorBadge";
import { meetingSchema } from "@/lib/meeting";

type Meeting = { id: string; starts_at: string; meet_url: string; created_by: string | null; author_initials: string | null; author_name: string | null };
const pad = (n: number) => String(n).padStart(2, "0");

export function UpcomingMeeting() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ date: "", time: "", meet_url: "" });
  const [error, setError] = useState<string | null>(null);

  const { data: meeting } = useQuery({
    queryKey: ["meetings", "next"],
    queryFn: async () => {
      const { data, error } = await supabase.from("meetings").select("*").gt("starts_at", new Date().toISOString()).order("starts_at").limit(1);
      if (error) throw error;
      return (data?.[0] ?? null) as Meeting | null;
    },
  });

  const save = useMutation({
    mutationFn: async (v: { starts_at: string; meet_url: string }) => {
      const { error } = editId ? await supabase.from("meetings").update(v).eq("id", editId) : await supabase.from("meetings").insert(v);
      if (error) throw error;
    },
    onSuccess: () => { setOpen(false); setEditId(null); setForm({ date: "", time: "", meet_url: "" }); qc.invalidateQueries({ queryKey: ["meetings"] }); },
    onError: () => setError("Couldn't save the meeting — please try again."),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = meetingSchema().safeParse(form);
    if (!p.success) return setError(p.error.issues[0]?.message ?? "Please check the details");
    setError(null);
    save.mutate(p.data);
  };

  const startEdit = (m: Meeting) => {
    const d = new Date(m.starts_at);
    setForm({ date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, time: `${pad(d.getHours())}:${pad(d.getMinutes())}`, meet_url: m.meet_url });
    setEditId(m.id); setOpen(true); setError(null);
  };

  const input = "rounded-full bg-background px-4 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="relative mt-8 border-t border-forest-foreground/15 pt-5">
      {meeting && !open && (
        <div className="flex flex-wrap items-center gap-3">
          <CalendarDays aria-hidden="true" className="h-5 w-5 text-accent" />
          <p className="text-sm">
            <span className="font-semibold">Upcoming meeting</span>
            <span className="opacity-80"> · {new Date(meeting.starts_at).toLocaleString(undefined, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
          </p>
          <a href={meeting.meet_url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground transition hover:scale-105">Join</a>
          <AuthorBadge initials={meeting.author_initials} name={meeting.author_name} onEdit={() => startEdit(meeting)} entry={{ table: "meetings", id: meeting.id, createdBy: meeting.created_by }} className="text-forest-foreground [&_.badge-initials]:bg-forest-foreground/20 [&_.badge-initials]:text-forest-foreground" />
        </div>
      )}
      {!meeting && !open && (
        <button type="button" onClick={() => { setOpen(true); setError(null); }} className="inline-flex items-center gap-2 rounded-full border border-forest-foreground/30 px-4 py-2 text-sm font-medium transition hover:bg-forest-foreground/10">
          <Plus aria-hidden="true" className="h-4 w-4" /> Set up a meeting
        </button>
      )}
      {open && (
        <form onSubmit={submit} className="flex flex-wrap items-center gap-2">
          <CalendarDays aria-hidden="true" className="h-5 w-5 text-accent" />
          <input type="date" aria-label="Date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={input} />
          <input type="time" aria-label="Time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className={input} />
          <input type="url" aria-label="Google Meet link" placeholder="https://meet.google.com/…" value={form.meet_url} onChange={(e) => setForm({ ...form, meet_url: e.target.value })} className={`${input} min-w-0 flex-1`} />
          <button disabled={save.isPending} className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:scale-105 disabled:opacity-60">{save.isPending ? "Saving…" : editId ? "Save" : "Create"}</button>
          <button type="button" onClick={() => { setOpen(false); setEditId(null); setError(null); }} className="px-2 text-sm opacity-80 hover:opacity-100">Cancel</button>
          {error && <p className="w-full text-sm text-accent">{error}</p>}
        </form>
      )}
    </div>
  );
}
