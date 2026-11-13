import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Table = keyof Database["public"]["Tables"];
let cachedUserId: Promise<string | null> | null = null;
function useUserId() {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    cachedUserId ??= supabase.auth.getUser().then(({ data }) => data.user?.id ?? null);
    void cachedUserId.then(setId);
    const { data } = supabase.auth.onAuthStateChange((_e, s) => { cachedUserId = Promise.resolve(s?.user.id ?? null); setId(s?.user.id ?? null); });
    return () => data.subscription.unsubscribe();
  }, []);
  return id;
}

export function AuthorBadge({ initials, className = "", entry, onEdit }: {
  onEdit?: () => void;
  initials?: string | null | undefined;
  className?: string;
  entry?: { table: Table; id: string; createdBy?: string | null | undefined };
}) {
  const userId = useUserId();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const mine = !!entry && !!userId && entry.createdBy === userId;
  const remove = async () => {
    if (!entry) return;
    setBusy(true);
    const { error } = await (supabase.from(entry.table as "topics").delete().eq("id", entry.id));
    setBusy(false);
    if (error) { toast.error("Couldn't delete this entry."); return; }
    toast.success("Deleted");
    await qc.invalidateQueries();
  };
  if (!initials && !mine) return null;
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 ${className}`}>
      {mine && onEdit && (
        <button type="button" onClick={onEdit} aria-label="Edit your entry" title="Edit your entry"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full opacity-60 transition hover:bg-muted hover:opacity-100">
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
      {mine && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button type="button" disabled={busy} aria-label="Delete your entry" title="Delete your entry"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full opacity-60 transition hover:bg-destructive/10 hover:text-destructive hover:opacity-100 disabled:opacity-30">
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
              <AlertDialogDescription>It will be removed for everyone. This can't be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep it</AlertDialogCancel>
              <AlertDialogAction onClick={remove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {initials && (
        <span title={`Added by ${initials}`} aria-label={`Added by ${initials}`}
          className="badge-initials inline-flex h-7 w-7 items-center justify-center rounded-full bg-sage/25 font-display text-[11px] font-semibold text-forest">
          {initials}
        </span>
      )}
    </span>
  );
}
