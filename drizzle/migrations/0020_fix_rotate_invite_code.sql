CREATE OR REPLACE FUNCTION public.admin_rotate_invite_code()
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
DECLARE _new text;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
  _new := substr(replace(replace(encode(extensions.gen_random_bytes(9), 'base64'), '/', '_'), '+', '-'), 1, 12);
  UPDATE public.invite_settings SET code = _new, updated_at = now() WHERE id = 1;
  RETURN _new;
END $$;