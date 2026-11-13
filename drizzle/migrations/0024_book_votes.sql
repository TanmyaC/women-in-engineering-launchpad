CREATE TABLE public.book_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (book_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.book_votes TO authenticated;
GRANT ALL ON public.book_votes TO service_role;
ALTER TABLE public.book_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view" ON public.book_votes FOR SELECT TO authenticated USING (public.is_member(auth.uid()));
CREATE POLICY "Members vote as themselves" ON public.book_votes FOR INSERT TO authenticated WITH CHECK (public.is_member(auth.uid()) AND user_id = auth.uid());
CREATE POLICY "Remove own vote" ON public.book_votes FOR DELETE TO authenticated USING (user_id = auth.uid());