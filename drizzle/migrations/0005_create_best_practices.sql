CREATE TABLE public.best_practices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  description text NOT NULL CHECK (char_length(description) BETWEEN 1 AND 800),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.best_practices TO anon, authenticated;
GRANT ALL ON public.best_practices TO service_role;
ALTER TABLE public.best_practices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view best practices" ON public.best_practices FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can add best practices" ON public.best_practices FOR INSERT TO anon, authenticated WITH CHECK (true);