CREATE TABLE public.meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  starts_at timestamptz NOT NULL,
  meet_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  author_initials text,
  author_name text
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meetings TO authenticated;
GRANT ALL ON public.meetings TO service_role;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view" ON public.meetings FOR SELECT TO authenticated USING (public.is_member(auth.uid()));
CREATE POLICY "Members can add" ON public.meetings FOR INSERT TO authenticated WITH CHECK (public.is_member(auth.uid()));
CREATE POLICY "Authors can update own" ON public.meetings FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
CREATE POLICY "Authors can delete own entries" ON public.meetings FOR DELETE TO authenticated USING (created_by = auth.uid());
CREATE TRIGGER set_meetings_author BEFORE INSERT ON public.meetings FOR EACH ROW EXECUTE FUNCTION public.set_contribution_author();