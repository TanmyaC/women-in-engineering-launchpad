CREATE TABLE public.topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) BETWEEN 3 AND 120),
  votes integer NOT NULL DEFAULT 1 CHECK (votes >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.topics TO anon, authenticated;
GRANT ALL ON public.topics TO service_role;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view topics" ON public.topics FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can suggest topics" ON public.topics FOR INSERT TO anon, authenticated WITH CHECK (votes = 1);
CREATE FUNCTION public.upvote_topic(_id uuid) RETURNS integer
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.topics SET votes = votes + 1 WHERE id = _id RETURNING votes;
$$;
REVOKE ALL ON FUNCTION public.upvote_topic(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.upvote_topic(uuid) TO anon, authenticated;