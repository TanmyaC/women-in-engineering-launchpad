CREATE TABLE public.members (user_id uuid PRIMARY KEY, joined_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.members TO authenticated;
GRANT ALL ON public.members TO service_role;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members see own row" ON public.members FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.invite_settings (id int PRIMARY KEY DEFAULT 1 CHECK (id = 1), code text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.invite_settings TO service_role;
ALTER TABLE public.invite_settings ENABLE ROW LEVEL SECURITY;
INSERT INTO public.invite_settings (id, code) VALUES (1, 'It3trlSwcQ5-');

CREATE OR REPLACE FUNCTION public.is_member(_user_id uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.members WHERE user_id = _user_id) $$;

CREATE OR REPLACE FUNCTION public.redeem_invite(_code text) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM public.members WHERE user_id = auth.uid()) THEN RETURN true; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.invite_settings WHERE code = _code) THEN RETURN false; END IF;
  INSERT INTO public.members (user_id) VALUES (auth.uid()) ON CONFLICT DO NOTHING;
  RETURN true;
END $$;
REVOKE EXECUTE ON FUNCTION public.redeem_invite(text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.redeem_invite(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_member(uuid) TO authenticated;

DO $$
DECLARE t text; p record;
BEGIN
  FOREACH t IN ARRAY ARRAY['topics','mentors','job_tools','target_companies','best_practices','books','engineering_resources','engineering_tips'] LOOP
    FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename=t LOOP
      EXECUTE format('DROP POLICY %I ON public.%I', p.policyname, t);
    END LOOP;
    EXECUTE format('REVOKE ALL ON public.%I FROM anon', t);
    EXECUTE format('GRANT SELECT, INSERT ON public.%I TO authenticated', t);
    EXECUTE format('CREATE POLICY "Members can view" ON public.%I FOR SELECT TO authenticated USING (public.is_member(auth.uid()))', t);
    IF t = 'topics' THEN
      EXECUTE 'CREATE POLICY "Members can add" ON public.topics FOR INSERT TO authenticated WITH CHECK (public.is_member(auth.uid()) AND votes = 1)';
    ELSE
      EXECUTE format('CREATE POLICY "Members can add" ON public.%I FOR INSERT TO authenticated WITH CHECK (public.is_member(auth.uid()))', t);
    END IF;
  END LOOP;
END $$;
REVOKE EXECUTE ON FUNCTION public.upvote_topic(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.upvote_topic(uuid) TO authenticated;