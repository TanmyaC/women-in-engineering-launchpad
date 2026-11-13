CREATE TABLE public.job_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 100),
  description text NOT NULL CHECK (char_length(description) BETWEEN 1 AND 600),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.job_tools TO anon, authenticated;
GRANT ALL ON public.job_tools TO service_role;
ALTER TABLE public.job_tools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view tools" ON public.job_tools FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can add tools" ON public.job_tools FOR INSERT TO anon, authenticated WITH CHECK (true);