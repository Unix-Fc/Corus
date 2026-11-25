CREATE OR REPLACE FUNCTION public.audit_trigger() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  diff jsonb := '{}'::jsonb;
  k text;
  o jsonb;
  n jsonb;
  eid text;
BEGIN
  IF tg_op = 'DELETE' THEN
    o := to_jsonb(old);
    eid := coalesce(o->>'id', o->>'key');
    INSERT INTO public.audit_log(entity, entity_id, action, changes, user_id, user_email)
    VALUES (tg_table_name, eid, 'excluído', o, auth.uid(),
      (SELECT email FROM public.profiles WHERE id = auth.uid()));
    RETURN old;
  END IF;

  n := to_jsonb(new);
  eid := coalesce(n->>'id', n->>'key');
  IF tg_op = 'UPDATE' THEN
    o := to_jsonb(old);
    new.updated_at := now();
    FOR k IN SELECT jsonb_object_keys(n) LOOP
      IF k <> 'updated_at' AND (o->k) IS DISTINCT FROM (n->k) THEN
        diff := diff || jsonb_build_object(k, jsonb_build_object('de', o->k, 'para', n->k));
      END IF;
    END LOOP;
    IF diff = '{}'::jsonb THEN
      RETURN new;
    END IF;
    INSERT INTO public.audit_log(entity, entity_id, action, changes, user_id, user_email)
    VALUES (tg_table_name, eid, 'alterado', diff, auth.uid(),
      (SELECT email FROM public.profiles WHERE id = auth.uid()));
  ELSE
    INSERT INTO public.audit_log(entity, entity_id, action, changes, user_id, user_email)
    VALUES (
      tg_table_name,
      eid,
      'criado',
      CASE WHEN tg_table_name = 'quotes' THEN n ELSE NULL END,
      auth.uid(),
      (SELECT email FROM public.profiles WHERE id = auth.uid())
    );
  END IF;
  RETURN new;
END
$$;
