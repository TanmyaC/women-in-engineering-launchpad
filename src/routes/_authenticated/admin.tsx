import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, cardClass } from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useIsAdmin } from "@/hooks/use-is-admin";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Miro Women In Engineering" }, { name: "description", content: "Manage members and the invite link." }, { property: "og:title", content: "Admin — Miro Women In Engineering" }, { property: "og:description", content: "Manage members and the invite link." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

function Admin() {
  const { data: isAdmin, isLoading } = useIsAdmin();
  if (isLoading) return <p className="mx-auto max-w-6xl px-6 py-14 text-muted-foreground">Loading…</p>;
  if (!isAdmin) return <p className="mx-auto max-w-6xl px-6 py-14 text-muted-foreground">This page is only for the group admin.</p>;
  return (
    <>
      <PageHeader eyebrow="Admin" title="Manage the community" intro="See who has joined, remove members and refresh the invite link." />
      <div className="mx-auto grid max-w-6xl gap-6 px-6 pb-16">
        <InviteCard />
        <MembersCard />
      </div>
    </>
  );
}

function InviteCard() {
  const qc = useQueryClient();
  const { data: code } = useQuery({
    queryKey: ["admin-invite"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("admin_get_invite_code");
      if (error) throw error;
      return data as string;
    },
  });
  const rotate = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("admin_rotate_invite_code");
      if (error) throw error;
      return data as string;
    },
    onSuccess: (c) => { qc.setQueryData(["admin-invite"], c); toast.success("New invite link created. The old one no longer works."); },
    onError: () => toast.error("Couldn't refresh the link."),
  });
  const link = code ? `${typeof window !== "undefined" ? window.location.origin : ""}/join?code=${code}` : "";
  return (
    <section className={cardClass}>
      <h2 className="text-xl font-bold text-forest">Invite link</h2>
      <p className="mt-1 text-sm text-muted-foreground">Share this with people you want to let in.</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <code className="min-w-0 flex-1 truncate rounded-lg bg-muted px-3 py-2 text-sm">{link || "…"}</code>
        <Button variant="secondary" size="sm" disabled={!link} onClick={() => { navigator.clipboard.writeText(link); toast.success("Link copied"); }}>
          <Copy aria-hidden="true" /> Copy
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" disabled={rotate.isPending}><RefreshCw aria-hidden="true" /> New link</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Create a new invite link?</AlertDialogTitle>
              <AlertDialogDescription>The current link will stop working. Existing members keep their access.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep current</AlertDialogCancel>
              <AlertDialogAction onClick={() => rotate.mutate()}>Create new link</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </section>
  );
}

function MembersCard() {
  const qc = useQueryClient();
  const { data: me } = useQuery({ queryKey: ["me-id"], queryFn: async () => (await supabase.auth.getUser()).data.user?.id ?? null });
  const { data: members = [], isLoading } = useQuery({
    queryKey: ["admin-members"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("admin_list_members");
      if (error) throw error;
      return data ?? [];
    },
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc("admin_remove_member", { _user_id: id });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-members"] }); toast.success("Member removed"); },
    onError: () => toast.error("Couldn't remove this member."),
  });
  return (
    <section className={cardClass}>
      <h2 className="text-xl font-bold text-forest">Members <span className="text-muted-foreground">({members.length})</span></h2>
      {isLoading ? <p className="mt-4 text-sm text-muted-foreground">Loading…</p> : (
        <ul className="mt-4 divide-y divide-border">
          {members.map((m) => (
            <li key={m.user_id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-forest">{m.full_name || m.email || "Unknown"}</p>
                <p className="truncate text-sm text-muted-foreground">{m.email} · joined {new Date(m.joined_at).toLocaleDateString()}</p>
              </div>
              {m.user_id === me ? <span className="text-xs text-muted-foreground">You</span> : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label={`Remove ${m.full_name ?? m.email}`}><Trash2 aria-hidden="true" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove this member?</AlertDialogTitle>
                      <AlertDialogDescription>They will lose access to the site. They can rejoin only with the invite link.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep</AlertDialogCancel>
                      <AlertDialogAction onClick={() => remove.mutate(m.user_id)}>Remove</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
