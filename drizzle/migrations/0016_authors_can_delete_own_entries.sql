DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['topics','mentors','job_tools','target_companies','best_practices','books','engineering_resources','engineering_tips'] LOOP
    EXECUTE format('GRANT DELETE ON public.%I TO authenticated', t);
    EXECUTE format('CREATE POLICY "Authors can delete own entries" ON public.%I FOR DELETE TO authenticated USING (created_by = auth.uid())', t);
  END LOOP;
END $$;