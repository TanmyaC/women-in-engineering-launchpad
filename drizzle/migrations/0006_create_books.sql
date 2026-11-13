CREATE TABLE public.books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 150),
  why text NOT NULL CHECK (char_length(why) BETWEEN 1 AND 800),
  cover_path text CHECK (cover_path IS NULL OR char_length(cover_path) <= 200),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.books TO anon, authenticated;
GRANT ALL ON public.books TO service_role;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view books" ON public.books FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can add books" ON public.books FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Anyone can view book covers" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'book-covers');
CREATE POLICY "Anyone can upload book covers" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'book-covers');