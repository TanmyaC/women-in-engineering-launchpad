CREATE TABLE public.mentors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  role text NOT NULL CHECK (char_length(role) BETWEEN 1 AND 100),
  topics text[] NOT NULL DEFAULT '{}' CHECK (cardinality(topics) <= 8),
  booking_url text NOT NULL CHECK (booking_url ~ '^https://' AND char_length(booking_url) <= 300),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.mentors TO anon, authenticated;
GRANT ALL ON public.mentors TO service_role;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view mentors" ON public.mentors FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can add a mentor" ON public.mentors FOR INSERT TO anon, authenticated WITH CHECK (true);