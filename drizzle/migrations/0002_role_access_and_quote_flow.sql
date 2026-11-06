ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS access_enabled boolean NOT NULL DEFAULT true;

DELETE FROM public.user_roles
WHERE role = 'gerente';

DELETE FROM public.user_roles AS orcamentista
USING public.user_roles AS admin
WHERE orcamentista.user_id = admin.user_id
  AND orcamentista.role = 'orcamentista'
  AND admin.role = 'admin';

CREATE UNIQUE INDEX IF NOT EXISTS user_roles_single_role_idx
  ON public.user_roles (user_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'user_roles_supported_role_check'
      AND conrelid = 'public.user_roles'::regclass
  ) THEN
    ALTER TABLE public.user_roles
      ADD CONSTRAINT user_roles_supported_role_check
      CHECK (role IN ('admin', 'orcamentista'));
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles r
    JOIN public.profiles p ON p.id = r.user_id
    WHERE r.user_id = _user_id
      AND r.role = _role
      AND p.access_enabled
  )
$$;

CREATE OR REPLACE FUNCTION public.has_any_role(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles r
    JOIN public.profiles p ON p.id = r.user_id
    WHERE r.user_id = _user_id
      AND r.role IN ('admin', 'orcamentista')
      AND p.access_enabled
  )
$$;

CREATE OR REPLACE FUNCTION public.set_user_role(_user_id uuid, _role public.app_role)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Somente administradores ativos podem alterar perfis';
  END IF;
  IF _user_id = auth.uid() THEN
    RAISE EXCEPTION 'Não é permitido alterar o próprio perfil';
  END IF;
  IF _role NOT IN ('admin', 'orcamentista') THEN
    RAISE EXCEPTION 'Perfil inválido';
  END IF;

  DELETE FROM public.user_roles
  WHERE user_id = _user_id
    AND role IN ('admin', 'orcamentista');

  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, _role);
END
$$;

REVOKE ALL ON FUNCTION public.set_user_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_user_role(uuid, public.app_role) TO authenticated;

DROP POLICY IF EXISTS "clients write" ON public.clients;
CREATE POLICY "clients admin write" ON public.clients
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "catalog write" ON public.catalog_items;
CREATE POLICY "catalog admin write" ON public.catalog_items
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.quotes_status_guard()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin') THEN
    IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
      IF OLD.status <> 'rascunho' OR NEW.status <> 'pendente' THEN
        RAISE EXCEPTION 'Orçamentistas só podem enviar rascunhos para pendente';
      END IF;
    END IF;
    IF TG_OP = 'INSERT' AND NEW.status NOT IN ('rascunho', 'pendente') THEN
      NEW.status := 'rascunho';
    END IF;
  END IF;
  RETURN NEW;
END
$$;

DROP TRIGGER IF EXISTS quotes_status_guard ON public.quotes;
CREATE TRIGGER quotes_status_guard
  BEFORE INSERT OR UPDATE ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION public.quotes_status_guard();
