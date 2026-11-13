import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ThumbsUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Vote = { id: string; book_id: string; user_id: string };

export function useBookVotes() {
  return useQuery({
    queryKey: ["book_votes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("book_votes").select("id, book_id, user_id");
      if (error) throw error;
      return data as Vote[];
    },
  });
}

export function BookVote({ bookId, votes }: { bookId: string; votes: Vote[] }) {
  const qc = useQueryClient();
  const [me, setMe] = useState<string | null>(null);
  useEffect(() => { supabase.auth.getUser().then(({ data }) => setMe(data.user?.id ?? null)); }, []);
  const mine = votes.find((v) => v.user_id === me);
  const toggle = useMutation({
    mutationFn: async () => {
      const { error } = mine
        ? await supabase.from("book_votes").delete().eq("id", mine.id)
        : await supabase.from("book_votes").insert({ book_id: bookId });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["book_votes"] }),
  });
  return (
    <button type="button" onClick={() => toggle.mutate()} disabled={!me || toggle.isPending} aria-pressed={!!mine}
      aria-label={mine ? "Remove your thumbs up" : "Give this book a thumbs up"}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition disabled:opacity-60 ${mine ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}>
      <ThumbsUp size={14} aria-hidden="true" className={mine ? "fill-current" : ""} /> {votes.length}
    </button>
  );
}
