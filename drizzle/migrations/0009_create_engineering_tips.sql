CREATE TABLE public.engineering_tips (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 topic text NOT NULL CHECK (topic IN ('Live coding', 'AI coding', 'AI code reviews', 'System design')),
 tip text NOT NULL CHECK (length(trim(tip)) > 0 AND tip !~ E'[\n\r]'),
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.engineering_tips TO anon, authenticated;
GRANT ALL ON public.engineering_tips TO service_role;
ALTER TABLE public.engineering_tips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read engineering tips" ON public.engineering_tips FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can share engineering tips" ON public.engineering_tips FOR INSERT TO anon, authenticated WITH CHECK (true);