CREATE TYPE public.app_role AS ENUM ('admin');
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.admin_list_members()
RETURNS TABLE(user_id uuid, email text, full_name text, joined_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
  RETURN QUERY SELECT m.user_id, u.email::text, COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name')::text, m.joined_at
    FROM public.members m LEFT JOIN auth.users u ON u.id = m.user_id ORDER BY m.joined_at DESC;
END $$;

CREATE OR REPLACE FUNCTION public.admin_remove_member(_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF _user_id = auth.uid() THEN RAISE EXCEPTION 'You cannot remove yourself'; END IF;
  DELETE FROM public.members WHERE user_id = _user_id;
END $$;

CREATE OR REPLACE FUNCTION public.admin_get_invite_code()
RETURNS text LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
  RETURN (SELECT code FROM public.invite_settings WHERE id = 1);
END $$;

CREATE OR REPLACE FUNCTION public.admin_rotate_invite_code()
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _new text;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
  _new := substr(replace(replace(encode(gen_random_bytes(9), 'base64'), '/', '_'), '+', '-'), 1, 12);
  UPDATE public.invite_settings SET code = _new, updated_at = now() WHERE id = 1;
  RETURN _new;
END $$;

REVOKE EXECUTE ON FUNCTION public.admin_list_members() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.admin_remove_member(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.admin_get_invite_code() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.admin_rotate_invite_code() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.admin_list_members(), public.admin_remove_member(uuid), public.admin_get_invite_code(), public.admin_rotate_invite_code() TO authenticated;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE lower(email) = 'tanmyac@gmail.com'
ON CONFLICT DO NOTHING;