DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['best_practices','books','engineering_resources','engineering_tips','job_tools','mentors','target_companies','topics','prompts'] LOOP
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS author_name text', t);
    EXECUTE format('UPDATE public.%I x SET author_name = coalesce(u.raw_user_meta_data->>''full_name'', u.raw_user_meta_data->>''name'', u.email) FROM auth.users u WHERE u.id = x.created_by', t);
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public.set_contribution_author()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE full_name text; em text;
BEGIN
  NEW.created_by := auth.uid();
  IF auth.uid() IS NOT NULL THEN
    SELECT coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name'), email INTO full_name, em FROM auth.users WHERE id = auth.uid();
    NEW.author_name := coalesce(nullif(btrim(full_name), ''), em);
    IF full_name IS NOT NULL AND btrim(full_name) <> '' THEN
      SELECT upper(string_agg(left(w, 1), '')) INTO NEW.author_initials
      FROM (SELECT w FROM regexp_split_to_table(btrim(full_name), '\s+') WITH ORDINALITY AS t(w, n) ORDER BY n LIMIT 2) s;
    ELSE
      NEW.author_initials := upper(left(coalesce(em, '?'), 1));
    END IF;
  END IF;
  RETURN NEW;
END $function$;