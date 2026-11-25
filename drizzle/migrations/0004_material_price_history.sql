CREATE TYPE public.material_price_kind AS ENUM ('compra', 'referencia');

ALTER TABLE public.catalog_items ADD CONSTRAINT catalog_items_id_kind_key UNIQUE (id, kind);

CREATE TABLE public.material_price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id uuid NOT NULL,
  material_kind public.catalog_kind NOT NULL DEFAULT 'material' CHECK (material_kind = 'material'),
  kind public.material_price_kind NOT NULL,
  unit_price numeric NOT NULL CHECK (
    unit_price > 0 AND unit_price <= 999999999999.99 AND unit_price = trunc(unit_price, 2)
  ),
  unit text NOT NULL CHECK (
    char_length(unit) <= 24
    AND unit COLLATE pg_catalog."C"
      ~ U&'[^\0009-\000D\0020\00A0\1680\2000-\200A\2028\2029\202F\205F\3000\FEFF]'
  ),
  occurred_on date CHECK (occurred_on BETWEEN DATE '0001-01-01' AND DATE '9999-12-31'),
  source text NOT NULL CHECK (
    char_length(source) <= 400
    AND source COLLATE pg_catalog."C"
      ~ U&'[^\0009-\000D\0020\00A0\1680\2000-\200A\2028\2029\202F\205F\3000\FEFF]'
  ),
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT material_price_history_material_fkey FOREIGN KEY (material_id, material_kind)
    REFERENCES public.catalog_items (id, kind) ON DELETE RESTRICT
);

CREATE INDEX material_price_history_material_date_idx
  ON public.material_price_history (material_id, occurred_on DESC NULLS LAST, id DESC);

ALTER TABLE public.material_price_history ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.material_price_history FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.material_price_history TO authenticated;
GRANT INSERT (material_id, kind, unit_price, unit, occurred_on, source)
  ON public.material_price_history TO authenticated;
GRANT ALL ON public.material_price_history TO service_role;

CREATE POLICY "material price history read" ON public.material_price_history
  FOR SELECT TO authenticated USING (public.has_any_role(auth.uid()));

CREATE POLICY "material price history insert" ON public.material_price_history
  FOR INSERT TO authenticated WITH CHECK (
    created_by = auth.uid() AND public.has_role(auth.uid(), 'admin')
  );

CREATE TRIGGER audit_material_price_history
  BEFORE INSERT OR UPDATE OR DELETE ON public.material_price_history
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();
