CREATE OR REPLACE FUNCTION public.set_contribution_author() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE full_name text; em text;
BEGIN
  NEW.created_by := auth.uid();
  IF auth.uid() IS NOT NULL THEN
    SELECT coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name'), email INTO full_name, em FROM auth.users WHERE id = auth.uid();
    IF full_name IS NOT NULL AND btrim(full_name) <> '' THEN
      SELECT upper(string_agg(left(w, 1), '')) INTO NEW.author_initials
      FROM (SELECT w FROM regexp_split_to_table(btrim(full_name), '\s+') WITH ORDINALITY AS t(w, n) ORDER BY n LIMIT 2) s;
    ELSE
      NEW.author_initials := upper(left(coalesce(em, '?'), 1));
    END IF;
  END IF;
  RETURN NEW;
END $$;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['topics','mentors','job_tools','target_companies','best_practices','books','engineering_resources','engineering_tips'] LOOP
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS created_by uuid, ADD COLUMN IF NOT EXISTS author_initials text', t);
    EXECUTE format('CREATE TRIGGER set_author BEFORE INSERT ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_contribution_author()', t);
  END LOOP;
END $$;