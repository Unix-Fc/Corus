ALTER TABLE public.quotes
  ADD COLUMN client_name_snapshot text,
  ADD COLUMN monthly_hours numeric(14, 4) NOT NULL DEFAULT 220
    CHECK (monthly_hours > 0);

UPDATE public.quotes q
SET client_name_snapshot = c.name
FROM public.clients c
WHERE q.client_id = c.id
  AND q.client_name_snapshot IS NULL;

ALTER TABLE public.material_price_history
  ADD COLUMN material_name_snapshot text;

UPDATE public.material_price_history h
SET material_name_snapshot = c.name
FROM public.catalog_items c
WHERE h.material_id = c.id
  AND h.material_name_snapshot IS NULL;

ALTER TABLE public.material_price_history
  ALTER COLUMN material_id DROP NOT NULL,
  ALTER COLUMN material_name_snapshot SET NOT NULL,
  DROP CONSTRAINT material_price_history_material_fkey,
  ADD CONSTRAINT material_price_history_material_id_fkey
    FOREIGN KEY (material_id) REFERENCES public.catalog_items (id)
    ON DELETE SET NULL;

CREATE OR REPLACE FUNCTION public.snapshot_material_price_name()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  material_name text;
BEGIN
  IF NEW.material_id IS NOT NULL THEN
    SELECT name INTO material_name
    FROM public.catalog_items
    WHERE id = NEW.material_id AND kind = 'material';
    IF material_name IS NULL THEN
      RAISE EXCEPTION 'O histórico de preços deve referenciar um material cadastrado';
    END IF;
    IF NEW.material_name_snapshot IS NULL OR btrim(NEW.material_name_snapshot) = '' THEN
      NEW.material_name_snapshot := material_name;
    END IF;
  END IF;
  IF NEW.material_name_snapshot IS NULL OR btrim(NEW.material_name_snapshot) = '' THEN
    RAISE EXCEPTION 'Informe o nome do material para preservar o histórico';
  END IF;
  RETURN NEW;
END
$$;

CREATE TRIGGER snapshot_material_price_name
  BEFORE INSERT OR UPDATE ON public.material_price_history
  FOR EACH ROW EXECUTE FUNCTION public.snapshot_material_price_name();

CREATE OR REPLACE FUNCTION public.preserve_client_quotes_before_delete()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.quotes
  SET client_name_snapshot = COALESCE(client_name_snapshot, OLD.name),
      client_id = NULL
  WHERE client_id = OLD.id;
  RETURN OLD;
END
$$;

CREATE TRIGGER preserve_client_quotes_before_delete
  BEFORE DELETE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.preserve_client_quotes_before_delete();

CREATE OR REPLACE FUNCTION public.preserve_catalog_references_before_delete()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  id_field text;
  name_field text;
BEGIN
  IF OLD.kind = 'material' THEN
    UPDATE public.material_price_history
    SET material_name_snapshot = COALESCE(material_name_snapshot, OLD.name),
        material_id = NULL
    WHERE material_id = OLD.id;

    UPDATE public.quotes q
    SET materials = (
      SELECT COALESCE(
        jsonb_agg(
          CASE
            WHEN line.value->>'item_id' = OLD.id::text
              THEN line.value - 'item_id'
            ELSE line.value
          END
          ORDER BY line.ordinality
        ),
        '[]'::jsonb
      )
      FROM jsonb_array_elements(q.materials)
        WITH ORDINALITY AS line(value, ordinality)
    )
    WHERE q.materials @> jsonb_build_array(
      jsonb_build_object('item_id', OLD.id::text)
    );
  ELSIF OLD.kind = 'servico' THEN
    UPDATE public.quotes q
    SET services = (
      SELECT COALESCE(
        jsonb_agg(
          CASE
            WHEN line.value->>'item_id' = OLD.id::text
              THEN line.value - 'item_id'
            ELSE line.value
          END
          ORDER BY line.ordinality
        ),
        '[]'::jsonb
      )
      FROM jsonb_array_elements(q.services)
        WITH ORDINALITY AS line(value, ordinality)
    )
    WHERE q.services @> jsonb_build_array(
      jsonb_build_object('item_id', OLD.id::text)
    );
  END IF;

  id_field := CASE OLD.kind
    WHEN 'maquina' THEN 'machine_id'
    WHEN 'ferramenta' THEN 'tool_id'
    WHEN 'cargo' THEN 'cargo_id'
    ELSE NULL
  END;
  name_field := CASE OLD.kind
    WHEN 'maquina' THEN 'machine_name_snapshot'
    WHEN 'ferramenta' THEN 'tool_name_snapshot'
    WHEN 'cargo' THEN 'cargo_name_snapshot'
    ELSE NULL
  END;

  IF id_field IS NOT NULL THEN
    UPDATE public.quotes q
    SET operations = (
      SELECT COALESCE(
        jsonb_agg(
          CASE
            WHEN operation.value->>id_field = OLD.id::text THEN
              jsonb_set(
                jsonb_set(
                  operation.value,
                  ARRAY[id_field],
                  'null'::jsonb,
                  true
                ),
                ARRAY[name_field],
                to_jsonb(
                  COALESCE(
                    NULLIF(operation.value->>name_field, ''),
                    OLD.name
                  )
                ),
                true
              )
            ELSE operation.value
          END
          ORDER BY operation.ordinality
        ),
        '[]'::jsonb
      )
      FROM jsonb_array_elements(q.operations)
        WITH ORDINALITY AS operation(value, ordinality)
    )
    WHERE q.operations @> jsonb_build_array(
      jsonb_build_object(id_field, OLD.id::text)
    );
  END IF;

  RETURN OLD;
END
$$;

CREATE TRIGGER preserve_catalog_references_before_delete
  BEFORE DELETE ON public.catalog_items
  FOR EACH ROW EXECUTE FUNCTION public.preserve_catalog_references_before_delete();

REVOKE ALL ON FUNCTION public.snapshot_material_price_name()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.preserve_client_quotes_before_delete()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.preserve_catalog_references_before_delete()
  FROM PUBLIC, anon, authenticated;

INSERT INTO public.calc_parameters (key, label, value, unit, validated, note)
VALUES (
  'horas_mensais_cargo',
  'Horas mensais para custo-hora de cargo',
  220,
  'h/mês',
  false,
  'Aplicado a novos orçamentos; os existentes preservam o valor salvo.'
)
ON CONFLICT (key) DO NOTHING;
