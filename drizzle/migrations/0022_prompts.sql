CREATE TABLE public.prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  prompt text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  author_initials text
);
GRANT SELECT, INSERT, DELETE ON public.prompts TO authenticated;
GRANT ALL ON public.prompts TO service_role;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view" ON public.prompts FOR SELECT TO authenticated USING (public.is_member(auth.uid()));
CREATE POLICY "Members can add" ON public.prompts FOR INSERT TO authenticated WITH CHECK (public.is_member(auth.uid()));
CREATE POLICY "Authors can delete own entries" ON public.prompts FOR DELETE TO authenticated USING (created_by = auth.uid());
CREATE TRIGGER set_contribution_author BEFORE INSERT ON public.prompts FOR EACH ROW EXECUTE FUNCTION public.set_contribution_author();