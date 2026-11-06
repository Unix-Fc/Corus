DELETE FROM public.user_roles WHERE role = 'gerente';
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','orcamentista'))
$$;
DROP POLICY IF EXISTS "quotes read" ON public.quotes;
DROP POLICY IF EXISTS "quotes update" ON public.quotes;
DROP POLICY IF EXISTS "quotes insert" ON public.quotes;
CREATE POLICY "quotes read" ON public.quotes FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin') OR (public.has_role(auth.uid(),'orcamentista') AND created_by = auth.uid()));
CREATE POLICY "quotes update" ON public.quotes FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin') OR (public.has_role(auth.uid(),'orcamentista') AND created_by = auth.uid())) WITH CHECK (public.has_role(auth.uid(),'admin') OR (public.has_role(auth.uid(),'orcamentista') AND created_by = auth.uid()));
CREATE POLICY "quotes insert" ON public.quotes FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin') OR (public.has_role(auth.uid(),'orcamentista') AND created_by = auth.uid()));
ALTER TABLE public.quotes ALTER COLUMN created_by SET DEFAULT auth.uid();
CREATE OR REPLACE FUNCTION public.quotes_status_guard() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(),'admin') THEN
    IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
      RAISE EXCEPTION 'Somente administradores podem alterar o estado do orçamento';
    END IF;
    IF TG_OP = 'INSERT' AND NEW.status <> 'rascunho' THEN
      NEW.status := 'rascunho';
    END IF;
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS quotes_status_guard ON public.quotes;
CREATE TRIGGER quotes_status_guard BEFORE INSERT OR UPDATE ON public.quotes FOR EACH ROW EXECUTE FUNCTION public.quotes_status_guard();
DROP POLICY IF EXISTS "audit read" ON public.audit_log;
CREATE POLICY "audit read" ON public.audit_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
COMMENT ON TYPE public.app_role IS 'gerente value is DEPRECATED: no longer used';