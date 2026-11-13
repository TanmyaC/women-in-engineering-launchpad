CREATE TABLE public.engineering_resources (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 topic text NOT NULL CHECK (topic IN ('Live coding', 'AI coding', 'AI code reviews', 'System design')),
 name text NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 120),
 why text NOT NULL CHECK (length(trim(why)) BETWEEN 1 AND 800),
 url text NOT NULL CHECK (url ~ '^https://' AND length(url) <= 2000),
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.engineering_resources TO anon, authenticated;
GRANT ALL ON public.engineering_resources TO service_role;
ALTER TABLE public.engineering_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read engineering resources" ON public.engineering_resources FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can share engineering resources" ON public.engineering_resources FOR INSERT TO anon, authenticated WITH CHECK (true);