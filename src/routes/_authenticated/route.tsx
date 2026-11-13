import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { INVITE_STORAGE_KEY } from "@/lib/invite";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    const pending = sessionStorage.getItem(INVITE_STORAGE_KEY);
    if (pending) {
      sessionStorage.removeItem(INVITE_STORAGE_KEY);
      await supabase.rpc("redeem_invite", { _code: pending });
    }
    const { data: member } = await supabase.rpc("is_member", { _user_id: data.user.id });
    if (!member) {
      await supabase.auth.signOut();
      throw redirect({ to: "/auth", search: { needInvite: true } });
    }
  },
  component: () => <Outlet />,
});
