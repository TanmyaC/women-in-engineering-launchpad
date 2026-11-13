CREATE TABLE public.company_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.target_companies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  initials text,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (company_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.company_contacts TO authenticated;
GRANT ALL ON public.company_contacts TO service_role;
ALTER TABLE public.company_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view" ON public.company_contacts FOR SELECT TO authenticated USING (public.is_member(auth.uid()));
CREATE POLICY "Members add themselves" ON public.company_contacts FOR INSERT TO authenticated WITH CHECK (public.is_member(auth.uid()) AND user_id = auth.uid());
CREATE POLICY "Remove own" ON public.company_contacts FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.set_company_contact_name()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _name text;
BEGIN
  NEW.user_id := auth.uid();
  SELECT COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', email) INTO _name FROM auth.users WHERE id = auth.uid();
  NEW.full_name := _name;
  NEW.initials := upper(left(regexp_replace(COALESCE(
    (SELECT string_agg(left(w,1), '') FROM unnest(string_to_array(trim(_name), ' ')) w WHERE w <> ''), '?'), '[^[:alpha:]]', '', 'g'), 3));
  RETURN NEW;
END $$;
CREATE TRIGGER set_company_contact_name BEFORE INSERT ON public.company_contacts
FOR EACH ROW EXECUTE FUNCTION public.set_company_contact_name();