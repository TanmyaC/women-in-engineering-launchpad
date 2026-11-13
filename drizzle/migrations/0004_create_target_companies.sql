CREATE TABLE public.target_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  note text CHECK (note IS NULL OR char_length(note) <= 400),
  url text CHECK (url IS NULL OR char_length(url) <= 300),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.target_companies TO anon, authenticated;
GRANT ALL ON public.target_companies TO service_role;
ALTER TABLE public.target_companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view companies" ON public.target_companies FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can add companies" ON public.target_companies FOR INSERT TO anon, authenticated WITH CHECK (true);