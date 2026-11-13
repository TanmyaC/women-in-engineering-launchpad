import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Handshake } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Contact = { id: string; company_id: string; user_id: string; initials: string | null; full_name: string | null };

export function useCompanyContacts() {
  return useQuery({
    queryKey: ["company_contacts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("company_contacts").select("id, company_id, user_id, initials, full_name").order("created_at");
      if (error) throw error;
      return data as Contact[];
    },
  });
}

export function CompanyContacts({ companyId, contacts }: { companyId: string; contacts: Contact[] }) {
  const qc = useQueryClient();
  const [me, setMe] = useState<string | null>(null);
  useEffect(() => { supabase.auth.getUser().then(({ data }) => setMe(data.user?.id ?? null)); }, []);
  const mine = contacts.find((c) => c.user_id === me);
  const toggle = useMutation({
    mutationFn: async () => {
      const { error } = mine
        ? await supabase.from("company_contacts").delete().eq("id", mine.id)
        : await supabase.from("company_contacts").insert({ company_id: companyId });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["company_contacts"] }),
  });
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3">
      <button type="button" onClick={() => toggle.mutate()} disabled={!me || toggle.isPending} aria-pressed={!!mine}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition disabled:opacity-60 ${mine ? "border-sage bg-sage/20 text-forest" : "border-border text-muted-foreground hover:border-forest hover:text-forest"}`}>
        <Handshake size={14} aria-hidden="true" /> {mine ? "You know someone" : "I know someone"}
      </button>
      <TooltipProvider delayDuration={100}>
        <div className="flex -space-x-1.5">
          {contacts.map((c) => (
            <Tooltip key={c.id}>
              <TooltipTrigger asChild>
                <span tabIndex={0} className="inline-flex h-7 w-7 cursor-default items-center justify-center rounded-full border-2 border-card bg-forest text-[10px] font-semibold text-primary-foreground">{c.initials || "?"}</span>
              </TooltipTrigger>
              <TooltipContent>{c.full_name || "Member"} knows someone here</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}
